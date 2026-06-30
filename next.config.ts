import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  transpilePackages: ["three"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
