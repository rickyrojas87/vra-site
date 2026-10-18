# CLAUDE.md

Static Astro site for Victoria Rojas, audiobook narrator. Deployed on Netlify,
content edited by a non-technical user through Sveltia CMS at `/admin`.

`docs/design/` holds the approved artboards (read its README first): their
markup, CSS values, spacing and copy are what the pages match, one to one.
`vra-build-spec.md` and `vra-build-spec-v2.md` describe intent where the
artboards are silent. `docs/operations.md` holds domain, hosting and billing
facts. This file holds the things that will bite you.

---

## Architecture

```
src/
  components/   Astro components. Interactive ones inline their own vanilla JS.
  content/      titles, gallery, testimonials, settings — all CMS-editable
  data/         site.ts, taxonomy.ts, pricing.ts, intakeForm.ts (code-only);
                audible.json (written by the sync, committed)
  layouts/      BaseLayout — head, SEO, schema, chrome
  pages/        index, about, works, contact, thanks, robots.txt.ts
  styles/       global.css — every design token, defined once
  utils/        content.ts (guarded loaders, Audible merge), catalog.ts, format.ts
scripts/        sync-audible, generate-peaks, generate-forms-file, check-forms
.github/        weekly-rebuild workflow (Mondays and the 1st)
public/         audio, fonts, admin, icons, og image
```

**No runtime JS dependencies.** The waveform player and the estimator are
hand-written vanilla JS inlined by Astro. Don't reach for a library.

**Design tokens live only in `src/styles/global.css`.** Colours, type scale and
spacing are CSS custom properties. Never hard-code a hex or a px value from the
scale in a component.

**Surfaces alternate.** Three background values (`base`, `deep`, `panel`) run
down every page and no two consecutive sections may share one. The footer is
`deep`, so the last band before it must not be. Changing one section's surface
usually means changing its neighbour's. Sections also fade in from the
previous surface with `.join .join--from-*`, so a surface change means
updating the next section's `join--from-*` too. Every hero (Home's video,
`PageHero` elsewhere) fades into deep at its foot, so section 01 is deep with
no join. The Home stats strip is the one deliberate exception: a thin band,
deep like section 01 below it.

**Sections fade up on load with `.reveal`** (time-based, global.css). The v1
scroll reveal (`data-reveal`) is gone; don't reintroduce an observer.

**The header lives inside each hero, not in BaseLayout.** `Header.astro` is
the artboard's `.nav` row over the video or poster: rendered by `Hero.astro`,
`PageHero.astro` and the Thanks page as the first child of their container.
It is not sticky and has no background, so nothing reserves space for it; a
new page without a hero must render `<Header />` itself.

**Every hero's LCP image is the library poster.** `PageHero` and Home's `Hero`
render it from `utils/heroPoster.ts`, and each page puts
`<HeroPreloads slot="head" />` in BaseLayout's head slot. Keep the `<img>` and
the preload on that one helper or the poster downloads twice.

**Every other image is `fetchpriority="low"`** (and lazy unless it sits
beside the title on desktop, like the Home hero photo). Lighthouse's mobile
simulation shares one slow connection between everything requested early, so
a near-fold portrait or background at default priority pushes the poster's
paint back 0.3–0.5 s and costs two points. Keep new images low priority.

**Sections after a hero use `content-visibility: auto`** — Home's rule in
index.astro (after the stats strip), the inner pages' in global.css
(`.page-hero ~ section`). Below-fold layout then stays out of the first
paint. Side effect: full-page screenshots of the built site show those
sections blank; that is a capture artefact, not a bug — scroll to them.

**Home's hero photo is a pre-cut crop.** `src/assets/hero-main.jpg` is
`main.jpg` cropped to the frame's 11:15 at the artboard's 52% focal point, so
the page serves a frame-sized file instead of the 1600px landscape. The
command is in Hero.astro; redo it if main.jpg changes.

---

## Content collections

| Collection | Shape | Rendered by |
|---|---|---|
| `titles` | one YAML per audiobook, covers in `covers/` | BookCard, WaveformPlayer, StatsStrip, Hero, TitleSchema |
| `gallery` | one YAML per photo, `image` relative to `../../assets` | About 04, first three |
| `testimonials` | one YAML per quote | home/Testimonials |
| `settings` | `settings/delivery.yaml` only | Studio (Equipment and Delivery lists; Home shows the first four delivery lines), booking badge |
| `process` | `settings/process.yaml`, one `steps` list | home/Process (short), About 02 (long) |

**Always load through `src/utils/content.ts`**, never `getCollection` directly.
Those helpers drop entries that can't render (a title with no title, a photo
with no image) and log `[content] skipped …` instead of failing the build.
`loadTitles()` is also where Audible data is merged in (constraint 6), so a
title read any other way would show stale YAML numbers.

Each settings file has its own collection, matched by filename, so adding a
file to `src/content/settings/` means adding a collection for it too.

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

### 6. Audible data overrides the YAML, and the sync must never fail a build

`scripts/sync-audible.mjs` runs first in `npm run build`. It reads each
title's `audibleUrl`, takes the ASIN, calls Audible's public catalog API and
writes `src/data/audible.json` (rating, rating count, runtime minutes, release
date, series). `loadTitles()` merges it over the YAML field by field: Audible
first, YAML where Audible has nothing. Cover, sample audio, genre and status
always come from the YAML.

A failed fetch keeps that title's previous entry and warns; the script always
exits 0, and writes `{}` if there is no file at all, because content.ts
imports it. Commit `audible.json` whenever it changes so a build without
network still has data. `SKIP_AUDIBLE_SYNC=1` skips the network for offline
builds. The ASIN regex exists in both the script and content.ts; change both.

Shelf order, "Latest release" and "Just published" sort by Audible's release
date, falling back to the YAML year. `.github/workflows/weekly-rebuild.yml`
POSTs to the Netlify build hook in the `NETLIFY_BUILD_HOOK` secret every
Monday and on the 1st (booking badge); scheduled workflows only run from the
default branch.

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
- **Markup injected with `set:html` carries no scope attribute**, so a scoped
  rule like `.wordmark svg` never matches it — the logo lockups need
  `.wordmark :global(svg)`. Same trap for anything else inlined as raw HTML.
- **The logo's colour is a CSS `fill`, not the file's.** The lockups in
  `src/assets/logos/` ship `fill="#D4AF37"` on the root `<svg>`; the header and
  footer override it to `var(--c-text)`. The `-ivory` and `-dark` variants are
  for print and other non-CSS uses — don't wire them into a component.
- **A family's latin and latin-ext `@font-face` rules must carry identical
  `font-weight` and `font-style` descriptors.** Chrome only merges faces into
  one unicode-range-segmented font when the descriptors match exactly;
  otherwise it picks the closest group by weight and never consults the
  other. With `300` / `400` latin faces beside a `300 400` latin-ext face,
  every weight-300 Cormorant heading rendered in Georgia for months, and no
  tool flagged it. Each family now has one face per subset over the variable
  file's full axis. Check `CSS.getPlatformFontsForNode` (or DevTools'
  rendered-fonts panel), not `document.fonts`, when a face looks wrong.
- **The handwriting face is `font-display: optional`, inlined, and loaded by
  script.** A swap moved the centred hero line (CLS), so it must be ready at
  first paint or not used at all. Its Basic Latin subset is inlined by
  `HeroPreloads.astro`, which also calls `document.fonts.load()`: a declared
  face, even a `data:` one, isn't fetched until text needs it, and Chrome
  gives a non-preloaded optional face no block period, so without that call
  slow connections kept the fallback. Verify font changes on a throttled cold
  load, not just in Lighthouse, which reported CLS 0 either way.
- **`--c-quiet` (`#9A9BA4`) is contrast-critical.** It must clear 4.5:1 against
  `--c-panel`. The previous value failed AA at 4.21:1.
