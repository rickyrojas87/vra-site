/**
 * Emits dist/__forms.html — Netlify's form detection file.
 *
 * Netlify parses static HTML in the publish directory at deploy time and cannot
 * see forms rendered from .astro components, which is why submissions to
 * /contact used to 404. This bare copy exists purely for that parser.
 *
 * Written by a build step rather than kept in public/ for two reasons: it is a
 * generated artifact and shouldn't be hand-edited, and Astro excludes
 * underscore-prefixed files from routing, so `src/pages/__forms.html.ts` is
 * silently ignored and cannot be used to produce it.
 *
 * Field names come from src/data/intakeForm.ts, the same module contact.astro
 * imports its form name and honeypot from. scripts/check-forms.mjs then proves
 * the built pages agree.
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');

// The data module is TypeScript; read it as text and pull the literals out
// rather than adding a transpile step to the build.
const source = readFileSync(join(here, '..', 'src', 'data', 'intakeForm.ts'), 'utf8');

const literal = (key) => source.match(new RegExp(`export const ${key} = '([^']+)'`))?.[1];
const FORM_NAME = literal('FORM_NAME');
const HONEYPOT_FIELD = literal('HONEYPOT_FIELD');

const fields = [...source.matchAll(/\{\s*name:\s*'([^']+)',\s*kind:\s*'([^']+)'\s*\}/g)].map((m) => ({
  name: m[1],
  kind: m[2],
}));

if (!FORM_NAME || !HONEYPOT_FIELD || fields.length === 0) {
  console.error('\ngenerate-forms-file FAILED: could not read src/data/intakeForm.ts\n');
  process.exit(1);
}

const field = ({ name, kind }) =>
  kind === 'textarea'
    ? `      <textarea name="${name}"></textarea>`
    : `      <input type="${kind}" name="${name}" />`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Netlify form detection</title>
  </head>
  <body>
    <!-- GENERATED at build time from src/data/intakeForm.ts. Do not edit. -->
    <form name="${FORM_NAME}" data-netlify="true" netlify-honeypot="${HONEYPOT_FIELD}">
      <input type="hidden" name="form-name" value="${FORM_NAME}" />
      <input name="${HONEYPOT_FIELD}" />
${fields.map(field).join('\n')}
      <button type="submit">Send</button>
    </form>
  </body>
</html>
`;

mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, '__forms.html'), html);
console.log(`__forms.html generated — "${FORM_NAME}", ${fields.length} fields`);
