/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The site is the standalone page in public/site (design v20, brand FOAV), served at "/" so the address stays foav.de.
  // Comparison drafts stay at /v21 … /v24 (noindex).
  // Older versions stay at /v19, /v18, /v17, /v16, /v15, /v14, /v13, /v12, /v11, /neu and /studio.
  async rewrites() {
    // beforeFiles: must win over app/page.tsx, which would otherwise answer "/".
    return { beforeFiles: [{ source: "/", destination: "/site/index.html" },
        { source: "/websites", destination: "/site/websites.html" },
        { source: "/roomtours", destination: "/site/roomtours.html" },
        { source: "/nfc-platten", destination: "/site/nfc-platten.html" },
        { source: "/demo/spiruli", destination: "/demo/spiruli/index.html" },
        { source: "/demo/spiruli/", destination: "/demo/spiruli/index.html" }],
      // Sales drafts for prospective clients: public/entwurf/<slug>/index.html, reachable as /entwurf/<slug> (noindex, robots-blocked).
      afterFiles: [{ source: "/entwurf/:slug", destination: "/entwurf/:slug/index.html" }] };
  },
};

export default nextConfig;
