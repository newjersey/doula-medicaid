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
        // We put the home page on /form/welcome instead of / as a matter of tech debt. It was the most convenient thing to do then, and we thought we could always refactor to move it back to /.
        // However, public communications, e.g. the press release, have since directly linked to /form/welcome. If we switch the location of the landing page, we need to make sure that /form/welcome redirects to the new location
        // Removing this redirect without doing so will break links from multiple external sources, including the press release.
        destination: "/form/welcome",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
