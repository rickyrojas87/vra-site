/**
 * The lockups are inlined, not loaded as `<img>`, for two reasons: the header
 * mark sits in the LCP area and an inline SVG costs no request, and only an
 * inline node can take a CSS `fill`. The exported files carry a single
 * `fill="#D4AF37"` on the root `<svg>` and every path inherits it, so one
 * `fill: var(--c-text)` rule recolours the whole lockup. Keep the -ivory and
 * -dark files for print and anywhere CSS cannot reach; on-site colour is
 * controlled here.
 *
 * Each file also ships `role="img" aria-label="Victoria Rojas Audio"`. Inside a
 * link that would become the link's accessible name, so the graphic is muted
 * and the anchor carries the name instead — one name, chosen at the call site.
 */
export function decorativeSvg(raw: string): string {
  return raw
    .replace(/\srole="img"/, '')
    .replace(/\saria-label="[^"]*"/, '')
    .replace('<svg', '<svg aria-hidden="true" focusable="false"');
}
