/**
 * Hero video files (spec v2 §4). In public/: video isn't processed by Astro.
 *
 * The poster is NOT here. It lives in src/assets/library-poster.webp and is
 * rendered by Hero.astro as a responsive <img> under the video, so phones get
 * a 640px file (~21 KB) instead of the 1280px original (75 KB) — the poster is
 * the page's LCP element.
 */
export const heroMedia = {
  webm: '/video/library-loop.webm',
  mp4: '/video/library-loop.mp4',
} as const;
