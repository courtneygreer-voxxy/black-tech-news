import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Cloudflare Pages deployment
  images: {
    unoptimized: true,
  },
  // Static export for Cloudflare Pages (only in production)
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
};

export default nextConfig;
