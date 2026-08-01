import type { ImageMetadata } from 'astro';

export interface GalleryImage {
  src: ImageMetadata;
  /** Describe what is actually in the frame. Never the filename. */
  alt: string;
}

/**
 * Staggered collage on the About page.
 *
 * The component renders nothing until this array holds at least FOUR entries —
 * a partial row breaks the stagger and reads as a mistake rather than a layout.
 * Add images by importing them from src/assets (never public/, or they skip the
 * sharp pipeline) and pushing them here. No markup changes needed.
 *
 *   import boothWide from '../assets/booth-wide.jpg';
 *
 *   export const gallery: GalleryImage[] = [
 *     { src: boothWide, alt: 'Victoria adjusting the mic arm in her booth' },
 *   ];
 */
export const gallery: GalleryImage[] = [];

/** A partial row looks broken, so the collage is all-or-nothing. */
export const GALLERY_MIN = 4;
