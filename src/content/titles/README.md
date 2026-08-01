# Titles

One YAML file per audiobook. The filename becomes the entry id — use the title's
lowercase-hyphenated slug, matching its cover in `covers/`.

Only `title` and `status` are required. Every other field is optional, and cards
**omit** whatever is missing rather than rendering a blank. Leave a field out
until you have the real value; never fill one in with a guess.

```yaml
title: The Book Title
status: published # or: in-production
sortOrder: 1
coverImage: ./covers/the-book-title.jpg # square; 2400x2400 is the Audible standard
sampleAudio: /audio/demo-the-book-title.mp3 # file lives in public/audio/

# Optional:
# author: A. Author
# genre: Romance
# runtimeHours: 8.5
# releaseYear: 2026
# publisher: Indie
# audibleUrl: https://www.audible.com/pd/...
```

Lower `sortOrder` sorts first. `status: in-production` entries render dimmed with
no Audible link (spec section 4).

Cover art lives in `covers/`, inside the collection, so Astro's sharp pipeline
optimizes it at build time. Do not put covers in `public/` — files there are
served untouched and skip optimization entirely.
