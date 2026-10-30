/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The current site is the standalone page in public/site (design v20 „Bühne“, brand FOAV), served at "/" so the address stays foav.de.
  // Older versions stay at /v19, /v18, /v17, /v16, /v15, /v14, /v13, /v12, /v11, /neu and /studio.
  async rewrites() {
    // beforeFiles: must win over app/page.tsx, which would otherwise answer "/".
    return { beforeFiles: [{ source: "/", destination: "/site/index.html" }] };
  },
};

export default nextConfig;
