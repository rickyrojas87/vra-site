/**
 * Single source for site-wide strings and outbound links.
 *
 * `null` means "still needed from you" (spec section 10). Anything null renders
 * as muted, unlinked text with a pending marker instead of a dead link — swap in
 * the real value here and every page picks it up.
 */
export const site = {
  name: 'Victoria Rojas',
  wordmark: 'Victoria Rojas',
  tagline: 'Audiobook narrator, Central Texas',
  email: 'victoriarojasaudio@gmail.com',
  responseTime: 'Replies within two business days.',
} as const;

export type ExternalLink = {
  id: 'instagram' | 'acx' | 'audible';
  label: string;
  href: string | null;
};

/**
 * Spec section 10 item 4 — all three now supplied. The `null` fallback stays in
 * the type and in the templates so a future addition can be entered before its
 * URL exists, but no entry currently takes that branch.
 */
export const externalLinks: ExternalLink[] = [
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/vrojasaudio' },
  { id: 'acx', label: 'ACX profile', href: 'https://www.acx.com/narrator?p=A2N6DR2ZQGH3PE' },
  {
    id: 'audible',
    label: 'Audible narrator page',
    href: 'https://www.audible.com/search?searchNarrator=Victoria+Rojas',
  },
];

/** Contact section 4 lists the two professional profiles, not social. */
export const professionalLinks = externalLinks.filter((l) => l.id !== 'instagram');

export const pages = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Works', href: '/works' },
  { label: 'Contact', href: '/contact' },
];
