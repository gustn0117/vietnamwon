import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1", "terminal.local"],
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "api.hsweb.pics", pathname: "/storage/v1/object/public/**" }],
  },
  experimental: {
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;
