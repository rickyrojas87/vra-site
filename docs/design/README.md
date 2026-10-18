# Design reference (Claude Design export, 2026-10-17)

These are the approved artboards. Markup and CSS in these files are the source of truth for layout, spacing, colours, headings and copy. Match them one to one; the spec describes intent, these files show the result.

- Main.html = Home, About.html, Works.html, Contact.html
- shared-style.css = the shared stylesheet all four pages use (also inlined in each file)
- `{{...}}`, `<sc-for>` and `<sc-if>` are the design tool's template syntax: render the same thing with Astro.
- Internal links use *.dc.html names; map Main -> /, About -> /about, Works -> /works, Contact -> /contact.

## Blob to repo asset map

| /_blob/ id | Repo file |
|---|---|
| 4fcc17ecced32a1684ad46f3eb0d8f9f | src/assets/main.jpg (hero photo) |
| d3071627ef6231ec5e426717216af7f3 | src/assets/portrait.jpg (Meet, armchair) |
| 8b41e057d00880869527ba70ca328675 | src/assets/booth.jpg |
| 39b14309c901a304c948145887b86eb6 | ivory logo |
| de8019e577b6b0e4453e1dadd05b2d4f | public/video/library-loop.mp4 |
| ca8b9b19c45a7093bbf746dce007591f | src/assets/library-poster.webp |
| a896367f05c20d97373de88e17bc4dc0 | src/assets/library-chair.png |
| defc5102b2dab57116f4752208ce602a | src/assets/library-spines.png |
| b3b5a9dea03b50c61a40cd39a395c4e6 | Neighborly cover |
| f1e88d00... | The Summer of No Kids cover |
| 1124ba46... | Unravel cover |
| c4410210cf3aa07ea0d01ffede12d0aa | Smother cover |
