import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  rewrites: async () => {
    return [
      {
        source: "/:slug*",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;
