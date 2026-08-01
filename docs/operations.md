# Operations

Domain, hosting and billing facts that live nowhere else. Read this before
touching DNS, changing plans, or debugging a deploy.

---

## Domain and DNS

**`victoriarojasaudio.com` is registered at Wix, paid through January 2029.**

**DNS records are managed at Wix, not at Netlify.** Netlify shows a DNS zone for
the site, but it is not authoritative — editing records there does nothing.
This is the single easiest thing to get wrong.

| Record | Host | Value |
|---|---|---|
| A | apex (`@`) | `75.2.60.5` |
| CNAME | `www` | `vra-site.netlify.app` |

`75.2.60.5` is Netlify's load balancer. If the site goes dark, check that these
two records are still intact **at Wix** before looking anywhere else.

---

## Wix plan

**The Wix Core plan lapses 14 December 2026.** The site no longer runs on Wix —
only the domain registration matters.

- **Turn auto-renew off before that date** so the plan is not renewed for a
  site that no longer exists. The domain registration is separate and paid
  through 2029; do not cancel that.
- **After the plan lapses, verify the DNS records above are still editable at
  Wix.** Domain-only accounts normally retain DNS management, but confirm it
  rather than assume it. If DNS management is lost, the records must move to
  Netlify DNS or another provider, and the nameservers change with them.

---

## Netlify plan and credits

The free plan is **credit-based: 300 per month.**

| Action | Cost |
|---|---|
| Production deploy | 15 credits |
| Bandwidth | 20 credits per GB |

That is roughly **20 production deploys a month** before bandwidth is counted.

**Batch pushes.** Every push to `main` triggers a build. Pushing five small
commits separately costs 75 credits; pushing them together costs 15. Local
`npm run build` is free — verify there, then push once.

Vikki's CMS saves each commit separately and therefore each cost a deploy.
Normal editing volume is fine; a long session of small edits is not.

### Forms

**Netlify form detection had to be enabled manually in the UI**, and the
setting only takes effect on the *next* build. Enabling it does not
retroactively register anything.

Form registration happens at deploy time by parsing static HTML. See
`CLAUDE.md` §5 for why `__forms.html` is generated and asserted.

---

## Repository visibility

**The repo is public deliberately.**

Netlify's free plan allows only one contributor on a **private** repo. Vikki
pushes through the CMS, which makes her a second contributor. Public
repositories have no such limit.

Consequences to keep in mind:

- Never commit secrets. There are none today and there must be none tomorrow.
- The build has no private environment variables.
- Making the repo private would break her ability to save from the CMS unless
  the Netlify plan is upgraded.

---

## Sveltia CMS authentication

Sveltia authenticates through **Netlify's OAuth**, using the GitHub app already
registered against this Netlify site. That is why `public/admin/config.yml` has
no `base_url` — omitting it *is* the Netlify method.

**This path is backward-compatibility support, not Sveltia's recommended one.**
Their docs say plainly: *"We are not affiliated with Netlify and do not endorse
or maintain this authentication method. We only provide it to ensure backward
compatibility with Netlify CMS."*

**If GitHub login through the CMS ever breaks**, the fix is to deploy the
Sveltia CMS Authenticator — a small Cloudflare Worker — and add its URL as
`base_url` under `backend` in `config.yml`. Nothing else changes. Budget an
hour, not a day.

### Behaviour to know

- **Sveltia rewrites the whole file on save and strips comments.** Any comment
  in a CMS-managed YAML file is gone the first time she touches that entry.
  Do not put load-bearing information there.
- **Blank fields are written, not omitted** — as `null`, `''` or `{}` depending
  on the widget. The content schema is built to tolerate all three.
- **Editorial workflow is off.** Saves commit straight to `main` and deploy.
  Rollback is `git revert`; she has no undo in the UI.

---

## Build gotcha

**Astro persists its content store at `node_modules/.astro/data-store.json`**,
not `.astro/`. Deleting `.astro` does not clear it. Entries removed from disk
will keep appearing in builds — and in anything you use to verify them — until
that file is deleted.

```bash
rm node_modules/.astro/data-store.json
```

This cost real debugging time once. It will again.

---

## Deploy checklist

Before pushing anything that touches content or the form:

1. `npm run build` locally — it runs the peaks step, the form generator and the
   form assertion, and fails on drift
2. Check the output for `[content] skipped …` warnings
3. Batch the push
4. Watch the Netlify deploy log for the first build after any CMS-schema change
