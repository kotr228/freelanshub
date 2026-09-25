// Creates the database (if missing) and applies db/schema.sql.
// Usage: node --env-file=.env scripts/db-init.mjs   (npm run db:init loads .env itself)
import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";

try {
  process.loadEnvFile?.(".env");
} catch {
  // no .env — rely on the real environment
}

const { DB_HOST = "localhost", DB_PORT = "3306", DB_USER, DB_PASSWORD, DB_NAME } = process.env;
if (!DB_USER || !DB_NAME) {
  console.error("DB_USER and DB_NAME must be set (see .env.example)");
  process.exit(1);
}

const conn = await mysql.createConnection({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  multipleStatements: true,
});

await conn.query(
  `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
);
await conn.query(`USE \`${DB_NAME}\``);
await conn.query(await readFile(new URL("../db/schema.sql", import.meta.url), "utf8"));
await conn.end();
console.log(`Schema applied to database "${DB_NAME}".`);
