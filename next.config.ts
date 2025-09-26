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
        source: "/form/:slug*",
        destination: "/form",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/form/screening/1",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
