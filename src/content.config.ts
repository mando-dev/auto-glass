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
  }),
});

export const collections = { blog };
