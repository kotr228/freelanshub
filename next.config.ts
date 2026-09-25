import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Order attachments, chat files and avatars go through Server Actions.
      bodySizeLimit: "26mb",
    },
  },
};

export default nextConfig;
