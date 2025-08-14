import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/form/personal-information",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
