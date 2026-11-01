/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Home page: public/v24/index.html (dark design v24), served at "/" so the address stays foav.de.
  // Service pages /websites, /roomtours, /nfc-platten still come from public/site (design v20).
  // Older versions stay at /v19, /v18, /v17, /v16, /v15, /v14, /v13, /v12, /v11, /neu and /studio.
  async rewrites() {
    // beforeFiles: must win over app/page.tsx, which would otherwise answer "/".
    return { beforeFiles: [{ source: "/", destination: "/v24/index.html" },
        { source: "/websites", destination: "/site/websites.html" },
        { source: "/roomtours", destination: "/site/roomtours.html" },
        { source: "/nfc-platten", destination: "/site/nfc-platten.html" }] };
  },
};

export default nextConfig;
