# Fonts

Cormorant Garamond and Raleway, self-hosted. Both are licensed under the
[SIL Open Font License 1.1](https://openfontlicense.org/), which permits
redistribution alongside the site.

Files were taken from the Google Fonts CSS API (`css2`, requested with a modern
browser UA so it serves woff2) and are unmodified.

Both families are **variable** fonts: one file per family per subset covers the
whole weight axis. That is why `cormorant-garamond-latin.woff2` backs both the
300 and 400 `@font-face` blocks, and `raleway-latin.woff2` backs both 400 and
500. Do not add per-weight files — there is nothing to gain.

| File | Covers |
|---|---|
| `cormorant-garamond-latin.woff2` | Cormorant Garamond 300 + 400, latin |
| `cormorant-garamond-latin-ext.woff2` | Cormorant Garamond 300–400, latin-ext |
| `raleway-latin.woff2` | Raleway 400 + 500, latin |
| `raleway-latin-ext.woff2` | Raleway 400–500, latin-ext |

The `latin-ext` files are gated behind `unicode-range` and are only downloaded
if a glyph outside the latin range is actually rendered.

The `@font-face` declarations live in `src/styles/global.css`. The two `latin`
files are preloaded in `src/layouts/BaseLayout.astro`.
