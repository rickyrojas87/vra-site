/**
 * Estimator rates — Home 07 and Contact 01.
 *
 * Rates live here and nowhere else. Changing a price is a one-line edit in
 * this file; the estimator on Home and Contact reads from it.
 */

export interface ServiceOption {
  id: string;
  /** Box label in the estimator. */
  name: string;
  /** US dollars per finished hour. */
  rate: number;
}

export const services: ServiceOption[] = [
  { id: 'narration', name: 'Narration only', rate: 135 },
  { id: 'full', name: 'Full production', rate: 200 },
];

/** Industry rule of thumb used to turn a word count into finished hours. */
export const WORDS_PER_FINISHED_HOUR = 9300;
