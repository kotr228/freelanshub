import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root. Otherwise Next.js guesses it from lockfiles and, if a stray
  // package-lock.json sits in a parent folder (common on Windows, e.g. C:\Users\<name>),
  // Turbopack may treat files as "outside the root" and crash.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Don't write AGENTS.md / CLAUDE.md into the project on `next dev`.
  agentRules: false,
  experimental: {
    serverActions: {
      // Order attachments, chat files and avatars go through Server Actions.
      bodySizeLimit: "26mb",
    },
  },
};

export default nextConfig;
