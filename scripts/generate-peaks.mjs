/**
 * Build-time waveform peak extraction.
 *
 *   npm run peaks
 *
 * Decodes every MP3 in public/audio with the ffmpeg static binary and writes a
 * normalized amplitude envelope to src/data/peaks/<name>.json. The player
 * renders its canvas from that JSON, so a page can draw all seven waveforms
 * without touching a single audio file — the MP3 is fetched only when the user
 * presses play on that track.
 *
 * Two modes:
 *
 *   npm run peaks            rebuild every envelope from scratch
 *   npm run peaks:missing    only generate envelopes that don't exist yet
 *
 * `build` runs the second one first, so a demo uploaded through the CMS — which
 * commits an MP3 but cannot run a script — gets its waveform on the next deploy
 * with nobody intervening. Existing files are left alone, so a normal build does
 * no ffmpeg work at all.
 *
 * ffmpeg-static is a devDependency. Nothing audio-related ships to the browser.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';
import ffmpeg from 'ffmpeg-static';

const here = dirname(fileURLToPath(import.meta.url));
const audioDir = join(here, '..', 'public', 'audio');
const outDir = join(here, '..', 'src', 'data', 'peaks');

/** Within the 400-600 the design calls for. 440 bars is more than any realistic
 *  canvas width can show, so the renderer downsamples rather than interpolates. */
const SAMPLE_COUNT = 440;

/** Envelope only — 8 kHz is ample and keeps the decode buffer small. */
const RATE = 8000;

mkdirSync(outDir, { recursive: true });

const MISSING_ONLY = process.argv.includes('--missing-only');

const all = readdirSync(audioDir)
  .filter((f) => f.toLowerCase().endsWith('.mp3'))
  .sort();

if (!all.length) {
  // Not an error in missing-only mode: a site with no demos is a valid state.
  if (MISSING_ONLY) {
    console.log('peaks: no MP3s in public/audio, nothing to do');
    process.exit(0);
  }
  console.error('No MP3s found in public/audio.');
  process.exit(1);
}

const outPath = (file) => join(outDir, basename(file, '.mp3') + '.json');
const files = MISSING_ONLY ? all.filter((f) => !existsSync(outPath(f))) : all;

if (MISSING_ONLY && !files.length) {
  console.log(`peaks: all ${all.length} envelope(s) present, nothing to generate`);
  process.exit(0);
}

console.log(
  `Extracting peaks from ${files.length} file(s) at ${SAMPLE_COUNT} samples each` +
    (MISSING_ONLY ? ` (missing only, ${all.length} total)` : '') +
    '\n',
);

let totalJson = 0;

for (const file of files) {
  const input = join(audioDir, file);

  // Decode to raw mono 16-bit PCM on stdout. No intermediate file.
  const pcm = execFileSync(
    ffmpeg,
    ['-v', 'error', '-i', input, '-f', 's16le', '-acodec', 'pcm_s16le', '-ac', '1', '-ar', String(RATE), '-'],
    { maxBuffer: 1024 * 1024 * 512 },
  );

  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.byteLength / 2));
  const duration = samples.length / RATE;

  // Peak (not RMS) per bucket: it keeps transients visible, which is what makes
  // a speech waveform legible at a glance.
  const bucket = samples.length / SAMPLE_COUNT;
  const peaks = new Array(SAMPLE_COUNT);
  let max = 0;

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const start = Math.floor(i * bucket);
    const end = Math.min(samples.length, Math.floor((i + 1) * bucket));
    let peak = 0;
    for (let j = start; j < end; j++) {
      const v = Math.abs(samples[j]);
      if (v > peak) peak = v;
    }
    peaks[i] = peak;
    if (peak > max) max = peak;
  }

  // Normalize to 0-1 against the track's own loudest moment, then round to two
  // decimals — a third decimal is invisible at 3px per bar and costs ~20% size.
  const scale = max || 1;
  const normalized = peaks.map((p) => Math.round((p / scale) * 100) / 100);

  const out = {
    duration: Math.round(duration * 100) / 100,
    samples: SAMPLE_COUNT,
    peaks: normalized,
  };

  const target = outPath(file);
  writeFileSync(target, JSON.stringify(out));

  const jsonBytes = statSync(target).size;
  const mp3Bytes = statSync(input).size;
  totalJson += jsonBytes;

  const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  console.log(
    `  ${file.padEnd(32)} ${mmss(duration).padStart(5)}  ` +
      `mp3 ${(mp3Bytes / 1024 / 1024).toFixed(2).padStart(5)} MB  ->  ` +
      `json ${(jsonBytes / 1024).toFixed(1).padStart(5)} KB`,
  );
}

console.log(`\ntotal JSON: ${(totalJson / 1024).toFixed(1)} KB across ${files.length} tracks`);
console.log(`written to src/data/peaks/`);
