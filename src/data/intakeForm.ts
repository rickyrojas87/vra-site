/**
 * Canonical definition of the intake form's identity and field names.
 *
 * Netlify registers a form from static HTML at deploy time and cannot see forms
 * rendered from .astro components, so a bare copy has to exist at /__forms.html.
 * That copy is GENERATED from this file (src/pages/__forms.html.ts) rather than
 * hand-maintained, and `scripts/check-forms.mjs` re-reads both built pages after
 * every build and fails the build if their field names diverge.
 *
 * Adding a field to /contact therefore requires adding it here too — otherwise
 * the build stops rather than silently dropping that field from submissions.
 */
export const FORM_NAME = 'quote-request';

/** Netlify discards a submission when this decoy is filled in. */
export const HONEYPOT_FIELD = 'bot-field';

export interface IntakeField {
  name: string;
  /** Only shapes the generated detection markup; the real form owns its UI. */
  kind: 'text' | 'email' | 'number' | 'url' | 'date' | 'textarea';
}

export const intakeFields: IntakeField[] = [
  { name: 'name', kind: 'text' },
  { name: 'email', kind: 'email' },
  { name: 'bookTitle', kind: 'text' },
  { name: 'genre', kind: 'text' },
  { name: 'wordCount', kind: 'number' },
  { name: 'dealType', kind: 'text' },
  { name: 'deliveryDate', kind: 'date' },
  { name: 'manuscriptFinal', kind: 'text' },
  { name: 'manuscriptUrl', kind: 'url' },
  { name: 'notes', kind: 'textarea' },
];
