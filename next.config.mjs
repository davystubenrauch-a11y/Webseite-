/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The current site is the standalone page in public/neu (design v3); the previous one stays at /studio/index.html.
  async redirects() {
    return [{ source: "/", destination: "/neu/index.html", permanent: false }];
  },
};

export default nextConfig;
