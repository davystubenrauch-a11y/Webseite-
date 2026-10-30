import type { MetadataRoute } from "next";

const base = "https://foav.de";

export default function robots(): MetadataRoute.Robots {
  // Old design versions and drafts stay reachable by link but are not indexed.
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/entwurf/", "/v11/", "/v12/", "/v13/", "/v14/", "/v15/", "/v16/", "/v17/", "/v18/", "/v19/", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
