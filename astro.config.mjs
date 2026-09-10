// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Kept in sync with site.url by hand — astro.config cannot import from src/lib
// because Vite has not resolved aliases at config load time.
const SITE_URL = "https://DOMAIN-PENDING.example.com";

export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "always",
  },
  compressHTML: true,
});
