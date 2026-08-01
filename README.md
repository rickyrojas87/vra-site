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
```

As of Astro 7, `astro dev` daemonizes: `npm run dev` forks the server to the
background and returns, so closing the terminal leaves it running and Ctrl-C has
nothing to interrupt. Manage it with `npx astro dev stop`, `npx astro dev status`,
and `npx astro dev logs`.

## Layout

```
src/
  components/    Header, Footer, TitleCard, DeliverySpec, CtaBand, Placeholder
  content/
    titles/      Titles collection — one YAML file per book (see its README)
  data/site.ts   Wordmark, email, external links (null = still needed)
  layouts/       BaseLayout — head, fonts, header/footer chrome
  pages/         index.astro (spec section 3)
  styles/        global.css — color, type, spacing tokens
```

## Built / not built

Built: global tokens, Header (spec 2), Home (spec 3), Footer (spec 7), Titles
collection (spec 5), Netlify config.

Not built yet: `/about`, `/works`, `/contact` pages, and the three custom
elements — waveform player, voice range matrix, quote calculator (spec 8).
Everything blocked on assets renders as a dashed `Placeholder` at the correct
dimensions; each one names what it's waiting on.
