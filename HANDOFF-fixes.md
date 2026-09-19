# Handoff: fixes for autoglasscrew.com (Astro site)

Paste this whole file as the first message to the model working in the repo at
`/Users/b/Desktop/auto-glass`. Work through the tasks in order. Do not skip the
rules section.

---

## 0. Rules (read first, apply to every task)

1. **Never invent business facts.** No license numbers, certifications, insurance
   claims, years in business, customer counts, review quotes, addresses, hours,
   prices, or dollar ranges. If something is unknown, leave it out. Do not write
   "we've done hundreds of these", "our customers", "years of experience",
   "usually within the hour", or anything implying a track record. The business
   has no confirmed history yet.
2. **All business identity lives in `src/lib/site.ts`.** Never type the phone
   number, email, or an address into any other file. Import from `@lib/site`.
   `npm run check:nap` fails the build if you break this.
3. **Do not build these pages:** `/adas-calibration/`, city pages, vehicle-make
   pages, fleet subpages. They are gated on client confirmation. Do not claim the
   business performs ADAS/camera calibration anywhere. Talking about calibration
   as a thing that exists is fine; saying "we calibrate" is not.
4. **Do not copy competitor text.** Write original copy only.
5. **Do not change** `LAUNCH_READY`, `site.url`, `SITE_URL` in
   `astro.config.mjs`, or anything in `PENDING`.
6. **Commit, do not push.** Pushing to `main` deploys to production. Make one
   commit per numbered task below (or group tasks 1–4 into one "copy fixes"
   commit). Commit messages: short imperative subject line, then a blank line,
   then this exact trailer:

   ```
   Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
   ```

7. Astro files use `---` frontmatter fences. Keep existing indentation and
   quoting style. Do not reformat files you are not editing.

---

## 1. Compliance copy fixes (four small edits)

### 1a. `src/pages/windshield-chip-repair.astro`

Find this FAQ answer (around line 40):

```
a: "Yes — Irvine is where a lot of our jobs happen to land, but the mobile service isn't limited to one city. Wherever you are in the county, call or text and we'll tell you straight away whether we can get to you and when.",
```

Replace with:

```
a: "Yes — Irvine is a base, not a boundary. The mobile service covers the county. Wherever you are, call or text and we'll tell you straight away whether we can get to you and when.",
```

### 1b. `src/pages/index.astro`

Find:

```
<h2>Why people call us back</h2>
```

Replace with:

```
<h2>How we work</h2>
```

### 1c. `src/pages/thanks.astro`

Find:

```
We'll come back to you shortly — usually within the hour during working
hours.
```

Replace with:

```
We'll come back to you as soon as we can.
```

### 1d. `src/components/LeadForm.astro`

Find:

```
"Got it. We'll call you back shortly — usually within the hour during working hours.";
```

Replace with:

```
"Got it. We'll call you back as soon as we can.";
```

---

## 2. Homepage title (stop competing with the mobile page)

`src/pages/index.astro`. Find:

```
const title = `Mobile Auto Glass Repair in Orange County | ${site.name}`;
```

Replace with:

```
const title = `Auto Glass Repair in Orange County | ${site.name}`;
```

Reason: `/mobile-auto-glass/` already owns the "mobile" keywords. The homepage
should own the broader county term.

---

## 3. Name the national chain on the mobile page

`src/pages/mobile-auto-glass.astro`. Find this paragraph:

```
<p>
  If you've called one of the big national chains before and got put on
  a scheduling queue days out, that's exactly the gap mobile, local
  service fills — no call center, no dispatch queue, one visit.
</p>
```

Replace with:

```
<p>
  If you've called Safelite or another national chain and been offered a
  slot days out, that's exactly the gap a local mobile operation fills —
  no call center, no dispatch queue, one call and one visit.
</p>
```

Keep it neutral. Do not add anything negative about Safelite beyond this.

---

## 4. Tesla post: add the target phrase, shorten both blog titles

### 4a. `src/content/blog/tesla-ev-windshield-glass.md`

Change the frontmatter title from:

```
title: "Tesla and EV windshields: what's actually different"
```

to:

```
title: "Tesla and EV windshields: what's different"
```

Then insert this new section **immediately before** the existing heading
`## What this means if you're dealing with damage right now`:

```
## Tesla windshield chip repair: same rules, one caveat

A rock chip on a Tesla is judged the same way as on any other car — size,
position, depth and age decide whether it's a resin repair or a replacement
(the [repair-or-replace guide](/blog/repair-or-replace-windshield-damage/)
walks through all four). Small, away from the edge, outside the driver's
sightline, outer layer only: that's a chip repair, and it's the same
half-hour job on a Model 3 as on a Corolla.

The caveat is what happens when it isn't repairable. On an EV the fallback
is a more expensive, more specific part and a camera that cares about the
glass it's mounted to. That's a good reason to have a Tesla rock chip
looked at early rather than waiting to see if it spreads.
```

### 4b. `src/content/blog/repair-or-replace-windshield-damage.md`

Change the frontmatter title from:

```
title: "Chip or crack: when a windshield can be repaired and when it can't"
```

to:

```
title: "Chip or crack: repair or replace?"
```

Do **not** rename either file. The URL slugs must stay the same.

---

## 5. Sitemap: drop the fake lastmod

`src/pages/sitemap.xml.ts`. Every URL currently gets today's date on every
build, which is meaningless to Google.

Delete this line:

```
const lastmod = new Date().toISOString().split("T")[0];
```

And change the URL template from:

```
`  <url>\n    <loc>${site.url}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
```

to:

```
`  <url>\n    <loc>${site.url}${path}</loc>\n  </url>`,
```

---

## 6. About page: remove the dead "See services" anchor

The hero's "See services" button links to `#services`, which does not exist on
the About page.

### 6a. `src/components/Hero.astro`

In the `interface Props` block, add after the `eyebrow?: string;` line:

```
  /** Hide the "See services" link on pages with no #services section. */
  showServicesLink?: boolean;
```

In the destructuring (`const { h1, lede, showBadges = true, ... } = Astro.props;`)
add `showServicesLink = true,` before the closing `}`.

Find:

```
<a class="btn btn-quiet" href="#services">See services</a>
```

Replace with:

```
{showServicesLink && (
  <a class="btn btn-quiet" href="#services">See services</a>
)}
```

### 6b. `src/pages/about.astro`

Find `showBadges={false}` on the `<Hero` element and add `showServicesLink={false}`
on the next line, same indentation.

---

## 7. Schema: emit Orange County as areaServed while cities are pending

The site copy already says "across Orange County", so the schema may say the
same. `src/lib/schema.ts`.

### 7a. In `localBusinessSchema()`, find:

```
if (!PENDING.cities) {
  schema.areaServed = cities.map((c) => ({
    "@type": "City",
    name: `${c.name}, CA`,
  }));
}
```

Replace with:

```
schema.areaServed = PENDING.cities
  ? { "@type": "AdministrativeArea", name: "Orange County, CA" }
  : cities.map((c) => ({ "@type": "City", name: `${c.name}, CA` }));
```

### 7b. In `serviceSchema()`, find:

```
if (!PENDING.cities) {
  schema.areaServed = cities.map((c) => ({ "@type": "City", name: `${c.name}, CA` }));
}
```

Replace with:

```
schema.areaServed = PENDING.cities
  ? { "@type": "AdministrativeArea", name: "Orange County, CA" }
  : cities.map((c) => ({ "@type": "City", name: `${c.name}, CA` }));
```

---

## 8. Housekeeping

- Delete the empty leftover directory `.git-rewrite/` at the repo root:
  `rm -rf .git-rewrite`
- Add a line `.git-rewrite/` to `.gitignore`.
- Delete this handoff file (`HANDOFF-fixes.md`) as the last step of the last
  commit, or leave it untracked — do not commit it.

---

## 9. README: fix stale statements

`README.md`. Three things are out of date.

### 9a. In the "Going live — order matters" section

Find the paragraph starting `So two guards are active, both keyed to **one explicit switch** — `LAUNCH_READY` in `site.ts`, currently `false`:` and change `currently `false`` to `currently `true``.

Then replace the paragraph that starts `It is a deliberate manual switch rather than something inferred` (through the end of that paragraph) with:

```
It is a deliberate manual switch rather than something inferred from the `PENDING`
flags. It was set to `true` on 2026-09-16 and the site is now crawlable. If it
ever needs to come back down (for example a broken deploy), set it to `false`
and push — every page goes noindex and `robots.txt` disallows everything.
```

Delete the paragraph that starts `Lighthouse SEO reads 66 while this is on`.

Replace the numbered "The sequence:" list and the paragraph after it with:

```
Remaining launch gaps, in priority order:

1. `PUBLIC_WEB3FORMS_KEY` is not set in the Vercel project. Every lead form on
   the live site ships `[WEB3FORMS_KEY_PENDING]` and cannot deliver. This is the
   client's Web3Forms account; they add the key under Vercel → Settings →
   Environment Variables, then redeploy.
2. Vercel currently has `www.autoglasscrew.com` as the primary domain and
   redirects the apex to it. Every canonical, `og:url`, the `robots.txt` sitemap
   line and every sitemap `<loc>` use the apex. In Vercel → Settings → Domains,
   make `autoglasscrew.com` primary so `www` redirects to the apex. Then in
   Search Console re-run "Test Live URL" on `/sitemap.xml`.
3. `npm run check:launch` must pass once item 1 is done.
```

### 9b. In the "Images" section

Find `The hero uses an original inline SVG illustration — no request on the LCP path, no licensing question. To swap in a photograph:` and replace with:

```
The hero currently uses `public/images/glass.jpeg` (35KB, licence/provenance
still to be confirmed with the client). An original inline SVG illustration is
the fallback. To change the photograph:
```

### 9c. In "Where the business facts live"

Find `the matching section either hides or shows an orange build note instead of inventing content` and replace with `the matching section hides instead of inventing content`.

---

## 10. New blog posts (three)

Create three new files in `src/content/blog/`. Each is a Markdown file with this
frontmatter shape (dates are real, use these exactly):

```
---
title: "<title, under 55 characters>"
description: "<one sentence, 120–155 characters, plain and specific>"
pubDate: 2026-09-18
---
```

Body: 700–1000 words. Plain, practical, second person. Short paragraphs, `##`
headings, at most one table. Link to existing pages where natural using relative
paths: `/windshield-chip-repair/`, `/windshield-replacement/`,
`/mobile-auto-glass/`, `/windshield-replacement-cost/`,
`/windshield-repair-or-replace/`,
`/blog/repair-or-replace-windshield-damage/`. End each post with one sentence
inviting the reader to text a photo of the damage — but do **not** type the phone
number; say "text us a photo" and link to `/contact/`.

Hard constraints on every post (these come from the client's compliance rules):

- No dollar amounts, no price ranges, no "typically costs".
- No claims about the business's history, volume, customers, staff count,
  certifications, insurance, or how quickly it responds.
- No "we calibrate" / "we do ADAS calibration". Mentioning that calibration
  exists and that the reader should ask whoever does the work is fine.
- No insurance-company names. Speak about "your insurer" and "your policy".
- Do not name any competitor except a neutral, non-disparaging Safelite mention
  if it fits naturally (optional).
- Do not state specific California law or regulation text. You may say "check
  your state's rules" style guidance.

### Post A — `windshield-insurance-claim.md`

Title idea: "Windshield damage and insurance: how a claim actually works"

Cover: comprehensive vs collision (glass is normally under comprehensive);
deductible logic and why some policies treat a chip repair differently from a
replacement (say "some insurers", never a specific one); the three things to
have ready before calling the insurer (vehicle year/make/model/trim, a photo,
where and when it happened); the right to choose your own shop in general terms
(say "in most cases you can choose", do not cite law); why filing a small chip
repair may or may not be worth it versus paying directly (no numbers — frame it
as "compare the repair cost against your deductible"); what to ask the glass
company so the paperwork is clean.

### Post B — `windshield-damage-orange-county-heat.md`

Title idea: "Why chips spread in Orange County heat (and what to do first)"

Cover: thermal stress on glass — hot windshield, cold A/C blast, cold night
after hot day; Santa Ana wind season and road debris; freeway gravel from
construction; why parking in shade and easing A/C on helps a chip survive until
repair; the "don't" list (no hot water, no DIY superglue, no pressure washing
the chip); when it has already run into a crack and repair is off the table;
link to the repair-or-replace tool.

### Post C — `mobile-vs-shop-windshield.md`

Title idea: "Mobile windshield service vs. going to a shop"

Cover: what mobile service actually needs (dry, roughly a car width of space,
temperature range for resin/urethane); when a shop is genuinely the better
choice (heavy rain, some calibration setups, badly damaged pinch weld —
describe neutrally); the cure/drive-away time question is the same either way;
what happens with a camera-equipped windshield (the calibration step exists;
ask whoever does the job how it's handled — do not say what this business
does); fleet angle: multiple vehicles in one yard visit; how to prepare the
parking spot.

After writing, read each post back once and delete any sentence that implies a
track record, a price, or a certification.

---

## 10b. Keyword gaps — add missing target phrases (real search data, act on this exactly)

This is real Mangools/Semrush keyword research for this business, Orange
County-localized. Two confirmed target phrases are not on the site anywhere.
Add them as natural sentences — never stuff a bare phrase into a sentence that
doesn't already make sense, and never add a phrase to a `<h1>` or `<title>` that
isn't in this list (title tags are locked to what `site.ts` already has, do not
touch those).

| Phrase | Vol | KD | Where to add it |
|---|---|---|---|
| `windshield replacement near me` | 370 | 21 | `src/pages/windshield-chip-repair.astro` — this page already targets the sibling phrase `windshield repair near me` and `windshield replacement near me` in one paragraph near the bottom ("Windshield repair anywhere in Orange County" section). Confirm both phrases appear in that paragraph as natural sentences; if `windshield replacement near me` is missing, add one sentence using it verbatim. |
| `tesla rock chip repair` | (ranking proof only, no volume data) | — | `src/content/blog/tesla-ev-windshield-glass.md` — the new section you add in Task 4a already uses "Tesla windshield chip repair" in its heading. Add one additional sentence in that same section using the exact phrase `tesla rock chip repair` naturally, e.g. describing a small stone strike. |

After adding both, re-run this and confirm both print at least one match:

```bash
grep -ril -i "windshield replacement near me" src/pages
grep -ril -i "tesla rock chip repair" src/content
```

Do not touch anything else keyword-related — `windshield repair irvine` and
`windshield replacement irvine` are already exact-match in the `<title>` tags
in `src/lib/site.ts` (lines ~164 and ~174) and must stay exactly as written.

---

## 11. Verification (run all, in this order, before the final commit)

```bash
npm run check:nap
```
Must print "NAP is governed".

```bash
npm run build
```
Must complete with "Complete!". The `[lead form] No PUBLIC_WEB3FORMS_KEY set`
warnings are expected and fine locally.

```bash
npm run check:placeholders
```
Expected result: exactly **one** unresolved item, `[WEB3FORMS_KEY_PENDING]`.
That one is waiting on the client and is not yours to fix. If anything else
appears, fix it before committing.

Then run these greps. Each must print nothing:

```bash
grep -rn -i -E "within the hour|call us back|our jobs happen|hundreds of|years of experience" src
```

```bash
grep -rn -E "\\$[0-9]" src/content/blog
```

```bash
grep -rn -i -E "we calibrate|our calibration|we do adas" src
```

Confirm the sitemap has no `lastmod` and lists the three new posts:

```bash
grep -c lastmod dist/sitemap.xml; grep -o '<loc>[^<]*' dist/sitemap.xml
```

Expected: `0` then 14 URLs (the previous 11 plus the three new posts).

Confirm the About page no longer links to `#services`:

```bash
grep -c 'href="#services"' dist/about/index.html
```

Expected: `0`.

Confirm the homepage title changed:

```bash
grep -o '<title>[^<]*' dist/index.html
```

Expected: `<title>Auto Glass Repair in Orange County | Auto Glass Crew`.

---

## 12. Finish

Run `git status` and `git log --oneline -8`. Report back with: the list of
commits made, the output of `npm run check:placeholders`, the three new post
titles, and confirmation both Task 10b greps found a match. Do not push.

---

## For the human, not the model — client-side actions still open

These cannot be done from the repo:

1. **Vercel env var:** add `PUBLIC_WEB3FORMS_KEY` (from the client's Web3Forms
   account) in Vercel → Project → Settings → Environment Variables, then
   redeploy. Then submit a test lead on `/contact/` and confirm the email
   arrives.
2. **Vercel primary domain:** Settings → Domains → set `autoglasscrew.com` as
   primary, `www` redirects to it. Then GSC → URL Inspection → Test Live URL on
   `https://autoglasscrew.com/sitemap.xml`.
3. **Hero photo:** confirm where `public/images/glass.jpeg` came from and that
   the client owns or licensed it.
4. **Phone:** confirm who answers (949) 681-9416 and that SMS works, with a
   real test text.
5. **City list, ADAS yes/no, owner bio + photo, real job photos, hours, GBP and
   Yelp URLs:** all still pending from the client; the site hides those sections
   until `PENDING` flags flip in `src/lib/site.ts`.
