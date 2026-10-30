import type { MetadataRoute } from "next";

const base = "https://foav.de";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/anfrage/website`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/anfrage/roomtour`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/impressum`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/datenschutz`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
