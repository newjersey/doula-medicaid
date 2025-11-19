import { BASE_PATH } from "@/app/basePath";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  output: "standalone",
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
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
        destination: "/form/welcome",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
