/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The current site is the standalone page in public/site (design v9: seriös, Nachtblau-Einstieg); older versions stay at /neu and /studio.
  async redirects() {
    return [{ source: "/", destination: "/site/index.html", permanent: false }];
  },
};

export default nextConfig;
