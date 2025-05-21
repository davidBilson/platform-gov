import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  modularizeImports: {
    '@/components': {
      transform: '@/components/{{member}}',
    },
  },
};

export default nextConfig;