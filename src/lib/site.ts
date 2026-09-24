import { publishedCities, cityPath } from "../data/cities";

/**
 * Single source of truth for all business facts.
 *
 * Anything bracketed like [THIS] is unconfirmed and must come from the client
 * in writing before launch. `npm run check:placeholders` lists what is still open.
 *
 * Never hardcode NAP, phone, hours or service area in a component. Import here.
 */

/**
 * The single switch that makes the site indexable.
 *
 * Deliberately explicit rather than inferred from the flags below. Real copy is
 * necessary but not sufficient: build notes are still rendered on the page, and
 * nobody has reviewed the result yet. Flip this only when `npm run check:launch`
 * passes and the client has actually seen the site.
 *
 * While false: every page carries noindex, and robots.txt disallows everything.
 */
export const LAUNCH_READY = true;

export const PENDING = {
  /**
   * "Auto Glass Crew" is a working display name, not a finalised legal name.
   * The trading name is real enough to render; the legal entity still is not.
   */
  identity: false,
  /** Real business line. Also accepts SMS. No call-tracking number. */
  phone: false,
  /** Physical address — needed for LocalBusiness schema + Google Business Profile. */
  address: true,
  /** Client has not supplied hours. */
  hours: true,
  /** Batch-1 city list confirmed 2026-09-18 — see `cities` below. */
  cities: false,
  /** No Google Business Profile reviews pulled yet. */
  reviews: true,
  /** Owner name/photo/bio not supplied. */
  owner: true,
  /** Web3Forms access key comes from the client's Web3Forms account. */
  web3forms: !import.meta.env.PUBLIC_WEB3FORMS_KEY,
} as const;

export const site = {
  /**
   * Working display name, not a finalised legal name. Reads as a business
   * rather than a URL — "AutoGlassCrew.com" in body copy looks like a domain
   * string, not someone you'd call.
   */
  name: "Auto Glass Crew",
  legalName: "[LEGAL_BUSINESS_NAME]",
  // Feeds the business-level schema description and the footer tagline — keep
  // this in step with publishedCounties in src/data/counties.ts. It said
  // "Orange County" only for weeks after LA County actually published,
  // disagreeing with its own areaServed (see defaultAreaServed in schema.ts).
  tagline:
    "Mobile auto glass repair and windshield replacement in Orange County and LA County",
  /** Must match SITE_URL in astro.config.mjs. */
  url: "https://www.autoglasscrew.com",

  phone: {
    display: "(949) 681-9416",
    /** tel: href form, digits only with country code. */
    href: "tel:+19496819416",
    /** Same line takes SMS — people send photos of the damage to it. */
    sms: "sms:+19496819416",
    acceptsText: true,
  },

  email: "[EMAIL_PENDING]",

  address: {
    street: "[STREET_PENDING]",
    city: "[CITY_PENDING]",
    state: "CA",
    zip: "[ZIP_PENDING]",
    country: "US",
  },

  /**
   * Mobile-first operation: techs travel to the customer. If the client runs a
   * shop customers can walk into, flip this and the address becomes public-facing.
   */
  hasWalkInShop: false,

  hours: [
    {
      days: "[DAYS_PENDING]",
      open: "[OPEN_PENDING]",
      close: "[CLOSE_PENDING]",
    },
  ],

  /**
   * Credentials. Never populate these from assumption.
   *
   * On the license specifically: do not assume one exists to be displayed. Auto
   * glass work in California is not licensed the way contracting trades are, so
   * a CSLB number does not carry over from a landscaping or construction build.
   * Ask the client whether they hold any license or certification worth showing
   * — the honest answer may be "none", and that is fine. No badge renders until
   * the client evidences one.
   */
  credentials: {
    licenseNumber: "[LICENSE_NUMBER_PENDING]",
    insured: "[INSURANCE_PENDING]",
    certification: "[CERTIFICATION_PENDING]",
    yearsInBusiness: "[YEARS_PENDING]",
  },

  /**
   * Only ever populate a key here once the account genuinely exists. A header or
   * footer icon linking to a dead profile is worse than no icon — it reads as an
   * abandoned business. Empty strings render nothing.
   */
  social: {
    google: "",
    yelp: "",
    facebook: "",
    youtube: "",
    linkedin: "",
  },

  web3forms: {
    accessKey:
      import.meta.env.PUBLIC_WEB3FORMS_KEY ?? "[WEB3FORMS_KEY_PENDING]",
    redirectTo: "/thanks/",
  },
} as const;

export type Service = {
  slug: string;
  /** Nav + card label. */
  name: string;
  /**
   * <title>, exclusive of the " | {site.name}" suffix the pages append.
   * Keep this under ~45 characters so the brand still fits before Google
   * truncates the result at roughly 60.
   */
  title: string;
  metaDescription: string;
  /** One-line card summary. */
  blurb: string;
  h1: string;
};

/**
 * Confirmed services only. adas-calibration is intentionally absent: the client
 * has not confirmed in writing that they perform ADAS calibration, and it is not
 * a claim to make speculatively — a miscalibrated camera is a safety issue.
 */
export const services: Service[] = [
  {
    slug: "mobile-auto-glass",
    name: "Mobile Auto Glass",
    // Exact target phrase leads the tag — the competing pages ranking for this
    // term are generic homepages that never put it in a title at all.
    title: "Mobile Windshield Repair in Orange County",
    metaDescription:
      "Mobile windshield repair and auto glass service across Orange County. We come to your driveway, office or job site — no shop visit, no waiting room.",
    blurb:
      "We drive to you. Home, office or job site — the repair happens where the vehicle already is.",
    h1: "Mobile Windshield Repair in Orange County",
  },
  {
    slug: "windshield-replacement",
    name: "Windshield Replacement",
    title: "Windshield Replacement Irvine, CA",
    metaDescription:
      "Full windshield replacement in Irvine and across Orange County. Mobile installation, proper urethane cure time, and glass that meets OEM safety spec.",
    blurb:
      "Cracks past the point of repair get a full replacement — installed to spec, not rushed out the door.",
    h1: "Windshield Replacement in Irvine & Orange County",
  },
  {
    slug: "windshield-chip-repair",
    name: "Chip & Crack Repair",
    title: "Windshield Repair Irvine, CA | Chip Repair",
    metaDescription:
      "Windshield repair near me? Mobile chip and crack repair across Orange County, based in Irvine. Caught early, most chips fill with resin.",
    blurb:
      "A chip caught early is a resin fill, not a new windshield. Most take under half an hour.",
    h1: "Windshield Chip & Crack Repair in Irvine",
  },
];

export const serviceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

/**
 * Cities with a live page. The list, the geography and the per-city copy live
 * in `src/data/cities.ts`; this is the published subset in the shape the
 * footer, coverage section, sitemap and schema consume.
 *
 * The batch-1 Orange County list was supplied by the client on 2026-09-18.
 * Adding a city means filling in its entry there and flipping `published`.
 */
export const cities = publishedCities.map((c) => ({
  name: c.name,
  slug: c.slug,
  href: cityPath(c.slug),
}));

/** Real Google/Yelp reviews only, quoted verbatim. Empty until pulled. */
export type Review = {
  quote: string;
  author: string;
  platform: "Google" | "Yelp";
  url: string;
};
export const reviews: Review[] = [];

/**
 * Hero photograph. Replaces the illustration when `src` is set.
 *
 * Put the file in `public/images/` and point `src` at it.
 *
 * IMPORTANT — optimise it before adding. Files in public/ ship byte-for-byte,
 * with no resizing and no format conversion. A straight-off-the-phone 4.3MB
 * JPEG measured at LCP 23s and dropped Lighthouse mobile performance from 100
 * to 74. Target WebP, roughly 1200px wide, under ~200KB.
 * `npm run check:placeholders` warns about anything over 300KB.
 *
 * Only use an image the client owns or has licensed. A photo from another auto
 * glass company's site is their copyright, and a stock shot with an identifiable
 * person needs a model release as well as an image licence. The client's own
 * phone photos need neither and, per the brief, convert better anyway.
 */
export const heroPhoto = {
  /** e.g. "/images/hero.webp" — leave empty for the illustration. */
  src: "/images/glass.jpeg",
  /** Describe the actual photo. Required whenever src is set. */
  alt: "Car windshield shattered into a spiderweb of cracks",
  /**
   * Shown under the photo. Only worth writing for a real job shot, where saying
   * what it is does credibility work — "Chip repair on a work van, Irvine".
   * Leave empty for generic imagery: a caption claiming a photo is our own work
   * when it isn't would be exactly the kind of invention this build avoids.
   */
  caption: "",
};

/** Real job photos only — shot on the job, not stock. Empty until supplied. */
export type WorkPhoto = { src: string; alt: string; caption: string };
export const recentWork: WorkPhoto[] = [];

export const owner = {
  name: "[OWNER_NAME_PENDING]",
  role: "[OWNER_ROLE_PENDING]",
  photo: "",
  bio: "[OWNER_BIO_PENDING]",
};

/** Drives the sitewide noindex and the robots.txt disallow. See LAUNCH_READY. */
export const notReadyToIndex = !LAUNCH_READY;

/** Primary CTA label. One place, so every button agrees. */
export const phoneCta = site.phone.acceptsText
  ? `Call or Text ${site.phone.display}`
  : `Call ${site.phone.display}`;

export const nav = [
  { label: "Mobile Service", href: "/mobile-auto-glass/" },
  { label: "Replacement", href: "/windshield-replacement/" },
  { label: "Chip Repair", href: "/windshield-chip-repair/" },
  { label: "Repair or Replace?", href: "/windshield-repair-or-replace/" },
  { label: "Cost", href: "/windshield-replacement-cost/" },
  { label: "Service Areas", href: "/service-area/" },
  { label: "Guides", href: "/blog/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

/** Non-service pages that belong in the sitemap and the footer. */
export const contentPages = [
  { label: "Repair or Replace?", href: "/windshield-repair-or-replace/" },
  { label: "Replacement Cost", href: "/windshield-replacement-cost/" },
  { label: "Service Area", href: "/service-area/" },
  { label: "Guides", href: "/blog/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];
