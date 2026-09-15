import type { APIRoute } from "astro";
import { site, notReadyToIndex } from "@lib/site";

/**
 * Generated rather than static so the sitemap host cannot drift from site.url,
 * and so a pre-launch deploy cannot be crawled while the pages still render
 * placeholder copy.
 */
const body = notReadyToIndex
  ? `# Pre-launch. Not ready to be indexed yet.
# Lifts when LAUNCH_READY is set true in src/lib/site.ts.
User-agent: *
Disallow: /
`
  : `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
