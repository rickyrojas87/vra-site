import { getCollection, type CollectionEntry } from 'astro:content';

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

/** Every usable title, unsorted. */
export async function loadTitles(): Promise<CollectionEntry<'titles'>[]> {
  const all = await getCollection('titles');
  return all.filter((entry) => {
    if (!entry.data.title.trim()) {
      warn('titles', entry.id, 'no title');
      return false;
    }
    return true;
  });
}

/** Published titles only, in display order. */
export async function loadPublishedTitles(): Promise<CollectionEntry<'titles'>[]> {
  return (await loadTitles())
    .filter((e) => e.data.status === 'published')
    .sort((a, b) => a.data.sortOrder - b.data.sortOrder);
}

/** In-production titles, in display order. */
export async function loadInProductionTitles(): Promise<CollectionEntry<'titles'>[]> {
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
