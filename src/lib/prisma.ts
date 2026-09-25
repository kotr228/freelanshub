import "server-only";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// One PrismaClient per process. In development Next.js re-evaluates modules on
// every hot reload; without caching on globalThis each reload opens a new pool
// and Neon soon answers "too many connections".
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createAdapter(connectionString: string | undefined) {
  // Neon: serverless driver over WebSockets (works in Node 22+, Vercel, edge).
  // Anything else (local Postgres, Docker, CI): the regular node-postgres driver.
  if (!connectionString || /\.neon\.tech/.test(connectionString)) return new PrismaNeon({ connectionString });
  return new PrismaPg({ connectionString });
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Don't throw at import time: `next build` imports server modules and may run
    // without database credentials (e.g. in CI). Queries will fail until it is set.
    console.error("[prisma] DATABASE_URL is not set");
  }
  return new PrismaClient({
    adapter: createAdapter(connectionString),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
