import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import audible from '../data/audible.json';

/**
 * Content loaders with an entry-level guard.
 *
 * The schema in content.config.ts is written so no value can throw — blanks
 * become `undefined` and bad values are caught. That keeps a CMS save from
 * failing the build, but it can still leave an entry that has nothing to
 * render: a title with no title, a photo with no photo.
 *
 * These helpers drop those entries and log a warning naming the file, so the
 * build goes green, the rest of the site is unaffected, and the problem is
 * visible in the deploy log rather than silent.
 */

function warn(collection: string, id: string, reason: string) {
  console.warn(`[content] skipped ${collection}/${id}: ${reason}`);
}

/**
 * A title as the site renders it: the YAML, with Audible's values merged over
 * it (spec v2 §7). `releaseDate` and the series fields exist only via Audible.
 */
export type Title = Omit<CollectionEntry<'titles'>, 'data'> & {
  data: CollectionEntry<'titles'>['data'] & {
    /** ISO date, e.g. "2026-02-05". From Audible only. */
    releaseDate?: string;
    series?: string;
    seriesNumber?: string;
  };
};

interface AudibleRecord {
  rating: number | null;
  ratingCount: number | null;
  runtimeMinutes: number | null;
  releaseDate: string | null;
  series: string | null;
  seriesNumber: string | null;
}

const audibleByAsin = audible as Record<string, AudibleRecord>;

/** Same rule as scripts/sync-audible.mjs; keep the two in step. */
function asinFromUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).pathname.match(/\/([A-Z0-9]{10})\/?$/i)?.[1].toUpperCase();
  } catch {
    return undefined;
  }
}

/**
 * Audible first, YAML as the fallback, field by field: a value Audible
 * doesn't have (null) leaves the YAML value in place. Rating, rating count,
 * runtime and release come from Audible; cover, sample audio, genre and
 * status always come from the YAML. Written by scripts/sync-audible.mjs.
 */
function withAudible(entry: CollectionEntry<'titles'>): Title {
  const a = audibleByAsin[asinFromUrl(entry.data.audibleUrl) ?? ''];
  if (!a) return entry;
  const releaseYear = a.releaseDate ? Number(a.releaseDate.slice(0, 4)) : undefined;
  return {
    ...entry,
    data: {
      ...entry.data,
      audibleRating: a.rating ?? entry.data.audibleRating,
      // A count only means something next to a rating.
      ratingCount: a.rating !== null ? (a.ratingCount ?? entry.data.ratingCount) : entry.data.ratingCount,
      runtimeHours: a.runtimeMinutes ? a.runtimeMinutes / 60 : entry.data.runtimeHours,
      releaseYear: releaseYear || entry.data.releaseYear,
      releaseDate: a.releaseDate ?? undefined,
      series: a.series ?? undefined,
      seriesNumber: a.seriesNumber ?? undefined,
    },
  };
}

/** Every usable title, unsorted, with Audible data merged in. */
export async function loadTitles(): Promise<Title[]> {
  const all = await getCollection('titles');
  return all
    .filter((entry) => {
      if (!entry.data.title.trim()) {
        warn('titles', entry.id, 'no title');
        return false;
      }
      return true;
    })
    .map(withAudible);
}

/** Published titles only, in display order. */
export async function loadPublishedTitles(): Promise<Title[]> {
  return (await loadTitles())
    .filter((e) => e.data.status === 'published')
    .sort((a, b) => a.data.sortOrder - b.data.sortOrder);
}

/** In-production titles, in display order. */
export async function loadInProductionTitles(): Promise<Title[]> {
  return (await loadTitles())
    .filter((e) => e.data.status === 'in-production')
    .sort((a, b) => a.data.sortOrder - b.data.sortOrder);
}

/** Photos with both an image and a description, in display order. */
export async function loadGallery(): Promise<CollectionEntry<'gallery'>[]> {
  const all = await getCollection('gallery');
  return all
    .filter((entry) => {
      if (!entry.data.image) {
        warn('gallery', entry.id, 'no image');
        return false;
      }
      if (!entry.data.alt.trim()) {
        warn('gallery', entry.id, 'no description (alt text is required)');
        return false;
      }
      return true;
    })
    .sort((a, b) => a.data.sortOrder - b.data.sortOrder);
}

/** Testimonials with both a quote and an attribution, in display order. */
export async function loadTestimonials(): Promise<CollectionEntry<'testimonials'>[]> {
  const all = await getCollection('testimonials');
  return all
    .filter((entry) => {
      if (!entry.data.quote.trim()) {
        warn('testimonials', entry.id, 'no quote');
        return false;
      }
      if (!entry.data.author.trim()) {
        warn('testimonials', entry.id, 'no attribution');
        return false;
      }
      return true;
    })
    .sort((a, b) => a.data.sortOrder - b.data.sortOrder);
}

export interface ProcessStep {
  title: string;
  /** Home card copy. Falls back to the long copy when left blank. */
  short: string;
  /** About copy. Falls back to the short copy when left blank. */
  long: string;
  /** 1-based position, "Chapter N". */
  n: number;
  /** The final step reads "The end" and gets the full-width rule. */
  last: boolean;
  /** Progress bar fill, percent: 17/33/50/67/83/100 for six steps. */
  progress: number;
}

/**
 * The process steps from settings/process.yaml, in CMS order. A step with no
 * title, or with neither copy field, is skipped. An empty result (file
 * missing or emptied) makes the Home and About process sections hide.
 */
export async function loadProcessSteps(): Promise<ProcessStep[]> {
  const steps = (await getEntry('process', 'process'))?.data.steps ?? [];
  const usable = steps.flatMap((step, i) => {
    const short = step.short ?? step.long;
    const long = step.long ?? step.short;
    if (!step.title.trim()) {
      warn('process', `step ${i + 1}`, 'no title');
      return [];
    }
    if (!short || !long) {
      warn('process', `step ${i + 1}`, 'no copy');
      return [];
    }
    return [{ title: step.title, short, long }];
  });
  return usable.map((step, i) => ({
    ...step,
    n: i + 1,
    last: i === usable.length - 1,
    progress: Math.round(((i + 1) / usable.length) * 100),
  }));
}
