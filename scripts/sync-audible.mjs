/**
 * Audible sync — spec v2 §7. Runs first in `npm run build`.
 *
 * For every title with an `audibleUrl`, takes the ASIN from the URL, fetches
 * the public catalog API and writes src/data/audible.json: rating, rating
 * count, runtime in minutes, release date, series name and number, keyed by
 * ASIN. src/utils/content.ts merges it over the YAML when titles load.
 *
 * It can never fail the build:
 *   - a title whose fetch fails keeps its previously committed entry, with a
 *     warning; with no previous entry it is simply absent and the YAML stands
 *   - any unexpected error is logged and the script still exits 0
 *   - SKIP_AUDIBLE_SYNC=1 skips the network entirely (offline builds)
 *
 * audible.json is committed, so a build with no network still has data. The
 * file is rewritten only when a value changed, so local builds don't dirty
 * the working tree for nothing.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TITLES_DIR = path.join(root, 'src/content/titles');
const OUT = path.join(root, 'src/data/audible.json');
const API = 'https://api.audible.com/1.0/catalog/products';
const GROUPS = 'rating,product_desc,product_attrs,series';
const TIMEOUT_MS = 10_000;

const log = (msg) => console.log(`[audible] ${msg}`);
const warn = (msg) => console.warn(`[audible] warning: ${msg}`);

/**
 * ASIN from an Audible product URL: the 10-character segment that ends the
 * path, e.g. /pd/Fragile-Steps-Audiobook/B0GLRCZ5GR. Same rule as asinFromUrl
 * in src/utils/content.ts; keep the two in step.
 */
function asinFromUrl(url) {
  try {
    const m = new URL(url).pathname.match(/\/([A-Z0-9]{10})\/?$/i);
    return m ? m[1].toUpperCase() : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Title name and audibleUrl from each YAML file. A line match rather than a
 * YAML parser keeps this script dependency-free; Sveltia writes both keys as
 * plain top-level scalars, quoted or not.
 */
async function readTitles() {
  const files = (await readdir(TITLES_DIR)).filter((f) => /\.ya?ml$/.test(f));
  const titles = [];
  for (const file of files) {
    const text = await readFile(path.join(TITLES_DIR, file), 'utf8');
    const field = (key) =>
      text.match(new RegExp(`^${key}:[ \\t]*(['"]?)(.*?)\\1[ \\t]*$`, 'm'))?.[2].trim() || undefined;
    const url = field('audibleUrl');
    const asin = url && asinFromUrl(url);
    if (url && !asin) warn(`${file}: no ASIN in audibleUrl "${url}"`);
    if (asin) titles.push({ file, title: field('title') ?? file, asin });
  }
  return titles;
}

/** One product, reduced to the fields the site uses. Throws on any doubt. */
async function fetchProduct(asin) {
  const res = await fetch(`${API}/${asin}?response_groups=${GROUPS}`, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const product = (await res.json())?.product;
  if (!product || product.asin !== asin) throw new Error('no product in response');

  const overall = product.rating?.overall_distribution;
  const count = Number.isInteger(overall?.num_ratings) ? overall.num_ratings : null;
  const series = Array.isArray(product.series) ? product.series[0] : undefined;
  return {
    // Audible reports 0 for an unrated title; that is "no rating", not zero.
    rating: count && typeof overall.average_rating === 'number' ? overall.average_rating : null,
    ratingCount: count,
    runtimeMinutes: Number.isInteger(product.runtime_length_min) ? product.runtime_length_min : null,
    releaseDate: product.release_date ?? product.issue_date ?? null,
    series: series?.title ?? null,
    seriesNumber: series?.sequence ?? null,
  };
}

/** The committed file, or null when it is missing or unreadable. */
async function readPrevious() {
  try {
    return JSON.parse(await readFile(OUT, 'utf8'));
  } catch {
    return null;
  }
}

const describe = (before, after) =>
  Object.keys(after)
    .filter((k) => JSON.stringify(before?.[k] ?? null) !== JSON.stringify(after[k]))
    .map((k) => `${k} ${JSON.stringify(before?.[k] ?? null)} -> ${JSON.stringify(after[k])}`);

async function main() {
  if (process.env.SKIP_AUDIBLE_SYNC) {
    log('skipped (SKIP_AUDIBLE_SYNC set); using the committed audible.json');
    return;
  }

  const titles = await readTitles();
  const committed = await readPrevious();
  const previous = committed ?? {};
  const next = {};

  const results = await Promise.all(
    titles.map(async (t) => {
      try {
        return { t, data: await fetchProduct(t.asin) };
      } catch (err) {
        return { t, error: err?.name === 'TimeoutError' ? 'timed out' : String(err?.message ?? err) };
      }
    }),
  );

  const updated = [];
  for (const { t, data, error } of results) {
    if (error) {
      if (previous[t.asin]) {
        next[t.asin] = previous[t.asin];
        warn(`${t.title} (${t.asin}): ${error}; kept the previous values`);
      } else {
        warn(`${t.title} (${t.asin}): ${error}; no previous values, the YAML stands`);
      }
      continue;
    }
    next[t.asin] = data;
    const changes = describe(previous[t.asin], data);
    if (changes.length) updated.push(`${t.title}: ${changes.join(', ')}`);
  }

  const sorted = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]));
  const text = `${JSON.stringify(sorted, null, 2)}\n`;
  // Always leave a file behind: content.ts imports it, so a missing file
  // would fail the build even though the YAML could carry every title.
  if (!committed || JSON.stringify(sorted) !== JSON.stringify(committed)) await writeFile(OUT, text);

  const failed = results.filter((r) => r.error).length;
  log(`${results.length - failed} of ${results.length} titles fetched${failed ? `, ${failed} failed` : ''}`);
  if (updated.length) for (const line of updated) log(`updated ${line}`);
  else log('no changes');
}

try {
  await main();
} catch (err) {
  warn(`sync aborted: ${err?.stack ?? err}; the build continues with the committed audible.json`);
  if (!(await readPrevious())) await writeFile(OUT, '{}\n').catch(() => {});
}
