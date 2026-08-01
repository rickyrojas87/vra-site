import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * ─── Why every optional field is wrapped ──────────────────────────────────
 *
 * Sveltia writes a value for every field in the form, including the ones left
 * blank. Depending on the widget that blank arrives as `null` (number, date),
 * `''` (string, url) or `{}` (object-ish widgets) — never as an absent key.
 *
 * A plain `.optional()` rejects all three, so the first entry Vikki saved took
 * the whole deploy down. Zod reports `null` as type "object" (because
 * `typeof null === 'object'`), which is why the build log named object.
 *
 * The rule here: a blank in any shape normalizes to `undefined` BEFORE
 * validation, and `.catch()` turns any surviving parse failure into `undefined`
 * rather than an exception. Content can therefore never fail a build. Entries
 * missing something they genuinely cannot render without are skipped with a
 * warning instead — see src/utils/content.ts.
 */

/** Every shape the CMS uses to mean "left blank". */
const isBlank = (value: unknown): boolean => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as object).length === 0;
  return false;
};

/** Optional scalar: blank in, `undefined` out, and never throws. */
const optional = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (isBlank(v) ? undefined : v), schema.optional().catch(undefined));

/** Optional number that also survives a numeric string like "5.8" or "9,300". */
const optionalNumber = (schema: z.ZodNumber) =>
  z.preprocess((v) => {
    if (isBlank(v)) return undefined;
    if (typeof v === 'string') {
      const n = Number(v.replace(/,/g, '').trim());
      return Number.isFinite(n) ? n : undefined;
    }
    return v;
  }, schema.optional().catch(undefined));

/** Number with a floor value rather than an absence. */
const numberOr = (schema: z.ZodNumber, fallback: number) =>
  z.preprocess((v) => {
    if (isBlank(v)) return fallback;
    if (typeof v === 'string') {
      const n = Number(v.replace(/,/g, '').trim());
      return Number.isFinite(n) ? n : fallback;
    }
    return v;
  }, schema.catch(fallback));

/** Boolean that treats any blank as false. */
const booleanOr = (fallback: boolean) =>
  z.preprocess((v) => (isBlank(v) ? fallback : v), z.boolean().catch(fallback));

/** Required-ish string: blank becomes '' so the entry can be skipped, not thrown. */
const requiredString = z.preprocess((v) => (isBlank(v) ? '' : v), z.string().catch(''));

/** List of strings, dropping any blank rows the CMS leaves behind. */
const stringList = z.preprocess(
  (v) => (Array.isArray(v) ? v.filter((item) => !isBlank(item)) : isBlank(v) ? [] : v),
  z.array(z.string()).catch([]),
);

/**
 * `Titles` — spec section 5.
 *
 * One YAML file per book in src/content/titles/. Field names match the spec's
 * CMS collection exactly so the data maps 1:1 if it ever moves elsewhere.
 */
const titles = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/titles' }),
  schema: ({ image }) =>
    z.object({
      title: requiredString,
      /** Blank status is treated as unreleased: the safer direction to fail. */
      status: z.preprocess(
        (v) => (isBlank(v) ? 'in-production' : v),
        z.enum(['published', 'in-production']).catch('in-production'),
      ),
      subtitle: optional(z.string()),
      author: optional(z.string()),
      genre: optional(z.string()),
      runtimeHours: optionalNumber(z.number().positive()),
      releaseYear: optionalNumber(z.number().int()),
      /** Cover art, 1:1. Path relative to this file, e.g. ./covers/foo.jpg */
      coverImage: optional(image()),
      audibleUrl: optional(z.url()),
      /** Path under /public, e.g. /audio/foo.mp3 */
      sampleAudio: optional(z.string()),
      /**
       * Clears an unreleased title's demo for the public player. Published
       * titles never need it.
       */
      samplePublic: booleanOr(false),
      audibleRating: optionalNumber(z.number().min(0).max(5)),
      ratingCount: optionalNumber(z.number().int().nonnegative()),
      sortOrder: numberOr(z.number().int(), 0),
      /** Publisher credit, or "Indie". Shown on /works only. */
      publisher: optional(z.string()),
    }),
});

/**
 * Gallery — the About collage. One file per photo so the CMS can add, remove
 * and reorder without anyone editing an array by hand.
 */
const gallery = defineCollection({
  loader: glob({ pattern: '*.{yaml,yml,json}', base: './src/content/gallery' }),
  schema: ({ image }) =>
    z.object({
      image: optional(image()),
      /** Describe what is in the frame, never the filename. */
      alt: requiredString,
      sortOrder: numberOr(z.number().int(), 0),
    }),
});

/** Testimonials — rendered on Home only when at least one exists. */
const testimonials = defineCollection({
  loader: glob({ pattern: '*.{yaml,yml,json}', base: './src/content/testimonials' }),
  schema: z.object({
    quote: requiredString,
    author: requiredString,
    bookTitle: optional(z.string()),
    link: optional(z.url()),
    sortOrder: numberOr(z.number().int(), 0),
  }),
});

/** Editable copy that isn't a page and isn't a title. */
const settings = defineCollection({
  loader: glob({ pattern: '*.{yaml,yml,json}', base: './src/content/settings' }),
  schema: z.object({
    turnaround: optional(z.string()),
    studio: stringList,
    delivery: stringList,
  }),
});

export const collections = { titles, gallery, testimonials, settings };
