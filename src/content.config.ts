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
      /**
       * Clears an unreleased title's demo for the public player. Published
       * titles never need it; an in-production title stays out of the player
       * until this is explicitly set.
       */
      samplePublic: z.boolean().default(false),
      /** Audible listener rating, 0-5. Omit until the title has one. */
      audibleRating: z.number().min(0).max(5).optional(),
      /** Number of ratings behind `audibleRating`; weights the site average. */
      ratingCount: z.number().int().nonnegative().optional(),
      sortOrder: z.number().int().default(0),
      /** Publisher credit, or "Indie". Shown on /works only. */
      publisher: z.string().optional(),
    }),
});

/**
 * Gallery — the About collage. One file per photo so the CMS can add, remove
 * and reorder without anyone editing an array by hand.
 *
 * `image` paths are relative to the entry file, which is what lets Astro run
 * them through sharp. Uploads land in src/assets, never public/.
 */
const gallery = defineCollection({
  loader: glob({ pattern: '*.{yaml,yml,json}', base: './src/content/gallery' }),
  schema: ({ image }) =>
    z.object({
      image: image(),
      /** Describe what is in the frame, never the filename. */
      alt: z.string(),
      sortOrder: z.number().int().default(0),
    }),
});

/**
 * Testimonials — quotes from authors she has worked with. The Home proof
 * section renders them only when at least one exists.
 */
const testimonials = defineCollection({
  loader: glob({ pattern: '*.{yaml,yml,json}', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    bookTitle: z.string().optional(),
    link: z.string().url().optional(),
    sortOrder: z.number().int().default(0),
  }),
});

/**
 * Editable copy that isn't a page and isn't a title — currently just the
 * studio and delivery panel. Kept as a single file so the CMS presents it as
 * one form rather than a list of entries.
 */
const settings = defineCollection({
  loader: glob({ pattern: '*.{yaml,yml,json}', base: './src/content/settings' }),
  schema: z.object({
    turnaround: z.string().optional(),
    studio: z.array(z.string()).default([]),
    delivery: z.array(z.string()).default([]),
  }),
});

export const collections = { titles, gallery, testimonials, settings };
