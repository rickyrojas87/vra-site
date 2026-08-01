# Victoria Rojas Audio: Build Spec

Static site built with Astro, deployed on Netlify, content edited through
Sveltia CMS. This document describes what exists, not what was once planned.

> **History.** The original spec targeted a Wix Classic Editor build with Velo
> custom elements and HTML embeds. None of that was used. The design system,
> section structure, form fields and content schema below carried over intact;
> the delivery mechanism did not.

**Pages:** `/` `/about` `/works` `/contact` — slugs unchanged from the old Wix
site, so no redirects are needed at cutover. Plus `/thanks` (post-submit,
noindexed) and `/admin` (CMS, noindexed).

---

## 1. Global setup

### Color tokens

Defined once in `src/styles/global.css`. Never hard-coded anywhere else.

| Role | Token | Hex |
|---|---|---|
| Deep surface (footer, alternating bands) | `--c-deep` | `#1B1C20` |
| Page background | `--c-bg` | `#222328` |
| Elevated panel | `--c-panel` | `#2C2D33` |
| Primary accent (CTA, active state, waveform) | `--c-accent` | `#D4AF37` |
| Secondary accent (borders, dividers, hover) | `--c-accent-2` | `#B8925A` |
| Body text on dark | `--c-text` | `#F5EDD6` |
| Muted text, captions, metadata | `--c-muted` | `#C8B8A2` |
| Quietest text (disclaimers, attribution) | `--c-quiet` | `#9A9BA4` |

Derived: `--c-header-bg` (page bg at 92%), `--c-rule` (`--c-accent-2` at 30%),
`--c-card-border` (`--c-accent-2` at 35%).

Rules:

- Gold is for one action per screen. Side-by-side buttons mean the primary is
  `#D4AF37` filled and the secondary is transparent with a `#B8925A` 1px border.
- `--c-quiet` is chosen for contrast, not taste: it must clear WCAG AA (4.5:1)
  against `--c-panel`, the darkest surface it sits on. Do not darken it.

### Surfaces

Three background values alternate down every page. **No two consecutive
sections may share a surface**, and the last band before the footer must not be
`deep`, because the footer is. Utility classes: `.surface-base`,
`.surface-deep`, `.surface-panel`.

### Typography

Self-hosted woff2 in `public/fonts`. No third-party font request.

| Token | Font | Desktop | Mobile | Weight | Tracking |
|---|---|---|---|---|---|
| H1 | Cormorant Garamond | 64px | 40px | 300 | 0.14em |
| H2 | Cormorant Garamond | 42px | 28px | 300 | 0.06em |
| H3 | Cormorant Garamond | 28px | 22px | 400 | 0.04em |
| Body | Raleway | 17px | 16px | 400 | 0 |
| Label / eyebrow | Raleway | 13px | 12px | 500 | 0.20em, uppercase |
| Button | Raleway | 14px | 14px | 500 | 0.12em, uppercase |

Line height: 1.25 on headings, 1.7 on body. Both families are **variable
fonts** — one file per family covers every weight.

Breakpoint for the desktop step is 768px.

### Spacing

- Max content width: 1140px
- Section padding: 120px top and bottom desktop, 64px mobile
- Column gutter: 24px
- Element vertical rhythm inside a section: 16 / 24 / 40 / 64px only

### Headings

Section eyebrows are `<h2 class="label">`, not `<p>`. Card titles are `<h3>`.
Every page outline runs h1 → h2 → h3 with no skips.

---

## 2. Header

Sticky, `--c-bg` at 92% opacity, 1px bottom border `--c-rule`. Height 88px
desktop, 64px mobile.

- Left: wordmark. Text only, Cormorant Garamond 22px, `--c-text`, tracking
  0.18em, reading `VICTORIA ROJAS`. Never a photo.
- Center: Home, About, Works, Contact. Raleway 14px, `--c-muted`, active state
  `--c-accent`. Four items, no overflow menu.
- Right: one gold outline button, `Request a quote`, to `/contact`.
- Below 900px the nav collapses to a drawer.

No Instagram icon in the header; it lives in the footer.

---

## 3. Home

| # | Section | Surface | Content |
|---|---|---|---|
| 1 | Hero | base | Full-bleed photo at 100vh, directional scrim, 21 animated gold bars, grain. `VICTORIA ROJAS` H1, `AUDIOBOOK NARRATOR` label, 44px gold divider, `Voice. Story. Experience.` H3. Two buttons: `Hear demos` (anchors to §2), `Request a quote`. |
| 2 | Demo player | deep | Waveform player. Genre pills, track list, canvas, transport. |
| 3 | Selected titles | panel | Up to 4 cover cards. Champagne frame, elevation, gold hover ring. |
| 4 | Proof | base | Stats strip, Audible ratings list, testimonials. Hidden entirely when no ratings exist. |
| 5 | Delivery spec | deep | Panel on `--c-panel`, 12px radius, two columns plus optional turnaround line. |
| 6 | CTA band | base | H2 `Let's talk about your book.` One gold button to `/contact`. |
| 7 | Footer | deep | See §7. |

---

## 4. About

| # | Section | Surface | Content |
|---|---|---|---|
| 1 | Title | base | H1 `About`. No eyebrow. |
| 2 | Bio | deep | Two columns, 5/7 split. Portrait fills its column; both columns end on the same line. Copy is verbatim from her own site, with the "newer voice in the industry" sentence deleted. |
| 3+4 | Range and Genres | base | One two-column block, 1fr / 1.35fr, 28px gap, stacking below 700px. Left: intro line and accent tags. Right: NARRATED (catalog-derived, filled gold) and ALSO AVAILABLE FOR (outline). |
| 5 | Studio | deep | Booth photo beside the delivery panel, 1fr / 1.5fr, equal height. |
| — | Photos | panel | Staggered 4-column collage. Hidden below 4 photos. |
| 6 | CTA band | base | Same as Home §6. |

Ceiling of six images on this page: portrait, studio shot, and a four-image
collage. No unstructured photo stacking.

---

## 5. Works

| # | Section | Surface | Content |
|---|---|---|---|
| 1 | Title | base | H1 `Works` |
| 2 | Demos | deep | Waveform player, same component as Home. |
| 3 | Published titles | base | Grid, 3 across desktop, 1 across mobile. Cover, title, subtitle, author, genre, run time, year, publisher, Audible link. |
| 4 | In production | panel | Same grid, dimmed to 60%, no link, `In production` label. |
| 5 | CTA band | base | Same as Home §6. |

---

## 6. Contact

| # | Section | Surface | Content |
|---|---|---|---|
| 1 | Title | base | H1 `Request a quote`, subhead about the two-business-day reply. |
| 2 | Estimate | deep | Quote calculator. |
| 3 | Intake form | base | Fields below. Posts to Netlify Forms, redirects to `/thanks`. |
| 4 | Direct | panel | Email, response time, ACX and Audible profile links. |

### Form fields

1. Name (text, required)
2. Email (email, required)
3. Book title (text, required)
4. Genre (dropdown: Romance, Thriller / Suspense, Mystery, Fantasy, Science
   Fiction, Horror, Historical Fiction, Young Adult, Children's,
   Memoir / Biography, True Crime, Self-Help, Other)
5. Word count (number, required)
6. Deal type (dropdown: ACX royalty share, Per finished hour, Stipend plus
   royalty share, Not sure yet)
7. Target delivery date (date)
8. Is the manuscript final? (yes / no, required)
9. Link to manuscript or sample (url)
10. Anything else (long text)

Fields 5, 6 and 8 are the qualifying ones. Do not cut them to shorten the form.

The field list is mirrored in `src/data/intakeForm.ts`, which generates the
Netlify detection file. A build-time assertion fails the build if they diverge.

### Quote calculator

Two services, rates in `src/data/pricing.ts`:

| Service | Rate |
|---|---|
| Narration Only (Raw Audio) | $135 per finished hour |
| Full Production (Narration + Mastering) | $200 per finished hour |

Estimated finished hours = word count ÷ 9,300. **Round only at display.** The
total is computed from unrounded hours; rounding first compounds and reads $0
on small inputs. Output shows finished hours and a "Starting estimate" — no
standalone rate figure, because as an output it read like a fixed price.

---

## 7. Footer

Background `--c-deep`, 1px top border `--c-rule`.

- Column 1: wordmark, tagline, business email
- Column 2: page links
- Column 3: Instagram, ACX profile, Audible narrator page
- Bottom bar: copyright, Raleway 12px `--c-muted`

---

## 8. Interactive elements

All built as Astro components with inlined vanilla JS. No dependencies, no
third-party player libraries, no iframes.

| Element | Page | Status |
|---|---|---|
| Animated hero | Home | Built. Pure CSS, seeded bar values, reduced-motion aware. |
| Waveform demo player | Home, Works | Built. Custom canvas renderer, precomputed peaks. |
| Voice range matrix | About | Not built. Interim treatment is the accent tag row. |
| Quote calculator | Contact | Built. |

---

## 9. SEO — complete

- [x] Per-page SEO title and description on all four pages
- [x] Canonical derived from `process.env.URL`, never hardcoded
- [x] Open Graph title, description, type, url, image (1200×630), image:alt
- [x] Twitter `summary_large_image` with matching tags
- [x] Person schema (name, jobTitle, url, image, email, address, sameAs)
- [x] Audiobook schema per title with ISO 8601 duration and aggregateRating
- [x] Sitemap via `@astrojs/sitemap`, excluding `/thanks` and `__forms.html`
- [x] `robots.txt` generated from the same origin as the canonical
- [x] Alt text on every image — 18 images, none missing, none echoing a filename
- [x] Favicon, apple-touch-icon, web manifest, theme-color
- [x] Slugs verified identical to the old site
- [ ] Google Search Console verification tag — slot ready, token needed
- [ ] Bing verification tag — slot ready, token needed
- [ ] Analytics — no provider chosen
- [ ] Sitemap resubmitted in Search Console — after the domain moves

Lighthouse, desktop preset: Performance 100, Accessibility 100, SEO 100, Best
Practices 100 on all four pages.

---

## 10. Outstanding

**Content still needed:**

1. Author testimonials — collection and rendering exist, no entries written
2. Turnaround time per finished hour — field exists and is empty, so the line
   does not render
3. Logo — the wordmark is text-only; there is no mark
4. Accent recordings for the voice range matrix (§8 phase 2)

**Technical:**

5. IndexNow integration
6. Search Console and Bing verification tokens
7. Analytics provider
8. Per-page OG images — currently one shared default
9. `releaseDate` field — the catalog is year-granular, so the "Months active"
   stat is an approximation
10. `portrait.jpg` and `booth.jpg` are 1200px sources while the rest are 2400px

**Never verified in a browser:** the waveform player and quote calculator.
Their logic is covered by simulation tests, but playback, seeking, filter
switching, the segmented toggle and the handoff scroll have not been exercised
by a human.
