# CLAUDE.md

Static Astro site for Victoria Rojas, audiobook narrator. Deployed on Netlify,
content edited by a non-technical user through Sveltia CMS at `/admin`.

`vra-build-spec.md` is the design spec. `docs/operations.md` holds domain,
hosting and billing facts. This file holds the things that will bite you.

---

## Architecture

```
src/
  components/   Astro components. Interactive ones inline their own vanilla JS.
  content/      titles, gallery, testimonials, settings — all CMS-editable
  data/         site.ts, taxonomy.ts, pricing.ts, intakeForm.ts (code-only)
  layouts/      BaseLayout — head, SEO, schema, chrome
  pages/        index, about, works, contact, thanks, robots.txt.ts
  styles/       global.css — every design token, defined once
  utils/        content.ts (guarded loaders), format.ts
scripts/        generate-peaks, generate-forms-file, check-forms
public/         audio, fonts, admin, icons, og image
```

**No runtime JS dependencies.** The waveform player and quote calculator are
hand-written vanilla JS inlined by Astro. Don't reach for a library.

**Design tokens live only in `src/styles/global.css`.** Colours, type scale and
spacing are CSS custom properties. Never hard-code a hex or a px value from the
scale in a component.

**Surfaces alternate.** Three background values (`base`, `deep`, `panel`) run
down every page and no two consecutive sections may share one. The footer is
`deep`, so the last band before it must not be. Changing one section's surface
usually means changing its neighbour's.

---

## Content collections

| Collection | Shape | Rendered by |
|---|---|---|
| `titles` | one YAML per audiobook, covers in `covers/` | TitleCard, WaveformPlayer, Proof, TitleSchema |
| `gallery` | one YAML per photo, `image` relative to `../../assets` | Gallery |
| `testimonials` | one YAML per quote; empty by design | Proof |
| `settings` | single `delivery.yaml` | DeliverySpec |

**Always load through `src/utils/content.ts`**, never `getCollection` directly.
Those helpers drop entries that can't render (a title with no title, a photo
with no image) and log `[content] skipped …` instead of failing the build.

---

## Constraints that aren't obvious from the code

### 1. No audio may be fetched before user interaction

The player draws from precomputed peak envelopes in `src/data/peaks/`. An MP3
is assigned to `audio.src` **only on first play of that track** — never on page
load, never on track select, never as a preload hint.

This is the reason the peaks pipeline exists at all. If you find yourself
adding `<audio src>` or a preload, you've broken the core constraint. Lighthouse
should report zero `.mp3` requests on load.

The player reuses one `Audio` element across tracks, so `currentTime` outlives
a selection change. `select()` must cancel the rAF loop **synchronously** before
zeroing, and every handler that writes progress must check `loadedId ===
current.id` — a trailing frame from the outgoing track will otherwise divide the
old `currentTime` by the new duration.

### 2. Images in `src/`, audio in `public/`

Only `src/` assets go through sharp. Anything in `public/` ships at full size in
its original format. Photos and cover art belong in `src/assets` or
`src/content/**`; the CMS is configured to upload there.

Audio belongs in `public/audio` — MP3s are already compressed and Astro would
not process them anyway.

### 3. Content edits must never be able to fail the build

Sveltia writes a value for every field in the form, including blanks. Depending
on the widget that arrives as `null`, `''` or `{}` — never as an absent key.
A plain `.optional()` rejects all three, and the first entry Vikki saved took
the whole deploy down.

Every optional field in `src/content.config.ts` is wrapped in `optional()`,
`optionalNumber()`, `numberOr()` or `booleanOr()`, which normalise blank →
`undefined` **before** validation and `.catch()` any surviving failure.
Required-ish fields resolve to a sentinel and the entry is skipped by the
loader instead.

**When adding a field, wrap it.** An unwrapped `.optional()` is a latent outage.

### 4. Never hardcode a domain

`site` in `astro.config.mjs` reads `process.env.URL`, which Netlify sets to the
site's primary address. Canonical tags, `og:url`, the sitemap and `robots.txt`
all derive from it, so the cutover to `victoriarojasaudio.com` needs no code
change and there is no window where the canonical points at the old Wix site.

`LOCAL_FALLBACK` only applies outside Netlify.

### 5. `public/__forms.html` is generated at build time

Netlify's parser registers forms from static HTML at deploy time and **cannot
see forms rendered from `.astro` components** — that's why submissions used to
404. `scripts/generate-forms-file.mjs` writes `dist/__forms.html` from
`src/data/intakeForm.ts`, and `scripts/check-forms.mjs` then reads the built
HTML of both `/contact` and `/__forms.html` and fails the build if the form
name, hidden `form-name`, honeypot or field names diverge.

Adding a field to the contact form means adding it to `intakeForm.ts` too. The
build stops otherwise, which is the point.

Don't try to produce this file from `src/pages/__forms.html.ts` — Astro excludes
underscore-prefixed files from routing, so it silently emits nothing.

---

## Gotchas

- **Astro's content store is at `node_modules/.astro/data-store.json`**, not
  `.astro/`. Deleting `.astro` does not clear it, and stale entries will keep
  appearing in builds after you've removed the files.
- **Sveltia rewrites whole files on save and strips comments.** Never put
  load-bearing information in a comment inside a CMS-managed file.
- **`astro dev` daemonizes in v7.** `npm run dev` returns immediately;
  `npx astro dev stop` is the only way to stop it.
- **PowerShell 5.1 mangles UTF-8.** `Get-Content` reads em-dashes as ANSI and
  `Set-Content` writes the mojibake back. Use the Write/Edit tools for files
  containing non-ASCII, not shell round-trips.
- **Scoped component styles land in the page's inlined `<style>`**, not always
  the shared bundle. Verifying CSS by grepping the wrong file gives false
  negatives — and class names in CSS selectors inflate markup counts.
- **`--c-quiet` (`#9A9BA4`) is contrast-critical.** It must clear 4.5:1 against
  `--c-panel`. The previous value failed AA at 4.21:1.
