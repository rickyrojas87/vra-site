import type { APIRoute } from 'astro';

/**
 * Generated rather than static so the Sitemap line tracks the same origin as
 * the canonical tags — both come from `site` in astro.config.mjs, which reads
 * Netlify's build environment. A hardcoded public/robots.txt would point at the
 * wrong host the moment the domain cuts over.
 *
 * Note this allows everything. Non-production deploys are kept out of the index
 * by the X-Robots-Tag header in netlify.toml, not by robots.txt — a disallow
 * here would block crawling without preventing indexing.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site?.href.replace(/\/$/, '') ?? '';

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${origin}/sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
