import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/collections",
        destination: "/explore",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
