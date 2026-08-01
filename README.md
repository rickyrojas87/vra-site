# VRA 2026

Marketing site for **Victoria Rojas**, audiobook narrator — Central Texas.
Static Astro site on Netlify, with content edited through Sveltia CMS.

`vra-build-spec.md` is the design spec. `CLAUDE.md` holds the non-obvious
constraints. `docs/operations.md` holds the domain, hosting and billing facts.

---

## Stack

| | |
|---|---|
| Framework | Astro 7 (static output) |
| Hosting | Netlify |
| CMS | Sveltia, GitHub backend, Netlify OAuth |
| Forms | Netlify Forms |
| Images | `astro:assets` / sharp |
| Fonts | Self-hosted woff2, no third-party request |
| JS | Vanilla, inlined. No runtime dependencies. |

Two dependencies (`astro`, `@astrojs/sitemap`) and one devDependency
(`ffmpeg-static`, build-time only). Nothing audio- or UI-related ships to the
browser as a library.

---

## Running it locally

```bash
npm install     # once
npm run dev     # http://localhost:4321
npm run build   # static output to dist/
npm run preview # serve dist/ as Netlify will
```

### `astro dev` daemonizes in v7

`npm run dev` **forks the server to the background and returns immediately**.
Closing the terminal does not stop it, and Ctrl-C has nothing to interrupt.

```bash
npx astro dev status   # is it running, and on what URL
npx astro dev stop     # actually stop it
npx astro dev logs     # tail output
```

If `localhost:4321` stops responding, run `astro dev status` first — it
distinguishes "not running" (just restart) from "running but wedged" (stop,
check nothing else holds the port, restart).

`dev` and `start` both pass `--host`, so the site is reachable from a phone on
the same network. The network URL is printed on start.

---

## Deploying

Push to `main`. Netlify builds and publishes automatically. There is no manual
deploy step and no staging branch.

Build command is `npm run build`, which chains four steps:

```
generate-peaks --missing-only  →  astro build  →  generate-forms-file  →  check-forms
```

`netlify.toml` sets `X-Robots-Tag: noindex` on deploy-preview and branch-deploy
contexts only. Production deliberately has no such header.

Rollback is `git revert` and push. There is no undo button.

**Deploys cost credits.** Batch pushes rather than deploying every small
change — see `docs/operations.md`.

---

## Where content lives

```
src/content/
  titles/        one YAML per audiobook, covers/ alongside
  gallery/       one YAML per About-page photo
  testimonials/  one YAML per quote (empty; section hides itself)
  settings/      delivery.yaml — studio list, delivery specs, turnaround
src/assets/      photos (portrait, booth, gallery sources)
src/data/        site.ts, taxonomy.ts, pricing.ts, intakeForm.ts
public/audio/    demo MP3s
public/fonts/    self-hosted woff2
public/admin/    Sveltia CMS (index.html + config.yml)
```

Vikki edits `titles`, `gallery`, `testimonials` and `settings` at `/admin`.
Everything else is code.

**Images belong in `src/`**, where sharp optimises them. Audio belongs in
`public/audio`, because MP3s are already compressed and are never processed.

---

## Waveform peaks

The demo player draws from precomputed amplitude envelopes so **no MP3 is ever
fetched before the user presses play**.

```bash
npm run peaks          # rebuild every envelope
npm run peaks:missing  # only generate ones that don't exist yet
```

`generate-peaks.mjs` decodes each MP3 in `public/audio` with a build-time
ffmpeg binary and writes ~1.8 KB of JSON per track to `src/data/peaks/`.

`build` runs `--missing-only` first, so a demo uploaded through the CMS — which
commits an MP3 but cannot run a script — gets its waveform on the next deploy
with nobody intervening. Existing envelopes are skipped, so a normal build does
no ffmpeg work at all.

Commit the JSON. Re-run the full `npm run peaks` only if the sampling changes.

---

## Outstanding

- **Author testimonials** — the collection and rendering exist; no entries written
- **Turnaround time per finished hour** — field exists and is empty, so the line
  doesn't render
- **Logo** — the wordmark is text-only; there's no mark
- **Accent recordings** for the voice range matrix (About §3, phase 2)
- **IndexNow integration**

See `vra-build-spec.md` §10 for the full list including technical items.
