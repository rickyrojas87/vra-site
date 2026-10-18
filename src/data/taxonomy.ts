/** Shared vocabularies. */

/**
 * Genres Vikki narrates — the About "Genres" list, in the approved artboard's
 * order (docs/design/About.html): the five she has published in, then the
 * rest of her range. A published genre missing from here is still shown.
 *
 * Deliberately NOT the same list as `genreOptions` below. This one describes her
 * range; that one is the client-facing intake dropdown enumerated in spec
 * section 6, which merges pairs ("Thriller / Suspense") and adds "Other".
 * Editing one should not silently change the other.
 */
export const genres = [
  'Thriller',
  'Romance',
  'Fantasy',
  'Comedy',
  'Memoir',
  'Mystery',
  'Science Fiction',
  'Horror',
  'Historical Fiction',
  'Young Adult',
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

/** Accents and dialects, in the approved artboards' order (Home and About). */
export const accents: string[] = [
  'Spanish',
  'US Standard American',
  'US Southern',
  'US Boston',
  'US New York',
  'US Miami',
  'British Standard',
  'Australian',
];
