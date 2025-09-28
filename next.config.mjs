/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'nice-fish-60233720ac.strapiapp.com' },
    ],
  },
};
module.exports = nextConfig;
