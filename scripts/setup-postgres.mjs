import fs from "node:fs";
import crypto from "node:crypto";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.HOSTED_ENV_FILE ?? ".env.netlify",
  quiet: true,
});
if (process.env.DATABASE_PROVIDER !== "postgresql")
  throw new Error("PostgreSQL setup requires DATABASE_PROVIDER=postgresql.");
const connectionString = process.env.NETLIFY_DB_URL ?? process.env.DATABASE_URL;
if (!connectionString || !/^postgres(ql)?:\/\//.test(connectionString))
  throw new Error("The hosted PostgreSQL connection is missing.");
const secureUrl = new URL(connectionString);
if (
  ["prefer", "require", "verify-ca"].includes(
    secureUrl.searchParams.get("sslmode") ?? "",
  )
)
  secureUrl.searchParams.set("sslmode", "verify-full");
const pool = new pg.Pool({
  connectionString: secureUrl.toString(),
  max: 1,
  connectionTimeoutMillis: 20_000,
});
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(20261113, 1)");
  await client.query(
    'CREATE TABLE IF NOT EXISTS "SunkaSchemaMigration" ("id" TEXT PRIMARY KEY, "checksum" TEXT NOT NULL, "appliedAt" TIMESTAMPTZ NOT NULL DEFAULT now())',
  );
  for (const name of fs
    .readdirSync("prisma/postgresql/migrations")
    .filter((n) => n.endsWith(".sql"))
    .sort()) {
    const sql = fs
      .readFileSync(`prisma/postgresql/migrations/${name}`, "utf8")
      .replace(/\r\n/g, "\n");
    const checksum = crypto.createHash("sha256").update(sql).digest("hex");
    const existing = await client.query(
      'SELECT "checksum" FROM "SunkaSchemaMigration" WHERE "id"=$1',
      [name],
    );
    if (existing.rows[0]) {
      if (existing.rows[0].checksum !== checksum)
        throw new Error(`Applied migration changed: ${name}`);
      continue;
    }
    await client.query(sql);
    await client.query(
      'INSERT INTO "SunkaSchemaMigration" ("id", "checksum") VALUES ($1,$2)',
      [name, checksum],
    );
    console.log(`Applied PostgreSQL migration: ${name}`);
  }
  await client.query("COMMIT");
  console.log("Hosted database schema is current; existing records preserved.");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
