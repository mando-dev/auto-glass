/**
 * City pages — one entry per city, one template.
 *
 * Every published city carries fields that are unique to it: ZIPs, freeways,
 * neighborhoods, landmarks, a written intro and city-specific FAQs. The
 * template builds 30–40% of each page's body from these, so no two city pages
 * are the same page with the name swapped.
 *
 * Geography must be real. Nothing here was guessed — if a fact is not certain,
 * it is left out rather than invented. ZIPs are bare strings on purpose: the
 * NAP check flags "CA 92xxx" anywhere in src/, and it should.
 *
 * Unpublished entries (published: false) exist so the slug is reserved and the
 * list is visible, but they build nothing and appear nowhere until the rich
 * fields are filled in and the flag is flipped.
 */
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
  /** 2–3 sentences unique to this city. */
  intro: string;
  /** 2–3 city-specific Q&As. */
  faq: { q: string; a: string }[];
};

/** URL for a city page. One place, so every link agrees. */
export const cityPath = (slug: string) => `/windshield-repair-${slug}-ca/`;

function stub(name: string, county: City["county"]): City {
  return {
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    county,
    published: false,
    zips: [],
    freeways: [],
    neighborhoods: [],
    landmarks: [],
    neighbors: [],
    intro: "",
    faq: [],
  };
}

export const cities: City[] = [
  {
    name: "Irvine",
    slug: "irvine",
    county: "orange",
    published: true,
    zips: ["92602", "92603", "92604", "92606", "92612", "92614", "92617", "92618", "92620"],
    freeways: ["I-5", "I-405", "SR-133", "SR-241", "SR-261", "SR-73"],
    neighborhoods: [
      "Woodbridge",
      "Northwood",
      "Turtle Rock",
      "University Park",
      "Westpark",
      "Portola Springs",
      "Quail Hill",
      "Great Park Neighborhoods",
      "Irvine Business Complex",
    ],
    landmarks: [
      "Irvine Spectrum Center",
      "UC Irvine",
      "Orange County Great Park",
      "Irvine Business Complex",
    ],
    neighbors: ["costa-mesa", "santa-ana", "anaheim", "huntington-beach"],
    intro:
      "Irvine is built around office parks and master-planned villages, which means a lot of the windshields we see here live in parking structures rather than driveways. Company vehicles parked at the Irvine Business Complex or the Spectrum can be handled in the structure during the working day, without anyone losing a vehicle to a shop run. The long commutes on the 5 and the 405 also throw up more than their share of gravel, so a fresh chip here is a common call.",
    faq: [
      {
        q: "Can you work inside a parking structure in Irvine?",
        a: "Usually, yes. A chip repair needs the glass dry and within a workable temperature range, and a covered structure is often better for that than an open lot in the afternoon sun. Very low clearance levels are the one thing worth mentioning when you book, so the van fits.",
      },
      {
        q: "Do you cover the villages — Woodbridge, Northwood, Turtle Rock?",
        a: "All of them. Irvine is one city for scheduling purposes: tell us the street and whether the vehicle sits in a driveway, a garage or a community lot, and we'll say straight away whether we can get to it and when.",
      },
      {
        q: "Can you handle a company fleet parked at an Irvine office?",
        a: "Yes — that's the kind of job mobile service is best at. Several vehicles in one structure get worked through in one visit, ideally before the day starts or between runs, so nothing is off the road during working hours.",
      },
    ],
  },
  {
    name: "Santa Ana",
    slug: "santa-ana",
    county: "orange",
    published: true,
    zips: ["92701", "92703", "92704", "92705", "92706", "92707"],
    freeways: ["I-5", "SR-55", "SR-22", "I-405"],
    neighborhoods: [
      "Downtown Santa Ana",
      "Floral Park",
      "French Park",
      "Delhi",
      "Willard",
      "South Coast Metro",
    ],
    landmarks: [
      "Bowers Museum",
      "Santa Ana Zoo",
      "MainPlace Mall",
      "Orange County Civic Center",
      "Discovery Cube Orange County",
    ],
    neighbors: ["irvine", "costa-mesa", "anaheim", "huntington-beach"],
    intro:
      "Santa Ana is dense, residential and full of working vehicles — contractor trucks, delivery vans and family cars that park on the street or in a shared driveway. Mobile service suits that: the repair happens at the curb or in the driveway, and the van only needs about a car width of space beside the vehicle. The Civic Center and downtown lots are fine for daytime jobs if that's where the car already sits.",
    faq: [
      {
        q: "Can you repair a windshield on the street in Santa Ana?",
        a: "Yes, provided the vehicle is parked legally and there's room to open the door and work along the passenger side. Street parking in the older neighborhoods is usually workable — if the spot is tight, a nearby driveway or lot is a better bet and we'll say so when you book.",
      },
      {
        q: "I run work trucks out of Santa Ana. Can you do them all at once?",
        a: "That's the ideal way to do it. Tell us how many vehicles and where they're parked overnight or between jobs, and we'll work through them in a single visit rather than pulling them off the road one at a time.",
      },
      {
        q: "Which parts of Santa Ana do you cover?",
        a: "All of it — downtown, Floral Park, French Park, Delhi, Willard and the South Coast Metro side. If you're anywhere in the city, call or text with the cross streets and we'll confirm.",
      },
    ],
  },
  {
    name: "Anaheim",
    slug: "anaheim",
    county: "orange",
    published: true,
    zips: ["92801", "92802", "92804", "92805", "92806", "92807", "92808"],
    freeways: ["I-5", "SR-91", "SR-57", "SR-55"],
    neighborhoods: [
      "Anaheim Hills",
      "Downtown Anaheim",
      "Anaheim Colony Historic District",
      "Platinum Triangle",
      "West Anaheim",
      "Anaheim Resort",
    ],
    landmarks: [
      "Disneyland Resort",
      "Angel Stadium",
      "Honda Center",
      "Anaheim Convention Center",
      "Anaheim Packing District",
    ],
    neighbors: ["santa-ana", "irvine", "costa-mesa", "huntington-beach"],
    intro:
      "Anaheim splits into two very different driving environments. The resort corridor and the Platinum Triangle are hotel lots, rideshare vehicles and event parking, where a cracked windshield needs sorting between shifts rather than on a day off. Anaheim Hills is canyon roads and the 91, which sends more rock strikes our way than almost anywhere else in the county. If you've been quoted a multi-day wait by Safelite or another national chain, a local mobile tech is usually the faster route for either side of town.",
    faq: [
      {
        q: "Can you come to a hotel parking lot near the Anaheim Resort?",
        a: "Yes. Hotel and resort-area lots are a normal mobile job — we just need the vehicle parked where there's space to work on the passenger side and no rain on the glass. Let the front desk know a van is coming if the lot is gated.",
      },
      {
        q: "I drive rideshare in Anaheim. Can you fit a repair between shifts?",
        a: "Often. A chip repair is around half an hour and doesn't need cure time before you drive, so it fits a gap in the day. A replacement is different — there's a safe drive-away window while the adhesive cures, so plan that one for the end of a shift, not the middle.",
      },
      {
        q: "Do you cover Anaheim Hills?",
        a: "Yes, the whole city including the Hills. Rock chips from the 91 and the canyon roads are a regular call from that side — send a photo and we'll tell you whether it fills before anyone drives out.",
      },
    ],
  },
  {
    name: "Huntington Beach",
    slug: "huntington-beach",
    county: "orange",
    published: true,
    zips: ["92646", "92647", "92648", "92649"],
    freeways: ["I-405", "SR-39", "SR-1"],
    neighborhoods: [
      "Downtown Huntington Beach",
      "Huntington Harbour",
      "Sunset Beach",
      "Seacliff",
      "Goldenwest",
      "Oak View",
    ],
    landmarks: [
      "Huntington Beach Pier",
      "Bolsa Chica Ecological Reserve",
      "Huntington Central Park",
      "Bella Terra",
    ],
    neighbors: ["costa-mesa", "santa-ana", "irvine", "anaheim"],
    intro:
      "Huntington Beach vehicles live with salt air, sand and the stop-start traffic on Pacific Coast Highway and Beach Boulevard. Salt doesn't damage glass, but it does mean the pinch weld under a windshield needs to be clean and properly primed before new glass goes in — a step that gets skipped when a replacement is rushed. Most jobs here are driveways in the inland tracts and the Harbour, with the occasional beachfront lot when the tide of parking allows.",
    faq: [
      {
        q: "Does the coastal air change anything about a replacement in Huntington Beach?",
        a: "Not the glass, but it raises the stakes on the prep. Any bare metal exposed on the pinch weld has to be primed before the urethane goes on, or salt air gets to it and corrosion starts under the new bond. It's a normal part of doing the job properly — just one that matters more a mile from the water.",
      },
      {
        q: "Can you work at a beachfront parking lot?",
        a: "If the vehicle can stay put for the job and the glass is dry, yes. Wind-blown sand and direct sun on the glass can make resin work harder, so a driveway or a covered spot in the Harbour or the inland tracts is usually the better option — we'll tell you which when you book.",
      },
      {
        q: "Do you cover Sunset Beach and the Harbour?",
        a: "Yes — Huntington Harbour, Sunset Beach, Seacliff, Goldenwest, Oak View and downtown are all covered. Tell us where the vehicle is parked and we'll confirm.",
      },
    ],
  },
  {
    name: "Costa Mesa",
    slug: "costa-mesa",
    county: "orange",
    published: true,
    zips: ["92626", "92627"],
    freeways: ["I-405", "SR-55", "SR-73"],
    neighborhoods: [
      "Eastside Costa Mesa",
      "Westside Costa Mesa",
      "Mesa Verde",
      "South Coast Metro",
      "College Park",
      "Halecrest",
    ],
    landmarks: [
      "South Coast Plaza",
      "Segerstrom Center for the Arts",
      "OC Fair & Event Center",
      "Orange Coast College",
      "Triangle Square",
    ],
    neighbors: ["irvine", "huntington-beach", "santa-ana", "anaheim"],
    intro:
      "Costa Mesa sits on the 55/405 interchange, which is one of the busiest stretches of freeway in the county and a reliable source of fresh rock chips. The South Coast Metro office lots and the Westside industrial blocks are where most of the daytime jobs land — company vehicles and work vans handled where they park. The Eastside and Mesa Verde are driveway jobs, and Orange Coast College is a common one for students who'd rather not lose a day to a shop.",
    faq: [
      {
        q: "Can you come to an office lot in South Coast Metro?",
        a: "Yes. Office and retail lots around South Coast Plaza and the Metro towers are a normal mobile job — we work on the passenger side of the vehicle where it's parked, and you stay at your desk. Let building security know a van is expected if the lot is controlled.",
      },
      {
        q: "I have work vans on the Westside. Can you do them in one go?",
        a: "That's the best way to do it. Several vehicles in one yard get worked through in a single visit, before the day starts or between runs, so the vans stay on the road when they're supposed to be.",
      },
      {
        q: "Which parts of Costa Mesa do you cover?",
        a: "All of it — Eastside, Westside, Mesa Verde, South Coast Metro, College Park and Halecrest. Text a photo of the damage and where the car is, and we'll tell you repair or replace and when we can get there.",
      },
    ],
  },

  // Batch 2 — unpublished. Name, slug and county only; the rich fields stay
  // empty until each city is researched and confirmed.
  stub("Cerritos", "los-angeles"),
  stub("Lakewood", "los-angeles"),
  stub("Long Beach", "los-angeles"),
  stub("La Mirada", "los-angeles"),
  stub("Norwalk", "los-angeles"),
  stub("Whittier", "los-angeles"),
  stub("Downey", "los-angeles"),

  // Batch 3 — unpublished, same rule.
  stub("Torrance", "los-angeles"),
  stub("Carson", "los-angeles"),
  stub("Pasadena", "los-angeles"),
  stub("West Covina", "los-angeles"),
  stub("Pomona", "los-angeles"),
];

export const publishedCities = cities.filter((c) => c.published);

export const cityBySlug = (slug: string) => publishedCities.find((c) => c.slug === slug);

export const citiesInCounty = (county: City["county"]) =>
  publishedCities.filter((c) => c.county === county);
