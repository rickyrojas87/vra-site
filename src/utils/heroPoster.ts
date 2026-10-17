import { getImage } from 'astro:assets';
import poster from '../assets/library-poster.webp';

/**
 * The Home hero poster — the page's LCP element. Built once here so the <img>
 * in Hero.astro and the <link rel="preload"> in index.astro carry identical
 * URLs; any drift between them would download the poster twice.
 *
 * Below 900px the declared slot is deliberately small so phones at 2–3x
 * density still pick the 640w file: it sits blurred and dimmed under a scrim,
 * where extra resolution is invisible but its bytes delay LCP.
 */
export const HERO_POSTER_SIZES = '(min-width: 900px) 100vw, 200px';

export function getHeroPoster() {
  return getImage({
    src: poster,
    widths: [640, 1280],
    sizes: HERO_POSTER_SIZES,
    quality: 45,
  });
}
