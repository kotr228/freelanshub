import "dotenv/config";
import { defineConfig } from "prisma/config";

// The Prisma CLI (migrate, db pull, studio) uses the DIRECT (non-pooled) Neon
// connection: migrations need a session that PgBouncer's transaction mode can't give.
// The running app uses the pooled DATABASE_URL — see src/lib/prisma.ts.
//
// process.env (not env()) on purpose: `prisma generate` runs on `npm install`
// and must work without database credentials, e.g. in CI.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
