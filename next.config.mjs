/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The current site is the standalone page in public/studio; send the root there.
  async redirects() {
    return [{ source: "/", destination: "/studio/index.html", permanent: false }];
  },
};

export default nextConfig;
