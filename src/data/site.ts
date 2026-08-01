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
  label: string;
  href: string | null;
};

/** Blocked on spec section 10, item 4. */
export const externalLinks: ExternalLink[] = [
  { label: 'Instagram', href: null },
  { label: 'ACX profile', href: null },
  { label: 'Audible narrator page', href: null },
];

export const pages = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Works', href: '/works' },
  { label: 'Contact', href: '/contact' },
];
