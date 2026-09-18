import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1", "terminal.local"],
  poweredByHeader: false,
};

export default nextConfig;
