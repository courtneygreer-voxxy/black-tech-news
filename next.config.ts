import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Vercel deployment with admin features
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Removed static export to enable API routes and middleware for admin panel
};

export default nextConfig;
