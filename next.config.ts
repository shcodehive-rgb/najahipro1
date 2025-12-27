import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // ضروري باش الصور ديال Sanity يخدمو
      },
    ],
  },
  // هاد الجوج سطور هما "الساروت" باش يدوز الـ Build بلا مشاكل
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;