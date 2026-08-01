# VRA 2026

Static site for Victoria Rojas Audio, built with Astro. `vra-build-spec.md` is the
design spec and the source of truth — section 1 tokens live in
`src/styles/global.css` and should not be duplicated anywhere else.

## Run it

```bash
npm install     # once
npm run dev     # http://localhost:4321
npm run build   # static output to dist/
npm run preview # serve dist/ exactly as Netlify will
npm run peaks   # regenerate waveform data after adding/replacing a demo MP3
```

`npm run peaks` decodes every MP3 in `public/audio` with a build-time ffmpeg
binary and writes amplitude envelopes to `src/data/peaks/`. Commit that JSON —
it is deliberately not part of `npm run build`, so deploys need no ffmpeg. The
player draws from those envelopes and fetches an MP3 only when someone presses
play on that track.

As of Astro 7, `astro dev` daemonizes: `npm run dev` forks the server to the
background and returns, so closing the terminal leaves it running and Ctrl-C has
nothing to interrupt. Manage it with `npx astro dev stop`, `npx astro dev status`,
and `npx astro dev logs`.

## Layout

```
public/
  audio/         Demo MP3s, served as-is (not optimized)
  fonts/         Self-hosted woff2 — no third-party font request
src/
  assets/        portrait.jpg, booth.jpg — optimized by sharp at build
  components/    Header, Footer, PageHeader, TitleCard, DeliverySpec, CtaBand, Placeholder
  content/
    titles/      Titles collection — one YAML per book, covers/ alongside
  data/          site.ts (wordmark, links) and taxonomy.ts (genres, accents)
  layouts/       BaseLayout — head, fonts, header/footer chrome
  pages/         index, about, works, contact (spec sections 3–6)
  styles/        global.css — color, type, spacing tokens
```

Images belong in `src/`, not `public/`. Only `src/` assets go through sharp;
anything in `public/` ships at full size in its original format. Audio lives in
`public/audio` because it isn't processed either way.

## Built / not built

Built: global tokens, Header (spec 2), all four pages — Home (3), About (4),
Works (5), Contact (6) — Footer (7), Titles collection, Netlify config.

Not built yet: the three custom elements — waveform player, voice range matrix,
quote calculator (spec 8). Everything blocked on assets renders as a dashed
`Placeholder` at the correct dimensions; each one names what it's waiting on.

The contact form posts to [Netlify Forms](https://docs.netlify.com/forms/setup/)
via `data-netlify="true"` — it only collects submissions once deployed to Netlify,
and does nothing locally.
