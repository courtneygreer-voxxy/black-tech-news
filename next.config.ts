import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Cloudflare Pages deployment
  images: {
    unoptimized: true,
  },
  // Static export for Cloudflare Pages
  output: 'export',
};

export default nextConfig;
