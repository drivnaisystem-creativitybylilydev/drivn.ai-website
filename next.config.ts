import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** R3F / drei ship modern ESM; transpiling avoids broken client chunks. */
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  /**
   * Keep MongoDB (and its native addons) out of the webpack bundle.
   * Without this, Next.js tries to bundle the MongoDB driver which is slow
   * and breaks on Vercel serverless functions.
   */
  serverExternalPackages: ["mongodb"],

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
