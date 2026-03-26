import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** R3F / drei ship modern ESM; transpiling avoids broken client chunks. */
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  webpack: (config, { dev }) => {
    /**
     * Next’s default filesystem webpack cache uses pack.gz files under .next/cache/webpack.
     * Those break with ENOENT if .next is deleted while `next dev` runs, or if two dev
     * servers share one repo (two ports writing the same cache). Disabling cache in dev
     * avoids that class of failures (slightly slower rebuilds, stable dev).
     */
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
