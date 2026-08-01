import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * `Titles` — spec section 5.
 *
 * One YAML file per book in src/content/titles/. Field names match the spec's
 * CMS collection exactly so the data maps 1:1 if it ever moves to a hosted CMS.
 *
 * Fields blocked on assets (coverImage, audibleUrl, sampleAudio) are optional so
 * a title can be entered before its art and links exist; the UI falls back to a
 * correctly sized placeholder.
 */
const titles = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/titles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string(),
      genre: z.string(),
      runtimeHours: z.number().positive(),
      releaseYear: z.number().int(),
      /** Cover art, 1:1. Path relative to this file, e.g. ./covers/foo.jpg */
      coverImage: image().optional(),
      audibleUrl: z.url().optional(),
      status: z.enum(['published', 'in-production']),
      /** Path under /public, e.g. /audio/foo.mp3 */
      sampleAudio: z.string().optional(),
      sortOrder: z.number().int().default(0),
      /** Optional override for the publisher credit shown on /works. */
      publisher: z.string().optional(),
    }),
});

export const collections = { titles };
