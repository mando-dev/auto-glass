import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site, services, cities, PENDING } from "@lib/site";
import { publishedCounties, countyPath } from "../data/counties";

/**
 * Hand-rolled rather than via @astrojs/sitemap so the file lands at /sitemap.xml
 * (the integration emits /sitemap-index.xml) and so the URL list is derived from
 * the same site.ts data everything else uses.
 *
 * Indexable pages only. /thanks/ and /404 carry noindex, and asking Google to
 * crawl a page you have told it not to index is a Search Console warning.
 */
const posts = await getCollection("blog", ({ data }) => !data.draft);

const paths = [
  "/",
  ...services.map((s) => `/${s.slug}/`),
  "/windshield-repair-or-replace/",
  "/windshield-replacement-cost/",
  ...publishedCounties.map((c) => countyPath(c.slug)),
  ...(PENDING.cities ? [] : cities.map((c) => c.href)),
  "/blog/",
  ...posts.map((post) => `/blog/${post.id}/`),
  "/about/",
  "/contact/",
];

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map((path) => `  <url>\n    <loc>${site.url}${path}</loc>\n  </url>`)
  .join("\n")}
</urlset>
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
