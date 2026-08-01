/**
 * Quote calculator inputs — spec section 6, row 2.
 *
 * Rates and service copy live here and nowhere else. Changing a price is a
 * one-line edit in this file; the calculator, its segmented control and the
 * message it hands off to the intake form all read from it.
 */

export interface ServiceOption {
  id: string;
  /** Segment label. */
  name: string;
  /** Parenthetical shown beside the rate. */
  qualifier: string;
  /** US dollars per finished hour. */
  rate: number;
  description: string;
}

export const services: ServiceOption[] = [
  {
    id: 'narration',
    name: 'Narration Only',
    qualifier: 'Raw Audio',
    rate: 135,
    description:
      'Unedited clean takes with mistakes removed. No EQ, compression, or loudness normalization to meet platform standards.',
  },
  {
    id: 'full',
    name: 'Full Production',
    qualifier: 'Narration + Mastering',
    rate: 200,
    description:
      'Fully processed, EQ-adjusted, de-essed, compressed, and loudness-normalized audio meeting exact RMS and peak specs.',
  },
];

/** First entry is the default selection. */
export const defaultServiceId = services[0].id;

/** Industry rule of thumb used to turn a word count into finished hours. */
export const WORDS_PER_FINISHED_HOUR = 9300;

export const ESTIMATE_DISCLAIMER =
  'Finished hours are estimated at 9,300 words per hour. Final pricing depends on the demands of the material. Heavy character work, multiple accents, dense dialogue, and complex pacing take longer to perform and produce than straightforward single-narrator prose, and are quoted accordingly. Every project is confirmed after a manuscript review.';

/** Sits below the disclaimer, one step more prominent — it's an invitation. */
export const ARRANGEMENTS_NOTE =
  'Royalty share and stipend-plus-royalty-share arrangements considered on a per-project basis.';
