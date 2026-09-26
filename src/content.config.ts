import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Blog posts.
 *
 * Same placeholder discipline as the rest of the site applies here, and it is
 * easier to break by accident in prose: no implied years in business, no
 * customer counts, no "we've seen hundreds of these", no certifications. Write
 * about the trade, not about a track record that does not exist yet.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Draft posts build locally but are excluded from the site and sitemap. */
    draft: z.boolean().default(false),
    /** The search query the post is written to answer. Documentation, not rendered. */
    targetQuery: z.string().optional(),
    /** Path of the service page this post supports, e.g. "/windshield-replacement/". */
    relatedService: z.string().optional(),
    /** Slugs from src/data/cities.ts. Unpublished cities are skipped at render. */
    relatedCities: z.array(z.string()).default([]),
    /**
     * Optional FAQ. Rendered as a visible FAQ section and as FAQPage JSON-LD
     * from this one array, so the markup can never drift from the page text.
     */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

export const collections = { blog };
