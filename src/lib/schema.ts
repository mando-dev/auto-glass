import { site, cities, reviews, services, PENDING } from "./site";

/**
 * schema.org has no "AutoGlass" type. AutoRepair is the correct parent for
 * windshield work — do not invent a type name.
 *
 * Keep this aligned with whatever category the client selects on their Google
 * Business Profile ("Auto glass shop" or "Auto glass repair service" are the
 * categories competitors in this market use). The markup and the profile
 * disagreeing is exactly the kind of identity drift the NAP rule exists to stop.
 */
const BUSINESS_ID = `${site.url}/#business`;

export function localBusinessSchema() {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": BUSINESS_ID,
    name: site.name,
    url: site.url,
    description: site.tagline,
  };

  if (!PENDING.phone) schema.telephone = site.phone.display;

  // A mobile-only operation should not publish a storefront address: Google
  // treats a service-area business with a public address as a guideline problem.
  if (!PENDING.address && site.hasWalkInShop) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: site.address.country,
    };
  }

  schema.areaServed = PENDING.cities
    ? { "@type": "AdministrativeArea", name: "Orange County, CA" }
    : cities.map((c) => ({ "@type": "City", name: `${c.name}, CA` }));

  if (!PENDING.hours) {
    schema.openingHoursSpecification = site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.open,
      closes: h.close,
    }));
  }

  // Only ever emit review markup for reviews that actually exist on a public
  // profile. Fabricated or self-authored review markup is a manual-action risk.
  if (reviews.length > 0) {
    schema.review = reviews.map((r) => ({
      "@type": "Review",
      reviewBody: r.quote,
      author: { "@type": "Person", name: r.author },
    }));
  }

  schema.hasOfferCatalog = {
    "@type": "OfferCatalog",
    name: "Auto glass services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, url: `${site.url}/${s.slug}/` },
    })),
  };

  return schema;
}

/**
 * @param path  Page path with leading and trailing slash. A bare slug is also
 *              accepted for the three service pages.
 * @param areaServed  Override for city and county pages, which serve one
 *              place rather than the whole list.
 */
export function serviceSchema(
  path: string,
  name: string,
  description: string,
  areaServed?: Record<string, unknown>,
) {
  const url = path.startsWith("/") ? `${site.url}${path}` : `${site.url}/${path}/`;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url,
    provider: { "@id": BUSINESS_ID },
  };
  schema.areaServed =
    areaServed ??
    (PENDING.cities
      ? { "@type": "AdministrativeArea", name: "Orange County, CA" }
      : cities.map((c) => ({ "@type": "City", name: `${c.name}, CA` })));
  return schema;
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${site.url}${t.url}`,
    })),
  };
}
