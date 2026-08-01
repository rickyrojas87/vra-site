import type { ImageMetadata } from 'astro';

import main from '../assets/main.jpg';
import boothAlt from '../assets/booth-alt.jpg';
import reading from '../assets/reading.jpg';
import portraitAlt from '../assets/potrait-alt.jpg';

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
export const gallery: GalleryImage[] = [
  {
    src: main,
    alt: 'Victoria Rojas laughing mid-take at the microphone, headphones on and a script tablet in her hand',
  },
  {
    src: boothAlt,
    alt: 'Victoria Rojas performing a line into the condenser microphone, reading from a tablet held at chest height',
  },
  {
    src: portraitAlt,
    alt: 'Victoria Rojas standing in the booth beside her microphone and pop filter, holding a tablet against her side',
  },
  {
    src: reading,
    alt: 'Victoria Rojas stretched out on a couch reading from a backlit e-reader, knees drawn up',
  },
];

/** A partial row looks broken, so the collage is all-or-nothing. */
export const GALLERY_MIN = 4;
