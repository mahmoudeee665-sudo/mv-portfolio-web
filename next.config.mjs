// If you want to derive the host from your env:
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";
let REMOTE_PATTERNS = [];

try {
  if (STRAPI_URL) {
    const u = new URL(STRAPI_URL);
    REMOTE_PATTERNS.push({ protocol: u.protocol.replace(":", ""), hostname: u.hostname });
  }
} catch { /* ignore bad URLs */ }

// Add Cloudinary too if you serve images from there
REMOTE_PATTERNS.push({ protocol: "https", hostname: "res.cloudinary.com" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: REMOTE_PATTERNS,
  },
  // optional: if using experimental features, add here
  // experimental: { serverActions: { bodySizeLimit: '2mb' } }
};

export default nextConfig;
