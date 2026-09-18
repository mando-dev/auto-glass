import type { City } from "./cities";

/**
 * County hub pages. A hub lists the published cities in its county.
 *
 * Los Angeles County stays unpublished until the first LA cities go live —
 * a hub with no cities under it is an empty page, and there is no keyword
 * research for LA yet either.
 */
export type County = {
  name: string;
  slug: string;
  key: City["county"];
  published: boolean;
};

export const counties: County[] = [
  { name: "Orange County", slug: "orange-county", key: "orange", published: true },
  { name: "Los Angeles County", slug: "los-angeles-county", key: "los-angeles", published: false },
];

export const publishedCounties = counties.filter((c) => c.published);

export const countyPath = (slug: string) => `/${slug}/`;

export const countyForCity = (county: City["county"]) =>
  counties.find((c) => c.key === county);
