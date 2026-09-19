# Handoff: ranking-focused expansion of autoglasscrew.com (OC + LA)

Paste this whole file as the first message to the model working in
`/Users/b/Desktop/auto-glass`. It merges the employer's task spec with (a) the
actual state of the repo as audited on 2026-09-18, (b) the keyword research the
site is built on, and (c) verified legal sources for the blog posts. Where the
original spec and the repo disagree, this file wins — the spec was written
without looking at the code.

---

## 0. Ground rules

1. **There is no `CLAUDE.md`.** The rules live in `README.md` and the header
   comments of `src/lib/site.ts`. Read both before touching anything.
2. **`src/lib/site.ts` is the single source of business facts.** Never type the
   phone number, an email, or a street address anywhere else. `npm run check:nap`
   fails the build if you do. It also fails on the pattern `CA 92xxx` / `CA, 92xxx`
   anywhere in `src/`, so in city data store ZIPs as bare strings (`"92618"`) and
   never write "CA" directly before a ZIP in prose.
3. **Never invent:** license numbers, certifications, insurance, years in
   business, customer counts, technician counts, response times, prices or price
   ranges, reviews, addresses, hours. Unknown → omit or placeholder + flag.
4. **Never claim the business performs ADAS calibration.** Explaining that
   calibration exists, what triggers it, and that the customer should ask
   whoever does the job is fine. "We calibrate" is not.
5. **Geography must be real.** Batch 1 city data is supplied below, already
   checked. Do not add freeways, ZIPs, neighborhoods or landmarks beyond what is
   given unless you are certain. Omit rather than guess.
6. **Branch:** `git checkout -b feat/ranking-expansion` from `main`. Small
   commits, one per numbered section or smaller. **Push only that branch**
   (`git push -u origin feat/ranking-expansion`) so Vercel builds a preview.
   Never push `main`, never merge.
7. **Commit trailer** on every commit, after a blank line:

   ```
   Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
   ```

8. `trailingSlash: "always"` is set. Every internal `href` ends with `/`.
9. Astro 5, static output, no framework islands. Keep it that way.
10. `npm run check:placeholders` will report exactly one item,
    `[WEB3FORMS_KEY_PENDING]`. That is a client-side Vercel env var, not yours.
    Anything else it reports is yours.

---

## 0a. What is ALREADY DONE — do not redo (verify with the grep, then move on)

The previous fix pass is merged to `main` (commits `b4f7e83` through `939e39b`).
Verify each with the command; if it passes, skip.

| Spec item | Repo state | Verify |
|---|---|---|
| Sitemap at build | Hand-rolled at `src/pages/sitemap.xml.ts`, served at `/sitemap.xml`. **Do NOT install `@astrojs/sitemap`** — it would emit a second `/sitemap-index.xml` and duplicate URLs. Extend the existing file instead (section 2). | `grep -o '<loc>[^<]*' dist/sitemap.xml` after build |
| `site` in astro.config | `SITE_URL = "https://autoglasscrew.com"` in `astro.config.mjs`; `site.url` in `site.ts` matches. | `grep SITE_URL astro.config.mjs` |
| robots.txt sitemap line | `src/pages/robots.txt.ts` emits `Sitemap: https://autoglasscrew.com/sitemap.xml`. Correct. | `curl -s https://www.autoglasscrew.com/robots.txt` |
| Self-referencing canonical | `src/layouts/BaseLayout.astro` emits `<link rel="canonical" href={site.url + path}>` on every page. Pass `path` correctly on every new page and it is done. | `grep canonical dist/*/index.html` |
| Mobile page title/H1 | Already `Mobile Windshield Repair in Orange County` in both. All five long-tail phrases already in copy/FAQ. | `grep -il "same day windshield repair\|mobile rock chip repair\|emergency windshield repair\|mobile windshield chip repair\|mobile auto glass repair" src/pages/mobile-auto-glass.astro` |
| FAQ from one array + FAQPage JSON-LD | All service pages use `const faqs = [...]` → rendered by `<FAQ faqs={faqs}>` and `faqSchema(faqs)`. Counts: chip 7, mobile 6, replacement 5, cost 6. | `grep -c '    q: ' src/pages/*.astro` |
| Blog collection | Exists: `src/content.config.ts`, posts in `src/content/blog/`. Five posts live. | `ls src/content/blog` |
| Repair-or-replace calculator | Exists at `/windshield-repair-or-replace/` (`src/pages/windshield-repair-or-replace.astro`), vanilla JS, no prices. **Extend it (section 5); do not build a second one.** | open the file |
| Breadcrumb schema helper | `breadcrumbSchema()` in `src/lib/schema.ts`. Use it. | — |
| Safelite mention, compliance copy, sitemap lastmod, About anchor, areaServed=Orange County | All done. | — |

### GSC "Couldn't fetch" — root cause, already diagnosed

Two causes. One is fixed, one is outside the repo:

1. `robots.txt` used to `Disallow: /`. Fixed in commit `75065e3`. Live robots is
   `Allow: /`.
2. **Host mismatch.** Vercel serves `www.autoglasscrew.com` as primary and 308s the
   apex to it. Every canonical, `og:url`, the robots `Sitemap:` line and every
   sitemap `<loc>` use the apex. Google fetches the apex sitemap, gets a 308 to
   www, and the www pages canonical back to apex.

   **Do not change `site.url` or `SITE_URL` to www.** The fix is in Vercel →
   Project → Settings → Domains: make `autoglasscrew.com` primary so `www`
   redirects to apex. That is the employer's account. Put it in your final
   report under "needs the account owner", verbatim, and move on.

---

## 0b. Audit report (section 0 of the spec) — produce this first, before any edit

Run and paste the output into your first report:

```bash
npm run build 2>&1 | tail -3
for f in dist/index.html dist/*/index.html dist/blog/*/index.html; do
  echo "== $f"
  grep -o '<title>[^<]*' "$f" | sed 's/<title>//'
  grep -o '<h1[^>]*>[^<]*' "$f" | sed 's/<h1[^>]*>//'
  grep -o 'name="description" content="[^"]*"' "$f" | cut -c27-140
  grep -o '"@type":"[A-Za-z]*"' "$f" | sort -u | tr '\n' ' '; echo
done
grep -o '<loc>[^<]*' dist/sitemap.xml
```

Then state in one line each: sitemap present (yes, hand-rolled), robots
correct (yes), canonical host (apex in code, www at Vercel — see 0a), every page
self-canonical (yes). Then start section 1.

---

## 1. Service page fixes

Only one real change here.

**`src/pages/windshield-chip-repair.astro`** — add to the `faqs` array, after the
entry `"Will the chip disappear completely?"`:

```ts
{
  q: "Does a chip repair affect the camera behind my mirror?",
  a: "No. A resin repair fills the break in the outer layer of glass and leaves the windshield, its mounting and the camera bracket exactly where they were, so it does not trigger an ADAS recalibration. A full replacement is different: the camera is re-mounted to new glass, and on camera-equipped vehicles the manufacturer typically specifies a recalibration afterwards. That's one more reason to repair a chip while it's still a chip.",
},
```

That keeps the page at 8 FAQs (spec max). Nothing else on service pages needs
changing — verify the table in 0a and move on.

### Keyword targets already assigned per page (for reference — do not re-title)

| Page | Primary phrase (Vol / KD, Orange County) | Also on page |
|---|---|---|
| `/windshield-chip-repair/` | `windshield repair irvine` (70 / 26) | `windshield repair` (1900 / 19), `windshield repair near me` (550 / 16), `windshield replacement near me` (370 / 21) |
| `/windshield-replacement/` | `windshield replacement irvine` (30 / 25) | `...irvine ca` variant |
| `/mobile-auto-glass/` | `mobile windshield repair` (140 / 25) | `mobile auto glass repair` (70 / 20), same-day / emergency / rock-chip long tail |
| `/windshield-replacement-cost/` | `windshield replacement cost` (320 / 12) | — |
| `/` | `auto glass repair orange county` | fleet-first positioning |

---

## 2. City pages — data-driven, one template

### 2a. Data file `src/data/cities.ts`

Create it with this shape. **Batch 1 data below is verified — use it as given.**
Batch 2 and 3 entries get `published: false` and only `name`, `slug`, `county`;
leave the rich fields as empty arrays / empty strings. Do not fill them in — they
are not going live in this pass and unverified geography is worse than none.

```ts
export type City = {
  name: string;
  slug: string;
  county: "orange" | "los-angeles";
  published: boolean;
  zips: string[];
  freeways: string[];
  neighborhoods: string[];
  landmarks: string[];
  /** Slugs of 3–4 nearby cities. Only published ones render. */
  neighbors: string[];
  /** 2–3 sentences unique to this city. Written by you — see 2c. */
  intro: string;
  /** 2–3 city-specific Q&As. Written by you — see 2c. */
  faq: { q: string; a: string }[];
};

/** URL for a city page. One place, so every link agrees. */
export const cityPath = (slug: string) => `/windshield-repair-${slug}-ca/`;

export const cities: City[] = [
  {
    name: "Irvine", slug: "irvine", county: "orange", published: true,
    zips: ["92602", "92603", "92604", "92606", "92612", "92614", "92617", "92618", "92620"],
    freeways: ["I-5", "I-405", "SR-133", "SR-241", "SR-261", "SR-73"],
    neighborhoods: ["Woodbridge", "Northwood", "Turtle Rock", "University Park", "Westpark", "Portola Springs", "Quail Hill", "Great Park Neighborhoods", "Irvine Business Complex"],
    landmarks: ["Irvine Spectrum Center", "UC Irvine", "Orange County Great Park", "Irvine Business Complex"],
    neighbors: ["costa-mesa", "santa-ana", "anaheim", "huntington-beach"],
    intro: "", faq: [],
  },
  {
    name: "Santa Ana", slug: "santa-ana", county: "orange", published: true,
    zips: ["92701", "92703", "92704", "92705", "92706", "92707"],
    freeways: ["I-5", "SR-55", "SR-22", "I-405"],
    neighborhoods: ["Downtown Santa Ana", "Floral Park", "French Park", "Delhi", "Willard", "South Coast Metro"],
    landmarks: ["Bowers Museum", "Santa Ana Zoo", "MainPlace Mall", "Orange County Civic Center", "Discovery Cube Orange County"],
    neighbors: ["irvine", "costa-mesa", "anaheim", "huntington-beach"],
    intro: "", faq: [],
  },
  {
    name: "Anaheim", slug: "anaheim", county: "orange", published: true,
    zips: ["92801", "92802", "92804", "92805", "92806", "92807", "92808"],
    freeways: ["I-5", "SR-91", "SR-57", "SR-55"],
    neighborhoods: ["Anaheim Hills", "Downtown Anaheim", "Anaheim Colony Historic District", "Platinum Triangle", "West Anaheim", "Anaheim Resort"],
    landmarks: ["Disneyland Resort", "Angel Stadium", "Honda Center", "Anaheim Convention Center", "Anaheim Packing District"],
    neighbors: ["santa-ana", "irvine", "costa-mesa", "huntington-beach"],
    intro: "", faq: [],
  },
  {
    name: "Huntington Beach", slug: "huntington-beach", county: "orange", published: true,
    zips: ["92646", "92647", "92648", "92649"],
    freeways: ["I-405", "SR-39", "SR-1"],
    neighborhoods: ["Downtown Huntington Beach", "Huntington Harbour", "Sunset Beach", "Seacliff", "Goldenwest", "Oak View"],
    landmarks: ["Huntington Beach Pier", "Bolsa Chica Ecological Reserve", "Huntington Central Park", "Bella Terra"],
    neighbors: ["costa-mesa", "santa-ana", "irvine", "anaheim"],
    intro: "", faq: [],
  },
  {
    name: "Costa Mesa", slug: "costa-mesa", county: "orange", published: true,
    zips: ["92626", "92627"],
    freeways: ["I-405", "SR-55", "SR-73"],
    neighborhoods: ["Eastside Costa Mesa", "Westside Costa Mesa", "Mesa Verde", "South Coast Metro", "College Park", "Halecrest"],
    landmarks: ["South Coast Plaza", "Segerstrom Center for the Arts", "OC Fair & Event Center", "Orange Coast College", "Triangle Square"],
    neighbors: ["irvine", "huntington-beach", "santa-ana", "anaheim"],
    intro: "", faq: [],
  },
  // Batch 2 — unpublished. Name/slug/county only.
  ...["Cerritos", "Lakewood", "Long Beach", "La Mirada", "Norwalk", "Whittier", "Downey"].map(stub),
  // Batch 3 — unpublished. Name/slug/county only.
  ...["Torrance", "Carson", "Pasadena", "West Covina", "Pomona"].map(stub),
];

function stub(name: string): City {
  return {
    name, slug: name.toLowerCase().replace(/\s+/g, "-"), county: "los-angeles",
    published: false, zips: [], freeways: [], neighborhoods: [], landmarks: [],
    neighbors: [], intro: "", faq: [],
  };
}

export const publishedCities = cities.filter((c) => c.published);
export const citiesInCounty = (county: City["county"]) =>
  publishedCities.filter((c) => c.county === county);
```

(Write `stub` above the array or hoist it — just make it compile.)

Note: "SR-1" is Pacific Coast Highway, "SR-39" is Beach Boulevard. You may use
those names in prose.

### 2b. Wire it into `src/lib/site.ts`

The old `cities` array in `site.ts` is referenced by `Footer.astro`,
`ServiceArea.astro`, `sitemap.xml.ts` and `schema.ts`, all building links as
`/${c.slug}/`. Replace it:

```ts
import { publishedCities, cityPath } from "../data/cities";
export const cities = publishedCities.map((c) => ({ name: c.name, slug: c.slug, href: cityPath(c.slug) }));
```

Then in `Footer.astro`, `ServiceArea.astro` and `sitemap.xml.ts` change
`` `/${c.slug}/` `` to `c.href`. Set `PENDING.cities = false` in `site.ts` —
the employer has now supplied the list, which is what that flag was waiting for.
Delete the "NOT CONFIRMED" comment block above the old array.

### 2c. Template `src/pages/windshield-repair-[slug]-ca.astro`

`getStaticPaths` over `publishedCities` only. Structure, top to bottom:

1. `<BaseLayout>` with
   `title={`Windshield Repair ${city.name}, CA | Mobile Auto Glass Replacement`}`
   (this exact format), a unique description, `path={cityPath(city.slug)}`,
   and `schemas` = `[serviceSchema(...), faqSchema(city.faq), breadcrumbSchema([...])]`.
   For `serviceSchema` on city pages, `areaServed` must be that city only. Add an
   optional fourth argument to `serviceSchema()` in `schema.ts`:
   `areaServed?: Record<string, unknown>` — when passed, use it instead of the
   default.
2. Breadcrumb: Home → Orange County (`/orange-county/`) → City.
3. `<Hero>` with `h1={`Windshield Repair & Replacement in ${city.name}, CA`}`,
   `eyebrow={`Mobile auto glass · ${city.name}`}`, `showServicesLink={false}`,
   and a lede that uses the city name once.
4. `city.intro` paragraph(s).
5. "Where we work in {City}" — a paragraph built from `neighborhoods` and
   `landmarks`, a sentence built from `freeways`, and a ZIP line built from
   `zips`. Written as sentences, not a data dump. Example shape (vary per city):
   "Mobile service runs across {n1}, {n2} and {n3}, and to the lots around {l1}
   and {l2}. If you're near the {f1} or {f2}, we come to where the vehicle is
   parked." Then: "ZIP codes covered include {zips joined}." Never write "CA"
   immediately before a ZIP.
6. Three short service blocks (chip repair / replacement / mobile) each linking
   to its service page. Shared copy is fine here — this is the 60% non-unique
   portion.
7. `<FAQ faqs={city.faq}>`.
8. "Nearby" — links to the city's published `neighbors` via `cityPath`, plus a
   link to the county hub.
9. `<LeadForm source={`City page — ${city.name}`}>` and `<CTABand>`.

**Unique-content rule (30–40% of body):** `intro` (2–3 sentences) + the
geography paragraph + 2–3 city FAQs. Write `intro` and `faq` for each of the
five cities yourself, into the data file. They must differ in substance, not
just the city name swapped. Angles that are genuinely different per city:

- Irvine: office parks and the Irvine Business Complex; company fleets parked in
  structures; UCI area; long freeway commutes on the 5/405 picking up gravel.
- Santa Ana: dense residential streets and driveway service; civic center and
  downtown parking; work vans and contractor trucks.
- Anaheim: resort-area hotel and rideshare vehicles; Anaheim Hills canyon roads
  and the 91 debris; stadium/arena event parking.
- Huntington Beach: salt air and coastal parking; PCH and Beach Blvd traffic;
  Harbour side.
- Costa Mesa: South Coast Plaza / Metro office lots; the 55/405 interchange;
  Westside industrial.

FAQ ideas per city (2–3 each): "Do you cover {neighborhood}?", "Can you work in a
parking structure at {landmark}?", "Is {City} same-day?" — answer the last one
honestly: "often, depending on the day's route; call and ask", never a promise.

**Keyword guidance for city pages** (from a competitor keyword export — an
Anaheim-based independent ranks #1–2 on every "anaheim" variant and only #7–13 on
Santa Ana terms, so city relevance is real and page-specific): use these phrase
shapes naturally in each page, once or twice each, never stacked:
`windshield repair {city}`, `windshield replacement {city}`, `{city} auto glass`,
`auto glass {city}`, `mobile windshield repair {city}`. On the Anaheim page only,
one neutral sentence may mention Safelite (people search "safelite anaheim"):
e.g. "If you've been quoted a multi-day wait by Safelite or another chain, a
local mobile tech is usually the faster route." No other competitor names.

No claims about response times, pricing, technician counts, years in business.

### 2d. If a city can't be made distinct

If you genuinely cannot write different `intro` + FAQ content for one of the
five, set `published: false` on it and say which and why in the report. Do not
ship a swap-the-name page.

---

## 3. County hubs

`src/data/counties.ts`:

```ts
export const counties = [
  { name: "Orange County", slug: "orange-county", key: "orange" as const, published: true },
  { name: "Los Angeles County", slug: "los-angeles-county", key: "los-angeles" as const, published: false },
];
export const publishedCounties = counties.filter((c) => c.published);
```

Route `src/pages/[county].astro` with `getStaticPaths` over `publishedCounties`
(LA hub therefore does not build yet). Content: H1 `Auto Glass Repair in
{County}`, title `Windshield Repair & Replacement in {County} | Mobile`, a short
intro, a card per published city in that county with a **unique 1–2 sentence
blurb** (write it — pull one distinct detail from that city's data), linking via
`cityPath`. Breadcrumb Home → County. Schema: `serviceSchema` with `areaServed`
= `{ "@type": "AdministrativeArea", name: "{County}, CA" }` + breadcrumb.

OC hub keyword shapes (a competitor ranks #2–5 on these with tiny authority):
`orange county auto glass`, `windshield replacement orange county`,
`windshield repair orange county`, `oc auto glass`. Use each once, naturally.

**LA county:** no keyword research exists for LA cities or the LA hub. Do not
invent volumes. Nothing LA-related renders until batch 2 is published.

Homepage `ServiceArea.astro` and `Footer.astro`: list published cities (already
wired via `site.cities`) and add a link to each published county hub. Add
`{ label: "Service Areas", href: "/orange-county/" }` to `nav` in `site.ts`
after "Cost".

Add published hubs to `sitemap.xml.ts`.

---

## 4. Blog

### 4a. Extend the collection schema

`src/content.config.ts` — add these **optional** fields so the five existing posts
keep building:

```ts
targetQuery: z.string().optional(),
relatedService: z.string().optional(),
relatedCities: z.array(z.string()).default([]),
```

`src/pages/blog/[...slug].astro` already emits Article + BreadcrumbList. Add a
"Related" block at the end of the article that links `relatedService` and each
`relatedCities` slug via `cityPath`, so every post gets the required links even
if the author forgets in-body links. Still put the links in the body too.

### 4b. Existing posts — update, don't duplicate

Three of the six requested posts already exist. Add the new frontmatter fields,
add the in-body links (one service page, two city pages), and extend content
where the spec asks for more than is there:

| Spec post | Existing file | Do |
|---|---|---|
| #2 Insurance | `windshield-insurance-claim.md` | Add the two verified legal points from 4c (no zero-deductible law in CA; Insurance Code §758.5 right to choose shop) with the leginfo link. Keep "no promises about what any insurer pays". |
| #3 Repair or replace | `repair-or-replace-windshield-damage.md` | Already matches. Add frontmatter fields + links only. |
| #6 SoCal heat | `windshield-damage-orange-county-heat.md` | Already matches. Add frontmatter fields + links only. |

### 4c. New posts (three) — verified facts you may state, nothing more

Frontmatter: `title` (≤55 chars), `description` (120–155 chars), `pubDate:
2026-09-18`, `targetQuery`, `relatedService`, `relatedCities` (two batch-1 slugs).
800–1,200 words. Factual, plain, no fluff, no prices, no business track-record
claims. Cite primary sources with outbound `<a rel="noopener">` links.

**Post 1 — `cracked-windshield-illegal-california.md`**
targetQuery: `is it illegal to drive with a cracked windshield in california`
Verified (leginfo, Vehicle Code §26710, fetched 2026-09-18):
- The standard is a windshield or rear window "in such a defective condition as
  to impair the driver's vision either to the front or rear."
- An officer may direct the driver to make the glass conform "within 48 hours."
- There is no inch-measurement in §26710 — do not invent one. Say the statute is
  about impaired vision, not crack length.
Link: `https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=VEH&sectionNum=26710`
Do not cite any other Vehicle Code section unless you fetch and verify it.
relatedService: `/windshield-replacement/`

**Post 2 — update to existing insurance post (see 4b)**
Verified (leginfo, Insurance Code §758.5, fetched 2026-09-18):
- "No insurer shall require that an automobile be repaired at a specific
  automotive repair dealer." It governs automobile repair generally, not glass
  specifically — say "auto repair claims, which includes glass work" carefully,
  or just quote the sentence and say it applies to your car.
- California has no law requiring a zero-deductible glass benefit (unlike a few
  other states). Comprehensive coverage is optional. Some insurers waive the
  deductible for a chip repair — say "some", never name one, never promise.
Link: `https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=INS&sectionNum=758.5`

**Post 4 — `adas-recalibration-after-windshield-replacement.md`**
targetQuery: `adas calibration after windshield replacement`
Educational only. Content: what ADAS cameras behind the mirror do; why replacing
the glass moves the camera's reference; static vs dynamic calibration (static =
targets in a controlled space; dynamic = a drive at speed on marked roads; some
vehicles need both); resin chip repair does not trigger it, replacement on
camera-equipped vehicles typically does; what to ask whoever does the job
("is calibration included, is it documented, is it done to the manufacturer's
procedure"). **Do not say this business performs calibration.** No search
volume exists for ADAS terms in this market — this post is for completeness and
for the reader already deciding, not a traffic play. Say nothing about cost.
relatedService: `/windshield-replacement/`

**Post 5 — `sb-988-california-motor-vehicle-glass-act.md`**
**Status correction — the employer's spec is out of date.** As of 2026-09-18 the
bill is **Enrolled (Aug 28, 2026)** — it passed the Assembly Aug 24 and the
Senate Aug 26 and is with the Governor. It is NOT on the suspense file. Before
writing, fetch
`https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202520260SB988`
and read the latest action. Write the status exactly as shown that day:
- if "Enrolled": "passed both houses, awaiting the Governor's signature or veto"
- if "Chaptered": "signed into law on {date}"
- if "Vetoed": "vetoed on {date}"
Add `updatedDate` = the day you write it, and a visible "Last updated {date}"
line under the title. Frame every provision as "would require" unless chaptered.

Verified provisions (Enrolled text, fetched 2026-09-18) — adds Civil Code
§§1784.50–1784.58, "California Motor Vehicle Glass Act"; certain contract
prohibitions operative January 1, 2027:
- Shops must tell the customer whether the vehicle has ADAS, disclose whether
  calibration is needed per manufacturer spec after the repair, and give written
  notice of calibration success or failure.
- Itemized invoice/receipt on completion; good-faith estimate before service and
  an updated estimate before work begins.
- For insurance-paid work, obtain a claim/referral number before contracting.
- Fees limited to "reasonable and customary".
- Prohibited: rebates/gifts/cash for steering claims; false or incomplete
  documentation; claiming insurer approval without written verification; calling
  a repair "free" unless coverage is verified; damaging a vehicle to enlarge the
  job; falsifying work orders or damage dates.
- Insureds cannot assign policy benefits to a shop (such contracts void);
  customers keep the right to choose their shop; insurers may recommend but not
  coerce.
- Civil penalties up to $500 first violation, up to $2,000 subsequent — this is
  the one place a dollar figure is allowed, because it is statute, not pricing.
Link the bill page above. Do not add provisions beyond this list.
relatedService: `/windshield-replacement/`

If any fetch fails or contradicts the above, leave that detail out and flag it.

---

## 5. Calculator — extend the existing tool

`src/pages/windshield-repair-or-replace.astro` already has: size (quarter /
dollar bill / longer), location (clear / sightline / edge), depth (fingernail
test), age. Add two fieldsets and extend `assess()`:

- **5. How many chips?** `one` / `two-three` / `more` — three or more separate
  breaks pushes toward "worth a look" (`unsure`), not automatic replace.
- **6. Camera behind the mirror?** `yes` / `no` / `unsure` — does **not** change
  the verdict. It adds one explanatory line to the result: if `yes`, "If this
  ends up as a replacement, a camera-equipped vehicle typically needs a
  recalibration afterwards — ask about it when you book." If `unsure`, "Look for
  a sensor housing behind the mirror; if it's there, ask about recalibration if
  this becomes a replacement."

Crack length is already covered by the size question — do not add a duplicate.
Keep the CTA to `/contact/` and the "not an inspection or a quote" caveat. No
prices. Vanilla JS as it is now; no new dependencies; the script is already
inline, so LCP/INP are unaffected.

---

## 6. Internal linking + nav

- Service pages: add a short "Cities we cover" line before `<CTABand>` on the
  three service pages listing published cities via `cityPath` (map over
  `site.cities`). One component `CityLinks.astro`, used three times.
- City pages: link all three service pages (section 2c step 6), neighbors, and
  the county hub.
- Blog index is already in nav ("Guides") and footer. Leave it.
- Breadcrumbs: city, hub and blog pages all use `breadcrumbSchema`. Also render a
  visible breadcrumb `<nav aria-label="Breadcrumb">` on city and hub pages
  (small `Breadcrumbs.astro` component, plain `<ol>`).

---

## 7. Performance guardrails

- No new client JS on city, hub or blog pages. `BaseLayout` already ships one
  small inline script for the announcement bar; that counts as "already ships".
- No images on city/hub pages in this pass. If you add any anywhere, use
  `astro:assets` (`src/assets/` + `<Image>`), explicit `width`/`height`,
  `loading="lazy"` below the fold. Nothing new in `public/images/`.
- After build, run Lighthouse mobile on one city page and the OC hub:

  ```bash
  npx --yes lighthouse@12 http://localhost:4321/windshield-repair-irvine-ca/ --preset=perf --form-factor=mobile --screenEmulation.mobile --only-categories=performance,seo,accessibility,best-practices --output=json --output-path=/tmp/lh-city.json --chrome-flags="--headless=new" --quiet
  ```

  (start `npm run preview` first). All four categories must be ≥90; report the
  numbers.

---

## 8. Verification + deliverables

Run, in order:

```bash
npm run check:nap
npm run build
npm run check:placeholders      # exactly one item: [WEB3FORMS_KEY_PENDING]
grep -o '<loc>[^<]*' dist/sitemap.xml
ls dist | grep -E 'windshield-repair-.*-ca|orange-county|los-angeles-county'
grep -rn -i -E "we calibrate|our calibration|we do adas|within the hour|years of experience|hundreds of" src ; echo "(must be empty)"
grep -rn -E "CA[, ]+[0-9]{5}" src ; echo "(must be empty)"
```

Sitemap must contain: the 11 previous URLs + 5 city pages + `/orange-county/` +
3 new blog posts = 20. No LA URLs, no unpublished cities.

Final report to the human, in this order:

1. The audit output from 0b.
2. New routes and their `<title>`s.
3. Anything left out or flagged (unverifiable facts, a city you unpublished, a
   fetch that failed, SB 988 status as found on the day).
4. Lighthouse numbers for one city page and the hub.
5. Confirmation `astro build` passes and the sitemap URL list.
6. Under "needs the account owner": the Vercel primary-domain switch (0a) and
   the `PUBLIC_WEB3FORMS_KEY` env var.
7. The branch name and `git log --oneline main..feat/ranking-expansion`.

Do not push `main`. Do not merge. Do not commit this file.
