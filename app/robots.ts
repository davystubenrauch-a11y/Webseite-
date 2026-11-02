import type { MetadataRoute } from "next";

const base = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000"}`;

export default function robots(): MetadataRoute.Robots {
  // Old design versions and drafts stay reachable by link but are not indexed.
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/entwurf/", "/v11/", "/v12/", "/v13/", "/v14/", "/v15/", "/v16/", "/v17/", "/v18/", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
