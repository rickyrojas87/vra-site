/**
 * How we work together — Home 05 (cards) and About 02 (stacked, long form).
 *
 * Vikki's wording, verbatim. There is one version of each step: she supplied
 * no separate short and long copy, so Home and About render the same text.
 * Spec v2 §6 moves this list into `settings/process.yaml` so she can edit it
 * from the CMS; until then it lives here.
 */
export interface ProcessStep {
  title: string;
  copy: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: 'Send your book',
    copy: 'Share the manuscript, word count and deal type through the quote form. You get a quote and next steps within two business days.',
  },
  {
    title: 'Manuscript review',
    copy: 'I read the entire manuscript over one to two weeks, prepping plot lines, character arcs and pronunciations. Your pronunciation list and character notes help here.',
  },
  {
    title: 'First fifteen',
    copy: 'I record the first 15 minutes to set pacing, tone and voices. Once approved, creative direction is entrusted to me. Per-finished-hour projects: a 25% deposit is due.',
  },
  {
    title: 'Punch and roll',
    copy: 'Over four to six weeks I record, edit and master the rest of the book in my studio, then upload every finished file for your review.',
  },
  {
    title: 'Your review',
    copy: 'You note any pickups: technical flubs, mispronunciations or missing words. Two rounds of pickups are included. Additional rounds are subject to extra fees.',
  },
  {
    title: 'Payment and release',
    copy: 'Once every file is approved, final payment is made before the finished audio goes to the publishing platform for quality assurance and release.',
  },
];

/** Card decoration shared by both renderings: chapter label and progress. */
export const processChapters = processSteps.map((step, i, all) => ({
  ...step,
  n: i + 1,
  last: i === all.length - 1,
  progress: Math.round(((i + 1) / all.length) * 100),
}));
