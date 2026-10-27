/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The current site is the standalone page in public/site (design v14: Kino); older versions stay at /v13, /v12, /v11, /neu and /studio.
  async redirects() {
    return [{ source: "/", destination: "/site/index.html", permanent: false }];
  },
};

export default nextConfig;
