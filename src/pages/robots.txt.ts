import type { APIRoute } from "astro";
import { site } from "@lib/site";

/**
 * Generated rather than static so the sitemap host cannot drift from site.url,
 * and so a pre-launch deploy cannot be crawled while the canonicals still point
 * at the placeholder domain.
 */
const domainPending = site.url.includes("DOMAIN-PENDING");

const body = domainPending
  ? `# Pre-launch. The real domain is not set yet, so every canonical on this
# build points at a placeholder host. Crawling now would index pages that
# declare themselves copies of a URL that does not exist.
#
# This lifts automatically once site.url is the client's real domain.
User-agent: *
Disallow: /
`
  : `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap-index.xml
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
