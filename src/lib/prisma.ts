import "server-only";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

// One PrismaClient per process. In development Next.js re-evaluates modules on
// every hot reload; without caching on globalThis each reload opens a new pool
// and Neon soon answers "too many connections".
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Don't throw at import time: `next build` imports server modules and may run
    // without database credentials (e.g. in CI). Queries will fail until it is set.
    console.error("[prisma] DATABASE_URL is not set");
  }

  // Neon serverless driver (WebSocket pool) — works in Node and on Vercel/edge runtimes.
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
