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
  /** TODO: confirm the business address to publish. */
  email: 'hello@victoriarojasaudio.com',
  responseTime: 'Replies within two business days.',
} as const;

export type ExternalLink = {
  id: 'instagram' | 'acx' | 'audible';
  label: string;
  href: string | null;
};

/** Blocked on spec section 10, item 4. */
export const externalLinks: ExternalLink[] = [
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/vrojasaudio' },
  { id: 'acx', label: 'ACX profile', href: null },
  { id: 'audible', label: 'Audible narrator page', href: null },
];

/** Contact section 4 lists the two professional profiles, not social. */
export const professionalLinks = externalLinks.filter((l) => l.id !== 'instagram');

export const pages = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Works', href: '/works' },
  { label: 'Contact', href: '/contact' },
];
