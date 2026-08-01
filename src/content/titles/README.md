# Titles

One YAML file per audiobook. The filename becomes the entry id (use a slug).

```yaml
title: The Book Title
author: A. Author
genre: Romance
runtimeHours: 8.5
releaseYear: 2026
status: published # or: in-production
sortOrder: 1
# Optional until the assets exist:
# coverImage: ./covers/the-book-title.jpg   (square, 1000x1000 or larger)
# audibleUrl: https://www.audible.com/pd/...
# sampleAudio: /audio/the-book-title.mp3    (file lives in public/audio/)
# publisher: Indie
```

Lower `sortOrder` sorts first. `status: in-production` entries render dimmed
with no link (spec section 4).

The four files currently here are placeholders with invented values — delete them
as real titles come in.
