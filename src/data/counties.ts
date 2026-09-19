import type { City } from "./cities";

/**
 * County hub pages. A hub lists the published cities in its county.
 *
 * A county hub publishes once it has cities under it — a hub with none is an
 * empty page. Los Angeles went live with Cerritos and Whittier, the two LA
 * cities whose keyword research came back usable.
 */
export type County = {
  name: string;
  slug: string;
  key: City["county"];
  published: boolean;
};

export const counties: County[] = [
  { name: "Orange County", slug: "orange-county", key: "orange", published: true },
  { name: "Los Angeles County", slug: "los-angeles-county", key: "los-angeles", published: true },
];

export const publishedCounties = counties.filter((c) => c.published);

export const countyPath = (slug: string) => `/${slug}/`;

export const countyForCity = (county: City["county"]) =>
  counties.find((c) => c.key === county);
