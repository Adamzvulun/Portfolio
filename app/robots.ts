import type { MetadataRoute } from "next";

// Static photography portfolio — everything is public and crawlable. The base
// URL matches `metadataBase` in app/layout.tsx so the canonical host stays
// consistent across metadata, OG tags, and the sitemap.
const BASE_URL = "https://adamzvulun.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
