import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // mysql2 must stay a native Node dependency, not bundled.
  serverExternalPackages: ["mysql2"],
  experimental: {
    serverActions: {
      // Order attachments, chat files and avatars go through Server Actions.
      bodySizeLimit: "26mb",
    },
  },
};

export default nextConfig;
