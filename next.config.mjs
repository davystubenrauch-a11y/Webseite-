/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The current site is the standalone page in public/site (design v15: Kino); older versions stay at /v14, /v13, /v12, /v11, /neu and /studio.
  async redirects() {
    return [{ source: "/", destination: "/site/index.html", permanent: false }];
  },
};

export default nextConfig;
