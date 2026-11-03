import type { MetadataRoute } from "next";

const base = "https://foav.de";

export default function robots(): MetadataRoute.Robots {
  // Old design versions and drafts stay reachable by link but are not indexed.
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/entwurf/", "/neu/", "/standalone/", "/studio/", "/v11/", "/v12/", "/v13/", "/v14/", "/v15/", "/v16/", "/v17/", "/v18/", "/v19/", "/v20/", "/v20b/", "/v20c/", "/v20d/", "/v21/", "/v22/", "/v23/", "/v24/", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
