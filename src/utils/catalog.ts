import { getEntry } from 'astro:content';
import { loadTitles, loadPublishedTitles, loadInProductionTitles, type Title } from './content';
import { accents } from '../data/taxonomy';

/**
 * Everything the Home page derives from the catalog at build time (spec v2 §7):
 * stats, shelf order, "Latest release", the "Just published" ribbon and the
 * booking month. Nothing here is a field anyone maintains.
 */

/**
 * Newest first, by Audible's release date (src/data/audible.json). A title
 * without one (no Audible link yet, or never synced) falls back to its YAML
 * release YEAR, read as 1 January, so it sorts after any dated title from the
 * same year. Ties go to the catalog's sortOrder: higher means added later.
 */
const releaseKey = (t: Title) =>
  t.data.releaseDate ?? (t.data.releaseYear ? `${t.data.releaseYear}-01-01` : '');

const newestFirst = (a: Title, b: Title) =>
  releaseKey(b).localeCompare(releaseKey(a)) || b.data.sortOrder - a.data.sortOrder;

/** Published titles, newest first. */
export async function loadPublishedNewestFirst(): Promise<Title[]> {
  return (await loadPublishedTitles()).sort(newestFirst);
}

/** The single newest published title, or undefined with an empty catalog. */
export async function loadLatestRelease(): Promise<Title | undefined> {
  return (await loadPublishedNewestFirst())[0];
}

export interface ShelfItem {
  entry: Title;
  ribbon: 'just-published' | 'in-production' | null;
}

/**
 * Home "On the shelf": in-production titles first, then published newest
 * first, `limit` in all. "Just published" goes on the newest published title
 * only; every in-production title carries its own ribbon.
 */
export async function loadShelf(limit = 4): Promise<{ items: ShelfItem[]; total: number }> {
  const upcoming = await loadInProductionTitles();
  const published = await loadPublishedNewestFirst();
  const newestId = published[0]?.id;

  const items = [...upcoming, ...published].slice(0, limit).map((entry) => ({
    entry,
    ribbon:
      entry.data.status === 'in-production'
        ? ('in-production' as const)
        : entry.id === newestId
          ? ('just-published' as const)
          : null,
  }));

  return { items, total: upcoming.length + published.length };
}

export interface CatalogStats {
  published: number;
  /** Mean of rated titles, one decimal; undefined when nothing is rated yet. */
  averageRating?: string;
  ratingCount: number;
  /** Whole finished hours across published titles, rounded down. */
  finishedHours: number;
  accents: number;
}

export async function loadStats(): Promise<CatalogStats> {
  const published = await loadPublishedTitles();
  const rated = published.filter((t) => t.data.audibleRating !== undefined);
  const mean = rated.reduce((sum, t) => sum + t.data.audibleRating!, 0) / (rated.length || 1);

  return {
    published: published.length,
    averageRating: rated.length ? mean.toFixed(1) : undefined,
    ratingCount: published.reduce((sum, t) => sum + (t.data.ratingCount ?? 0), 0),
    // Rounded down so the strip never claims an hour that wasn't delivered.
    finishedHours: Math.floor(published.reduce((sum, t) => sum + (t.data.runtimeHours ?? 0), 0)),
    accents: accents.length,
  };
}

/** Every title in the catalog, published or not — for "Showing 4 of N". */
export async function countTitles(): Promise<number> {
  return (await loadTitles()).length;
}

/**
 * Booking badge month: build date plus `bookingLeadMonths` (CMS, default 2).
 * Rolls over on the 1st by construction. The year is appended only when it
 * differs from the build year. Stays current only with the monthly rebuild
 * (spec v2 §7).
 */
export async function loadBookingMonth(now = new Date()): Promise<{ month: string; year?: number }> {
  const settings = await getEntry('settings', 'delivery');
  const lead = settings?.data.bookingLeadMonths ?? 2;
  const target = new Date(now.getFullYear(), now.getMonth() + lead, 1);

  return {
    month: target.toLocaleString('en-US', { month: 'long' }),
    year: target.getFullYear() !== now.getFullYear() ? target.getFullYear() : undefined,
  };
}

/** Initials for a quote avatar when the book isn't in the catalog. */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .filter((_, i, all) => i === 0 || i === all.length - 1)
    .join('');

/**
 * The catalog title a testimonial is about. Exact match first; otherwise the
 * title named EARLIEST inside `bookTitle`, so "Old Bastards and Fragile Steps"
 * resolves to Old Bastards' cover, not whichever file the loader read first.
 */
export function findTitleFor(bookTitle: string | undefined, titles: Title[]): Title | undefined {
  if (!bookTitle) return undefined;
  const wanted = bookTitle.trim().toLowerCase();
  const exact = titles.find((t) => t.data.title.toLowerCase() === wanted);
  if (exact) return exact;
  return titles
    .map((t) => ({ t, at: wanted.indexOf(t.data.title.toLowerCase()) }))
    .filter(({ at }) => at >= 0)
    .sort((a, b) => a.at - b.at)[0]?.t;
}
