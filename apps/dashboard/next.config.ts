import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/dashboard",
  // UI paketini derlemesi için bunu ekliyoruz:
  transpilePackages: ["@repo/ui"], 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profil resimleri için
      },
    ],
  },
};

export default nextConfig;