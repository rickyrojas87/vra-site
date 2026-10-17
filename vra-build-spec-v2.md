# Victoria Rojas Audio: Build Spec v2 (The Library redesign)

Approved rendering: Claude Design canvas "Victoria Rojas Audio Redesign", boards Home, About, Works, Contact. This document is the contract for the build. Where the rendering and this document disagree, this document wins.

Decisions here are locked. Anything not listed is unchanged from v1 (`vra-build-spec.md`).

---

## 1. Scope

- Four pages stay: `/` `/about` `/works` `/contact`, plus `/thanks` and `/admin`. Slugs unchanged.
- Home is the showcase. About, Works and Contact get the same design system and a shorter version of the hero.
- Built on branch `redesign-2026`. `main` and the live site stay untouched until Vikki approves the branch deploy.
- Performance target: keep Lighthouse 100/100/100/100 on every page. The hero video is the one known risk and has its own rules (section 4).

## 2. Design system additions

All tokens live in `src/styles/global.css`. Nothing hard-coded in components.

### Colour
Existing tokens unchanged. New:

| Token | Hex | Use |
|---|---|---|
| `--c-library` | `#12271E` | Testimonial band base |
| `--c-hunter` | `#1F4D3A` | Selected chip, selected track, hover fills, estimator "full production" box, offset photo block |
| `--c-emerald` | `#3F8C64` | Hairlines, bullets, active borders, progress bar start |
| `--c-emerald-glow` | `#4FB383` | Live dot and small labels only, text 13px and up |

Rules: gold stays the only action colour. Green is a surface and state colour, never a button fill. Ivory text on every green surface.

### Text colour
Page text brightened for contrast on green: body `#FAF6EC`, lede `#F3ECDD`, card body copy `#DCD2BD`, captions on green `#E6DCC6`, headings on the testimonial band pure `#FFFFFF`.

### Type
- Cormorant Garamond and Raleway unchanged.
- New third family: **La Belle Aurore** (handwriting), self-hosted woff2 in `public/fonts`, loaded only on pages where it appears. Used in exactly two places: the hero tagline and the About signature. Gold `#D4AF37`, 2 degree upward rotation, soft gold glow (`text-shadow 0 0 12px rgba(212,175,55,.12)` on the signature; the hero tagline may run brighter).

### Surfaces and section joins
- Sections no longer switch colour on a hard line. Each section's top fades from the previous section's colour over 240px (`linear-gradient`). The testimonial and quote bands fade both in and out.
- Film grain overlay across the whole page: tiling 240px noise PNG, `opacity .06`, `mix-blend-mode: overlay`, `position: fixed`, `pointer-events: none`.
- Gold thread: every section after the hero opens with a 1px vertical gold gradient line, 96px tall, centred, ending in a 9px rotated gold square with glow.
- Section eyebrows carry a gold chapter number: `01` to `07`, separated from the label by a 1px gold rule.

### Cards (one treatment everywhere)
24px radius, background `--c-bg` or `--c-panel`, `box-shadow: 0 30px 70px rgba(0,0,0,.4), inset 0 0 0 1px rgba(184,146,90,.28)`. Hover: lift 6px, inset border turns `#D4AF37`. Applies to: track list, stage, shelf cards, quote cards, Meet panel, process cards, studio spec, estimator, form panel, contact cards.

### Buttons
Rounded rectangles, 10px radius, Raleway 13px 600, `.16em` tracking, uppercase, min-height 52px.
- Primary "gold leaf": gradient `135deg #E6C85E, #D4AF37 48%, #B8925A`, 1px dark inner line inset 4px, top highlight and bottom shade, hover lift 3px with a light sweep (`::after` skewed gradient, `.4` white) and a faint warm shadow (`0 6px 14px rgba(212,175,55,.1)`). Glow is deliberately subtle.
- Secondary "bookplate": transparent, antique gold hairline, gold corner ticks top-left and bottom-right, hover fills hunter green left to right.
- Arrow icon on action buttons slides 5px right on hover.

### Other shapes
- Chips (genre filters): 8px radius, selected gets hunter fill and a 3px gold underline.
- Booking badge: 8px radius; the month is gold, uppercase, `.14em` tracking.
- Accent and genre tags: no boxes. Cormorant 21px with a gold four-point star `\2726` before each item; star and text never split across lines.
- Shelf ribbons: vertical bookmark hanging from the card top, notched bottom, gold gradient with a dark fold shadow at the top, 1.2 degree tilt, two-layer drop shadow via `filter` on a wrapper. Green variant for "In production".

### Photos of Vikki
One treatment for all three (hero, Meet, Studio): 20px radius, 1px gold edge, breathing gold glow (`halo` keyframe, 7s alternate: `0 0 40px` to `0 0 70px` gold at `.22` to `.42`, plus `0 0 120px` to `0 0 180px` at `.12` to `.24`, plus `0 40px 90px` black `.6`). Four twinkling four-point gold sparks around the hero photo, two around Meet. Slow 14s zoom on the image inside the frame.

### Motion
- Reveal: every section's main block fades up 48px over 0.9s on load. Not scroll-driven (scroll timelines left the last section stuck half-faded).
- Dust motes: 26 gold specks drifting up through the hero, shelf, testimonials, Meet and quote sections.
- Lamp flicker and green glow over the hero video.
- `prefers-reduced-motion`: every animation and transition off, video replaced by the poster.

## 3. Home page sections (in order)

| # | Section | Surface | Notes |
|---|---|---|---|
| 0 | Hero | video | See section 4 |
| | Stats strip | deep | Marquee, 42s loop: published titles, average rating, listener ratings, finished hours, accents (8), ACX, in-house. All numbers computed at build (section 7). |
| 01 | The listening room | deep | Existing WaveformPlayer, restyled. Genre chips. Full-width ambient waveform (160 bars, 40 on phones) rising from the section floor; section bottom padding 300px desktop, 220px phone. |
| 02 | On the shelf, "Now and next." | panel | Four cards, one row. Order rule: in-production titles first, then published newest first. "Showing 4 of N titles" line. Button "See the full catalog" to `/works`. Ribbons: "Just published" (gold) on the newest published title; "In production" (green) on in-production titles. |
| 03 | In their words | library | Three quote cards, 3 across. Background: `library-chair.webp` at `.55` inside a wrapper that fades top and bottom thirds (mask on the wrapper, zoom on the image inside it, so the zoom never pushes the fade past the edge). No overlay tint. Quote cards `rgba(12,28,21,.72)` with `backdrop-filter: blur(6px)`. Key phrase per quote in italic gold. Avatar = book cover, or initials when the book is not in the catalog. |
| 04 | Meet your narrator | base | Panel card: portrait left, two bio paragraphs, signature, "Read my story" to `/about`. Accents row below. |
| 05 | How we work together | deep | Six chapter cards in one row (3 on tablet, 1 on phone). Italic serif numeral 60px with short gold rule; final card's rule runs full width gold to green. Progress bar per card 17/33/50/67/83/100%. Label "Chapter N", last card "The end". Copy per card 23 to 26 words. |
| 06 | The studio | panel | Booth photo (photo treatment above, object-position 50% 20%) beside the spec card. |
| 07 | Start here | base | Estimator (slider 10k to 150k, hours = words / 9300, $135 and $200 PFH) beside the headline. Background `library-spines.webp` at `.4`, faded on the left 45% and top/bottom thirds. |
| | Footer | deep | Unchanged. |

Removed from Home: FAQ section, the lede paragraph in the hero, turnaround mentions.

## 4. Hero

- Title-page layout, centred: booking badge, double gold rules, `AUDIOBOOK NARRATOR` eyebrow, `VICTORIA ROJAS` in Cormorant 400, 80px, uppercase, `.12em` tracking, tagline `A voice for every story.` in La Belle Aurore 48px, closing double rules, two buttons. Photo on the right in the photo treatment, with the "Latest release" card floating bottom-left.
- **Booking badge:** "Now booking {MONTH} productions". Month = build date plus `bookingLeadMonths` (CMS setting, default 2), rolling on the 1st. Year appended when it differs from the current year. Needs the monthly rebuild (section 7).
- **Latest release card:** newest published title by release date, from the catalog. No field to maintain.
- **Video:** `public/video/library-loop.mp4` (H.264, 1280x720, 3.1 MB, 31s, no audio) and `library-loop.webm`, poster `library-poster.webp`. `autoplay muted loop playsinline preload="none"`; the `src` is attached after `window.load` so the video never competes with first paint. Poster shows until then. `filter: brightness(.7) saturate(.95) blur(.6px)`. On `prefers-reduced-motion` and on connections reporting `saveData`, the poster is used and the video is never requested. Lighthouse must stay 100 with the video in place; if it does not, the fallback is to load the video only above 900px.

## 5. About, Works, Contact

Shared: short hero (poster still, no video; title-page layout with a handwritten subline), gold thread, chapter numbers, dust, cards, footer.

- **About:** 01 Meet Victoria (portrait, full four-paragraph bio, signature), then a two-column row Accents and dialects | Genres. 02 How we work together as six stacked cards with Vikki's full wording (long form). 03 The studio. 04 In the booth: three-photo row. CTA band.
- **Works:** 01 The listening room (full player). 02 Published: all published titles, 4 across, cover, title, author, genre, runtime, rating and count, Audible link; "Just published" ribbon on the newest. 03 In production: in-production titles, "Coming soon". CTA band.
- **Contact:** 01 Starting estimate (estimator, rates shown under each figure). 02 Tell me about your book: the v1 intake form, unchanged fields, posting to Netlify Forms. 03 Or reach me directly: Email, ACX, Audible cards. `__forms.html` generation and `check-forms` stay.

## 6. Content changes (CMS)

- Testimonials collection: three entries added (Duffy, Winters, Sweat). Keep as is.
- Titles: Unravel published with Audible link; corrections to ratings, runtimes, subtitles already committed.
- Old Bastards stays **Comedy** (Audible files it under Erotica; Vikki's call).
- Stacks stays **Thriller** (deliberate normalisation, see titles README).
- New settings fields in `settings/delivery.yaml` via Sveltia: `bookingLeadMonths` (number, default 2). Turnaround field removed from the UI (no longer shown anywhere).
- Process steps become a `settings/process.yaml` list (title, short copy for Home, long copy for About) so Vikki can edit them.
- Housekeeping for Vikki: rename `covers/image0.jpeg` to `neighborly.jpg` and `covers/image0.png` to `the-summer-of-no-kids.png` in /admin.

## 7. Automation (no ongoing maintenance)

### Audible sync
`scripts/sync-audible.mjs`, run at the start of `npm run build`:
1. For every title with an `audibleUrl`, take the ASIN from the URL and fetch `https://api.audible.com/1.0/catalog/products/{ASIN}?response_groups=rating,product_desc,product_attrs,series`.
2. Write `src/data/audible.json` with rating, rating count, runtime minutes, release date, series name and number per ASIN.
3. Components read from this file first and fall back to the YAML values. Cover, sample audio, genre and status always come from the YAML.
4. Any fetch failure keeps the previously committed `audible.json` value for that title and logs a warning. The build never fails because of Audible.
5. `audible.json` is committed so a build with no network still has data.

Derived at build from the merged data: published count, average rating (mean of rated titles, one decimal), total listener ratings, total finished hours, "Latest release", shelf order, "Just published" ribbon.

### Scheduled rebuild
- Netlify build hook `weekly-refresh`.
- GitHub Actions workflow `.github/workflows/weekly-rebuild.yml`, cron `0 9 * * 1` (Mondays 09:00 UTC, 4am Central), POSTs to the hook. Also runs on the 1st of each month for the booking badge.
- Cost: 4 to 5 production deploys a month = 60 to 75 of the 300 monthly Netlify credits. Daily was ruled out for this reason (450 credits).

## 8. Checks before launch

- Lighthouse desktop and mobile on all four pages, 100 across; video rules in section 4 apply if mobile performance slips.
- Forms: submit a test on the branch deploy and confirm it lands in Netlify Forms.
- Player and estimator exercised by hand in Chrome and on an iPhone.
- Phone pass on every page at 390px: no horizontal scroll, every photo intact, headings not wrapping badly.
- Sveltia: Vikki edits a title and a testimonial on the branch and the build succeeds.
- Vikki approves the branch deploy. Merge to `main`. Confirm the weekly workflow ran once.

## 9. Open items

- Custom audition policy and royalty-share policy: not on the site until Vikki writes them.
- Per-page Open Graph images: still one shared image.
- Analytics: no provider chosen.
