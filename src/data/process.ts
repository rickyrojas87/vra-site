/**
 * How we work together — Home section 05 (spec v2 §3).
 *
 * DRAFT COPY, NOT VIKKI'S WORDING. No process copy existed anywhere in the
 * repo, so these six are placeholders written to the spec's 23–26 word length.
 * Spec v2 §6 moves this list into `settings/process.yaml` (title, short copy
 * for Home, long copy for About) so Vikki can edit it from the CMS; until then
 * it lives here. Replace the wording with hers before launch.
 */
export interface ProcessStep {
  title: string;
  /** Home card copy, 23–26 words. */
  short: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: 'First conversation',
    short:
      'You tell me about your book, your characters and your listeners. I read the sample and send a short audition so you can hear the fit.',
  },
  {
    title: 'Preparing the script',
    short:
      'Before I record a word, I read the whole manuscript, map every character, and confirm pronunciations, names and accents with you so nothing is guessed at.',
  },
  {
    title: 'The first fifteen',
    short:
      'I record and master the first fifteen minutes and send them for your approval. Voices, pacing and tone are agreed here, before full production begins.',
  },
  {
    title: 'In the booth',
    short:
      'I narrate the full book in my treated studio, punch-and-roll, chapter by chapter, keeping each character consistent from the opening line to the very end.',
  },
  {
    title: 'Editing and mastering',
    short:
      'Every chapter is edited, proofed against the text and mastered in-house to ACX standards, so the files you receive are clean, consistent and ready to submit.',
  },
  {
    title: 'Delivery and release',
    short:
      'You review the finished chapters and request any pickups. I make the corrections, deliver the final files, and help see your audiobook through to release.',
  },
];
