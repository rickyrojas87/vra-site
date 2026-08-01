/**
 * Build-time assertion: the Netlify detection file must match the real form.
 *
 * Runs after `astro build` (see the `build` script in package.json) and reads
 * the BUILT HTML of both pages — not the source — so it catches drift no matter
 * how it was introduced: a field added to contact.astro, a rename, a changed
 * form name, a missing hidden input.
 *
 * If this fails, Netlify would have accepted submissions while silently
 * discarding any field it had no record of. Failing the build is the point.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const CONTACT = join(dist, 'contact', 'index.html');
const DETECT = join(dist, '__forms.html');

const problems = [];

for (const [label, path] of [
  ['contact page', CONTACT],
  ['detection file', DETECT],
]) {
  if (!existsSync(path)) problems.push(`${label} missing from the build: ${path}`);
}

if (problems.length) {
  console.error('\nform check FAILED\n' + problems.map((p) => `  - ${p}`).join('\n') + '\n');
  process.exit(1);
}

const contact = readFileSync(CONTACT, 'utf8');
const detect = readFileSync(DETECT, 'utf8');

/** Field names inside the first <form> of a document. */
const fieldNames = (html) => {
  const form = html.match(/<form[\s\S]*?<\/form>/)?.[0] ?? '';
  return [...form.matchAll(/<(?:input|select|textarea)[^>]*\sname="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();
};

const formName = (html) => html.match(/<form[^>]*\sname="([^"]+)"/)?.[1] ?? null;
const hiddenName = (html) => html.match(/name="form-name"[^>]*value="([^"]+)"/)?.[1] ?? null;
const honeypot = (html) => html.match(/netlify-honeypot="([^"]+)"/)?.[1] ?? null;

const real = fieldNames(contact);
const decl = fieldNames(detect);

if (formName(contact) !== formName(detect)) {
  problems.push(`form name differs: contact="${formName(contact)}" detection="${formName(detect)}"`);
}
for (const [label, html] of [
  ['contact page', contact],
  ['detection file', detect],
]) {
  if (hiddenName(html) !== formName(html)) {
    problems.push(
      `${label}: hidden form-name input is "${hiddenName(html)}" but the form is named "${formName(html)}"`,
    );
  }
  if (!honeypot(html)) problems.push(`${label}: netlify-honeypot attribute missing`);
  if (!/data-netlify="true"|<form[^>]*\snetlify\b/.test(html)) {
    problems.push(`${label}: form is not marked for Netlify (data-netlify)`);
  }
}

const missing = real.filter((n) => !decl.includes(n));
const extra = decl.filter((n) => !real.includes(n));
if (missing.length) problems.push(`on /contact but not registered: ${missing.join(', ')}`);
if (extra.length) problems.push(`registered but not on /contact: ${extra.join(', ')}`);

if (problems.length) {
  console.error('\nform check FAILED — Netlify would drop fields it has no record of.\n');
  for (const p of problems) console.error(`  - ${p}`);
  console.error('\n  Fix: update src/data/intakeForm.ts so it matches src/pages/contact.astro.\n');
  process.exit(1);
}

console.log(`form check ok — "${formName(contact)}", ${real.length} fields match the detection file`);
