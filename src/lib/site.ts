/**
 * Single source of truth for all business facts.
 *
 * Anything bracketed like [THIS] is unconfirmed and must come from the client
 * in writing before launch. `npm run check:placeholders` lists what is still open.
 *
 * Never hardcode NAP, phone, hours or service area in a component. Import here.
 */

export const PENDING = {
  /** Legal/DBA name and domain not finalized. */
  identity: true,
  /** No business line yet. No call-tracking number either. */
  phone: true,
  /** Physical address — needed for LocalBusiness schema + Google Business Profile. */
  address: true,
  /** Client has not supplied hours. */
  hours: true,
  /** City list unconfirmed — see `cities` below. */
  cities: true,
  /** No Google Business Profile reviews pulled yet. */
  reviews: true,
  /** Owner name/photo/bio not supplied. */
  owner: true,
  /** Web3Forms access key comes from the client's Web3Forms account. */
  web3forms: !import.meta.env.PUBLIC_WEB3FORMS_KEY,
} as const;

export const site = {
  name: "[SITE_NAME]",
  legalName: "[LEGAL_BUSINESS_NAME]",
  tagline: "Mobile auto glass repair and windshield replacement in Orange County",
  /** Set once the client's domain is registered. Must match SITE_URL in astro.config.mjs. */
  url: "https://DOMAIN-PENDING.example.com",

  phone: {
    display: "[PHONE_PLACEHOLDER]",
    /** tel: href form, digits only with country code. */
    href: "tel:+1000000000",
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
    { days: "[DAYS_PENDING]", open: "[OPEN_PENDING]", close: "[CLOSE_PENDING]" },
  ],

  /**
   * Credentials. Never populate these from assumption — auto glass work in CA
   * does not require a CSLB license, so do not carry one over from another trade.
   * Insurance and any manufacturer/AGSC certification must be evidenced by the client.
   */
  credentials: {
    insured: "[INSURANCE_PENDING]",
    certification: "[CERTIFICATION_PENDING]",
    yearsInBusiness: "[YEARS_PENDING]",
  },

  social: {
    google: "[GOOGLE_BUSINESS_PROFILE_URL_PENDING]",
    yelp: "[YELP_URL_PENDING]",
  },

  web3forms: {
    accessKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? "[WEB3FORMS_KEY_PENDING]",
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
      "Windshield chip and rock crack repair in Irvine and Orange County. Caught early, most chips are a resin repair instead of a full replacement.",
    blurb:
      "A chip caught early is a resin fill, not a new windshield. Most take under half an hour.",
    h1: "Windshield Chip & Crack Repair in Irvine",
  },
];

export const serviceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

/**
 * Orange County cities.
 *
 * NOT CONFIRMED. This list is staged from the market-size shortlist in the build
 * brief, not from the client. Coverage section and city pages stay hidden until
 * the client confirms the actual service radius — advertising a city the techs
 * will not drive to is a refund and a bad review, not a lead.
 *
 * To go live: confirm the list, then set PENDING.cities = false.
 */
export const cities: { name: string; slug: string }[] = [
  { name: "Irvine", slug: "irvine" },
  { name: "Santa Ana", slug: "santa-ana" },
  { name: "Anaheim", slug: "anaheim" },
  { name: "Huntington Beach", slug: "huntington-beach" },
  { name: "Costa Mesa", slug: "costa-mesa" },
];

/** Real Google/Yelp reviews only, quoted verbatim. Empty until pulled. */
export type Review = {
  quote: string;
  author: string;
  platform: "Google" | "Yelp";
  url: string;
};
export const reviews: Review[] = [];

/** Real job photos only — shot on the job, not stock. Empty until supplied. */
export type WorkPhoto = { src: string; alt: string; caption: string };
export const recentWork: WorkPhoto[] = [];

export const owner = {
  name: "[OWNER_NAME_PENDING]",
  role: "[OWNER_ROLE_PENDING]",
  photo: "",
  bio: "[OWNER_BIO_PENDING]",
};

export const nav = [
  { label: "Mobile Service", href: "/mobile-auto-glass/" },
  { label: "Replacement", href: "/windshield-replacement/" },
  { label: "Chip Repair", href: "/windshield-chip-repair/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];
