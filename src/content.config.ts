import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * `Titles` — spec section 5.
 *
 * One YAML file per book in src/content/titles/. Field names match the spec's
 * CMS collection exactly so the data maps 1:1 if it ever moves to a hosted CMS.
 *
 * Only `title` and `status` are required. Everything else is optional by design:
 * a title is entered as soon as its cover exists, and the metadata is filled in
 * as it arrives. Cards omit whatever is missing rather than rendering a blank —
 * so leaving a field out is always safe, and inventing a value never is.
 */
const titles = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/titles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      status: z.enum(['published', 'in-production']),
      /**
       * Audible's full titles are too long for a card grid, so `title` stays
       * short and `subtitle` carries the rest ("A Novel", "Money & Blood, Part 1").
       * Cards omit it when absent.
       */
      subtitle: z.string().optional(),
      author: z.string().optional(),
      genre: z.string().optional(),
      runtimeHours: z.number().positive().optional(),
      releaseYear: z.number().int().optional(),
      /** Cover art, 1:1. Path relative to this file, e.g. ./covers/foo.jpg */
      coverImage: image().optional(),
      audibleUrl: z.url().optional(),
      /** Path under /public, e.g. /audio/foo.mp3 */
      sampleAudio: z.string().optional(),
      /** Audible listener rating, 0-5. Omit until the title has one. */
      audibleRating: z.number().min(0).max(5).optional(),
      /** Number of ratings behind `audibleRating`; weights the site average. */
      ratingCount: z.number().int().nonnegative().optional(),
      sortOrder: z.number().int().default(0),
      /** Publisher credit, or "Indie". Shown on /works only. */
      publisher: z.string().optional(),
    }),
});

export const collections = { titles };
