import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

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
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
