# Victoria Rojas Audio: Build Spec

Target: new Classic Editor site, Dev Mode on, no plan attached during build.
Swap method: reassign Core plan when approved.

---

## 1. Global setup

**Site name:** VRA 2026
**Page slugs:** `/` `/about` `/works` `/contact` (keep identical to current site, no redirects needed)

### Color tokens

| Role | Hex |
|---|---|
| Page background | `#222328` |
| Elevated panel | `#2C2D33` |
| Primary accent (CTA, active state, waveform) | `#D4AF37` |
| Secondary accent (borders, dividers, hover) | `#B8925A` |
| Body text on dark | `#F5EDD6` |
| Muted text, captions, metadata | `#C8B8A2` |

Rule: gold is for one action per screen. If two buttons sit side by side, the primary is `#D4AF37` filled, the secondary is transparent with a `#B8925A` 1px border.

### Typography

Wix Editor path: Site Design > Text Themes

| Token | Font | Desktop | Mobile | Weight | Tracking |
|---|---|---|---|---|---|
| H1 | Cormorant Garamond | 64px | 40px | 300 | 0.14em |
| H2 | Cormorant Garamond | 42px | 28px | 300 | 0.06em |
| H3 | Cormorant Garamond | 28px | 22px | 400 | 0.04em |
| Body | Raleway | 17px | 16px | 400 | 0 |
| Label / eyebrow | Raleway | 13px | 12px | 500 | 0.20em, uppercase |
| Button | Raleway | 14px | 14px | 500 | 0.12em, uppercase |

Line height: 1.25 on all headings, 1.7 on body.

### Spacing

- Max content width: 1140px
- Section padding: 120px top and bottom desktop, 64px mobile
- Column gutter: 24px
- Element vertical rhythm inside a section: 16 / 24 / 40 / 64px only

---

## 2. Header

Sticky, background `#222328` at 92% opacity, 1px bottom border `#B8925A` at 30% opacity. Height 88px desktop, 64px mobile.

- Left: wordmark. Text only, Cormorant Garamond 22px, `#F5EDD6`, tracking 0.18em, reading `VICTORIA ROJAS`. Do not use a photo.
- Center: Home, About, Works, Contact. Raleway 14px, `#C8B8A2`, active state `#D4AF37`. Four items only, no More overflow.
- Right: one gold outline button, `Request a quote`, links to `/contact`.

Remove the Instagram icon from the header. It moves to the footer.

---

## 3. Home

| # | Section | Height | Content |
|---|---|---|---|
| 1 | Hero | 100vh minus header | Animated hero custom element. `VICTORIA ROJAS` H1, `AUDIOBOOK NARRATOR` label, `Voice. Story. Experience.` H3 in `#C8B8A2`. Two buttons: `Hear demos` (gold filled, anchors to section 2), `Request a quote` (outline, to /contact). |
| 2 | Demo player | auto | Waveform demo player embed. Genre pills across top, one player below. This is the single most important element on the site. |
| 3 | Selected titles | auto | 3 or 4 cover cards in a row. Cover art, title, author, genre, run time, Audible link. Champagne `#C8B8A2` 1px frame, no shadow. |
| 4 | Proof | auto | One author testimonial. Cormorant Garamond 28px italic, `#F5EDD6`, attribution in `#C8B8A2` 13px. Centered, max width 720px. |
| 5 | Delivery spec | auto | Panel on `#2C2D33`, 12px radius. Two columns: Studio (mic, interface, DAW, treated booth) and Delivery (ACX compliant, RMS -23 to -18 dB, peak -3 dB, noise floor under -60 dB, 192 kbps MP3 44.1 kHz mono, room tone headers and footers, punch and roll). |
| 6 | CTA band | 240px | H2 `Let's talk about your book.` One gold button to /contact. |
| 7 | Footer | auto | See section 7. |

---

## 4. About

| # | Section | Content |
|---|---|---|
| 1 | Title | H1 `About`, eyebrow label `NARRATOR, CENTRAL TEXAS` |
| 2 | Bio | Two columns, 5/7 split. Left: one portrait, full resolution, 4:5 ratio. Right: existing bio copy. Delete the sentence beginning "I am a newer voice in the industry." Replace with: "I've worked closely with experienced audio engineers and voice actors to refine both performance and production, so every title meets professional delivery standards start to finish." |
| 3 | Range | Voice range matrix element (phase 2). Until it ships, use a 3-column grid of accent names in `#F5EDD6` on `#2C2D33` cells, not a comma list. |
| 4 | Genres | Single row of pill tags, `#C8B8A2` text, `#B8925A` 1px border. |
| 5 | Studio | Same delivery spec panel as Home section 5. Reuse, do not rewrite. |
| 6 | CTA band | Same as Home section 6. |

Kill the six stacked photos. Two images maximum on this page: one portrait, one booth shot.

---

## 5. Works

| # | Section | Content |
|---|---|---|
| 1 | Title | H1 `Works` |
| 2 | Demos | Waveform player, full version with genre and accent filters. Rename every demo. No file names. Format: `Genre, character type` for character demos and `Title, Author` for book samples. |
| 3 | Published titles | Grid, 3 across desktop, 1 across mobile. Cover, title, author, publisher or indie, run time, release year, Audible link. Driven by a CMS collection named `Titles` so Vikki adds books herself. |
| 4 | In production | Same grid, dimmed to 60%, no link, label `In production`. |
| 5 | CTA band | Same as Home section 6. |

### CMS collection: `Titles`

Fields: `title` (text), `author` (text), `genre` (text), `runtimeHours` (number), `releaseYear` (number), `coverImage` (image), `audibleUrl` (url), `status` (text: published / in-production), `sampleAudio` (audio), `sortOrder` (number).

---

## 6. Contact

| # | Section | Content |
|---|---|---|
| 1 | Title | H1 `Request a quote`, subhead `Tell me about your book and I'll come back within two business days.` |
| 2 | Calculator | Quote calculator embed (phase 3). |
| 3 | Intake form | Fields below. |
| 4 | Direct | Email address, response time, and links to ACX profile and Audible narrator page. |

### Form fields

1. Name (text, required)
2. Email (email, required)
3. Book title (text, required)
4. Genre (dropdown: Romance, Thriller / Suspense, Mystery, Fantasy, Science Fiction, Horror, Historical Fiction, Young Adult, Children's, Memoir / Biography, True Crime, Self-Help, Other)
5. Word count (number, required)
6. Deal type (dropdown: ACX royalty share, Per finished hour, Stipend plus royalty share, Not sure yet)
7. Target delivery date (date)
8. Is the manuscript final? (yes / no, required)
9. Link to manuscript or sample (url)
10. Anything else (long text)

Fields 5, 6, and 8 are the qualifying ones. Do not cut them to shorten the form.

---

## 7. Footer

Background `#1B1C20`, 1px top border `#B8925A` at 30%.

- Column 1: wordmark, tagline, business email
- Column 2: page links
- Column 3: Instagram, ACX profile, Audible narrator page
- Bottom bar: copyright, Raleway 12px `#C8B8A2`

---

## 8. Custom element build order

| Phase | Element | Page | Method |
|---|---|---|---|
| 1 | Animated hero | Home | Velo custom element, full bleed |
| 1 | Waveform demo player | Home, Works | HTML embed |
| 2 | Voice range matrix | About | HTML embed |
| 3 | Quote calculator | Contact | HTML embed |

I write each one as a single self-contained file. You paste it, size the frame, publish.

---

## 9. SEO migration checklist

Run this before the plan reassignment, not after.

- [ ] Per-page SEO title and description entered on all four pages
- [ ] Google Search Console verification tag added to the new site
- [ ] Bing verification tag added to the new site
- [ ] Open Graph title, description, and image set per page
- [ ] Person schema markup added (name, jobTitle, url, sameAs for Instagram / ACX / Audible)
- [ ] Alt text on every image
- [ ] Favicon uploaded
- [ ] Google Analytics or Wix Analytics reconnected
- [ ] Sitemap resubmitted in Search Console after the domain moves
- [ ] Slugs verified identical to the old site so no redirects are required

### Suggested page titles

| Page | Title |
|---|---|
| Home | Victoria Rojas, Audiobook Narrator, Central Texas |
| About | About Victoria Rojas, Female Audiobook Narrator |
| Works | Audiobook Narration Demos and Published Titles |
| Contact | Hire an Audiobook Narrator, Request a Quote |

---

## 10. Still needed from you

Blocking specific sections:

1. Demo audio files with real labels (blocks Home 2, Works 2)
2. Cover art, author, run time, release year, Audible link per finished title (blocks Home 3, Works 3)
3. Full resolution portrait and one booth photo (blocks Home 1, About 2)
4. ACX profile URL and Audible narrator page URL (blocks Footer, Contact 4)
5. Author testimonial, even two lines (blocks Home 4)
6. Rate decision: publish a PFH range, or quote on request (blocks Contact 2)
7. Stated turnaround time per finished hour (blocks Home 5)

Nothing else is blocked. Sections 1, 2, 6, and 7 of this spec can be built today.
