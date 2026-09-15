import type { APIRoute } from "astro";
import { site, notReadyToIndex } from "@lib/site";

/**
 * Generated rather than static so the sitemap host cannot drift from site.url,
 * and so a pre-launch deploy cannot be crawled while the pages still render
 * placeholder copy.
 */
const body = notReadyToIndex
  ? `# Pre-launch. Pages still render placeholder copy ([SITE_NAME],
# [PHONE_PLACEHOLDER]) and visible build notes. Indexing now would put that
# in front of real searchers and into Google's cache.
#
# This lifts automatically once the client's name and phone number are set
# in src/lib/site.ts and the matching PENDING flags are cleared.
User-agent: *
Disallow: /
`
  : `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
