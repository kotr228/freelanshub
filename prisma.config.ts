import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// The Prisma CLI (migrate, db pull, studio) uses the DIRECT (non-pooled) Neon
// connection: migrations need a session that PgBouncer's transaction mode can't give.
// The running app uses the pooled DATABASE_URL — see src/lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
