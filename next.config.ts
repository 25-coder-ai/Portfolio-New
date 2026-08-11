import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // 70 is used by the hero image-trail; 75 is Next's default for everything
    // else. Both must be whitelisted or Next warns at runtime.
    qualities: [70, 75],
  },
  transpilePackages: ["three"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
