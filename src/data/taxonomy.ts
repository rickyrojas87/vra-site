/** Shared vocabularies. */

/**
 * Genres Vikki narrates — About section 4 pill row.
 *
 * Deliberately NOT the same list as `genreOptions` below. This one describes her
 * range; that one is the client-facing intake dropdown enumerated in spec
 * section 6, which merges pairs ("Thriller / Suspense") and adds "Other".
 * Editing one should not silently change the other.
 */
export const genres = [
  'Romance',
  'Fiction',
  'Mystery',
  'Thriller',
  'Suspense',
  'Fantasy',
  'Science Fiction',
  'Horror',
  'Historical Fiction',
  'Nonfiction',
  'Memoir',
  'Biography',
  'Young Adult',
  "Children's Fiction",
  'True Crime',
  'Self-Help',
] as const;

/** Contact form dropdown — verbatim from spec section 6, form field 4. */
export const genreOptions = [
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
  'Other',
] as const;

export const dealTypes = [
  'ACX royalty share',
  'Per finished hour',
  'Stipend plus royalty share',
  'Not sure yet',
] as const;

/**
 * About section 3 — rendered as a 3-column grid of accent names, never a comma
 * list. Superseded by the voice range matrix element in phase 2.
 */
export const accents: string[] = [
  'Spanish',
  'US Boston',
  'US Southern',
  'US New York',
  'US Standard American',
  'US Miami',
  'British Standard',
  'Australian',
];
