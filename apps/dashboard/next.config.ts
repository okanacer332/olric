import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath satırını SİLDİK. Artık kök dizinde çalışacak.
  transpilePackages: ["@repo/ui"], 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;