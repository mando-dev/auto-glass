# Auto Glass — Orange County

Astro static site. Deploys to Vercel on push to `main`.

## Local

```bash
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server on :4321 |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run check:placeholders` | Fails if unresolved client placeholders are still in `dist/` |

## Where the business facts live

Everything — name, phone, hours, service area, services, reviews — is in
[`src/lib/site.ts`](src/lib/site.ts). Nothing is hardcoded in a component. Change
it once there and it changes everywhere, including the schema markup.

The `PENDING` flags at the top of that file control what renders. While a flag is
`true`, the matching section either hides or shows an orange build note instead of
inventing content. Flip the flag once the client supplies the real information.

## Environment

One variable, set in the client's Vercel project under **Settings → Environment
Variables**, and locally in `.env` (copy `.env.example`):

```
PUBLIC_WEB3FORMS_KEY=
```

The Web3Forms access key is public by design — it ships in the HTML. It is not a
secret, but it does belong to the client's Web3Forms account.

## DNS — for the client to enter in Cloudflare

Add these in Cloudflare once the domain is registered and the Vercel project
exists. **Set both to DNS only (grey cloud), not proxied** — Vercel terminates TLS
itself and proxying breaks certificate issuance.

| Type | Name | Value | Proxy |
| --- | --- | --- | --- |
| A | `@` | *(apex IP shown in Vercel)* | DNS only |
| CNAME | `www` | *(target shown in Vercel)* | DNS only |

Take the exact values from **Vercel → Project → Settings → Domains** after adding
the domain there. Vercel has changed its apex IP before, so copy what the
dashboard shows rather than reusing a value from an older project — a stale apex
record is a site-down, not a warning.

## Before launch

Run `npm run build && npm run check:placeholders`. It exits non-zero while
anything below is outstanding.

Needed from the client, in writing:

- Business name, domain, phone number, email
- Whether there is a walk-in shop or it is mobile-only (drives whether an address
  is published at all — a service-area business with a public storefront address
  is a Google Business Profile guideline problem)
- Hours
- Insurance and any certification — **no credential goes on the site without
  evidence**, and California does not require a CSLB license for auto glass, so
  nothing carries over from another trade
- Owner name, role, real photo, and how long they have been doing glass
- 6–9 real job photos. No stock.
- Google Business Profile and Yelp URLs, once reviews exist
- Confirmed city list for the service area
- Web3Forms access key
- Sign-off on the four "why people call us back" reasons on the homepage — they
  are drafted positioning, not supplied fact
- **ADAS calibration**: do they do it in house, sublet it, or decline
  camera-equipped vehicles? `/adas-calibration/` stays unbuilt until this is
  answered. This is the one topic where wrong copy is a safety claim.

## Not yet built, deliberately

**Phase 2 — gated on a written client answer:**

- `/adas-calibration/` — 3 of 7 audited Orange County competitors run a dedicated
  ADAS page, so this is a normal and legitimate service in this market and worth
  putting to the client as evidence. It is still their call. Competitors offering
  it is not confirmation that this client does, and this is the one page where
  wrong copy is a safety claim rather than a marketing one.
- City pages — the client provides the list. Do not copy a competitor's city list.
  Data is staged in `site.ts`; the coverage section and footer links switch on
  when `PENDING.cities` flips to `false`.
- Careers link in the footer — add only if the client is hiring techs

**Phase 3 — roadmap, not this build:** fleet subpages (work vans, multi-vehicle
intake), make-specific pages (Tesla, BMW — gated on documented capability),
expansion cities. Astro pages are cheap to add once there is real traffic data
saying which are worth having. Building them now is guessing.

**Anti-pattern, explicitly rejected:** one audited competitor runs 222 pages,
mostly thin ZIP-code doorway pages for Texas, Florida and Ohio with no Orange
County relevance. It ranks acceptably today. Do not imitate it — page count over
substance is a pattern that ages badly. Fewer real pages.

## SEO notes

Target terms per page are recorded next to each entry in `site.ts`. The mobile
page leads its `<title>` with the exact phrase "Mobile Windshield Repair" —
competing pages ranking for that term are generic homepages that never put the
phrase in a title at all.

Titles are kept under roughly 60 characters including the brand suffix so they do
not truncate in results.

The homepage leads with fleet and commercial content ahead of personal vehicles,
matching the client's stated priority.

### This repo is not the whole job

Competitor research found the Local/Map Pack above organic results on every query
tested. That means the client's **Google Business Profile does as much work as
this site does**, and nothing in this repo can substitute for it. Whoever handles
off-page work should treat the profile as first priority, then citations — Yelp
first, since it was verified across the most competitors, then MapQuest, then
smaller directories.

Two on-page decisions already account for this: the service-area business keeps
its address out of the schema unless the client has a real walk-in shop, and
review markup only emits for reviews that exist on a public profile. Both keep
the site consistent with what the Business Profile says.
