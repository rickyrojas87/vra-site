import type { ImageMetadata } from 'astro';

import portraitAlt from '../assets/portrait-alt.jpg';
import boothAlt from '../assets/booth-alt.jpg';
import booth from '../assets/booth.jpg';
import reading from '../assets/reading.jpg';

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
 */
/**
 * No image here may also appear elsewhere on About — the bio portrait and the
 * studio shot (main.jpg) are both spoken for. main.jpg moved out of this array
 * when it took the studio slot; portrait-alt.jpg took its place.
 *
 * portrait-alt.jpg is also the Home hero background. With seven image slots
 * across the site and six photographs, exactly one must appear twice; keeping
 * the repeat on two different pages is the least visible way to spend it.
 */
export const gallery: GalleryImage[] = [
  {
    src: portraitAlt,
    alt: 'Victoria Rojas standing in the booth beside her microphone and pop filter, holding a tablet against her side',
  },
  {
    src: boothAlt,
    alt: 'Victoria Rojas performing a line into the condenser microphone, reading from a tablet held at chest height',
  },
  {
    src: booth,
    alt: 'Victoria Rojas recording at a condenser microphone behind a pop filter, headphones on, reading from a tablet',
  },
  {
    src: reading,
    alt: 'Victoria Rojas stretched out on a couch reading from a backlit e-reader, knees drawn up',
  },
];

/** A partial row looks broken, so the collage is all-or-nothing. */
export const GALLERY_MIN = 4;
