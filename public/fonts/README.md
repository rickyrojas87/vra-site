# Fonts

Cormorant Garamond, Raleway and La Belle Aurore, self-hosted. All three are licensed under the
[SIL Open Font License 1.1](https://openfontlicense.org/), which permits
redistribution alongside the site.

Files were taken from the Google Fonts CSS API (`css2`, requested with a modern
browser UA so it serves woff2) and are unmodified.

Cormorant and Raleway are **variable** fonts: one file per family per subset
covers the whole weight axis. That is why `cormorant-garamond-latin.woff2` backs
both the 300 and 400 `@font-face` blocks, and `raleway-latin.woff2` backs 400,
500 and 600 (its axis runs 100–900). Do not add per-weight files — there is
nothing to gain.

| File | Covers |
|---|---|
| `cormorant-garamond-latin.woff2` | Cormorant Garamond 300 + 400, latin |
| `cormorant-garamond-latin-ext.woff2` | Cormorant Garamond 300–400, latin-ext |
| `cormorant-garamond-italic-latin.woff2` | Cormorant Garamond Italic 300–500, latin |
| `cormorant-garamond-italic-latin-ext.woff2` | Cormorant Garamond Italic 300–500, latin-ext |
| `raleway-latin.woff2` | Raleway 400 + 500 + 600, latin |
| `raleway-latin-ext.woff2` | Raleway 400–600, latin-ext |
| `la-belle-aurore-latin.woff2` | La Belle Aurore 400, latin |
| `la-belle-aurore-latin-ext.woff2` | La Belle Aurore 400, latin-ext |

The `latin-ext` files are gated behind `unicode-range` and are only downloaded
if a glyph outside the latin range is actually rendered.

The `@font-face` declarations live in `src/styles/global.css`. The Cormorant
and Raleway `latin` files are preloaded in `src/layouts/BaseLayout.astro`.
The italic is not preloaded either: it first appears below the fold.
La Belle Aurore is **not** preloaded: it appears only in the hero tagline and
the About signature, and an unpreloaded `@font-face` is fetched only on pages
that actually render it.
