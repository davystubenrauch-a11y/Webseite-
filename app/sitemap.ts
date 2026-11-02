import type { MetadataRoute } from "next";

const base = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000"}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/site/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/impressum`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/datenschutz`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
