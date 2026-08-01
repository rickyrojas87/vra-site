// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Canonical origin — the single place the site's public URL is decided.
 * `<link rel="canonical">`, `og:url`, robots.txt and the sitemap all derive
 * from it.
 *
 * On Netlify this comes from the build environment: `URL` is the site's primary
 * address, so it is the generated *.netlify.app host today and becomes
 * victoriarojasaudio.com the moment that domain is set as primary — no code
 * change at cutover, and no window where the canonical points at the old Wix
 * site while the new one is live.
 *
 * LOCAL_FALLBACK only applies to builds run outside Netlify.
 */
const LOCAL_FALLBACK = 'http://localhost:4321';
const site = process.env.URL || LOCAL_FALLBACK;

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // /thanks is a post-submit landing page with no standalone search value.
      // __forms.html is a build artifact for Netlify's parser, not a page.
      filter: (page) => !/\/thanks\/?$/.test(page) && !/__forms/.test(page),
    }),
  ],
});
