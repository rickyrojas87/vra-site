/**
 * Shared vocabularies. The genre list is the spec's own (section 6, form field 4)
 * and is the single source for both the Contact dropdown and the About pills.
 */

export const genres = [
  'Romance',
  'Thriller / Suspense',
  'Mystery',
  'Fantasy',
  'Science Fiction',
  'Horror',
  'Historical Fiction',
  'Young Adult',
  "Children's",
  'Memoir / Biography',
  'True Crime',
  'Self-Help',
] as const;

/** Contact form only — "Other" is an intake option, not a genre Vikki narrates. */
export const genreOptions = [...genres, 'Other'] as const;

export const dealTypes = [
  'ACX royalty share',
  'Per finished hour',
  'Stipend plus royalty share',
  'Not sure yet',
] as const;

/**
 * About section 3 — accents rendered as a 3-column grid, never a comma list.
 * Empty until Vikki confirms her actual range; the page falls back to a
 * correctly sized placeholder. Fill this array and the grid renders itself.
 * Superseded by the voice range matrix element in phase 2.
 */
export const accents: string[] = [];
