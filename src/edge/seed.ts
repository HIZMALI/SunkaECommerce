import { hashPassword } from "../lib/auth";
import dataset from "./seed-data.json";

type SeedEnv = {
  DB: D1Database;
  DEMO_ADMIN_PASSWORD?: string;
  DEMO_MODE?: string;
  APP_ENV?: string;
};
let initialized: Promise<void> | undefined;
export async function ensureSeed(env: SeedEnv) {
  initialized ??= seed(env).catch((error) => {
    initialized = undefined;
    throw error;
  });
  return initialized;
}
async function seed(env: SeedEnv) {
  if (env.DEMO_MODE !== "true" || env.APP_ENV !== "demo")
    throw new Error(
      "This hosted sandbox requires explicit demo environment flags.",
    );
  const marker = await env.DB.prepare('SELECT id FROM "SeedState" WHERE id=?')
    .bind("sunka-sample-v1")
    .first();
  if (marker) return;
  if (!env.DEMO_ADMIN_PASSWORD || env.DEMO_ADMIN_PASSWORD.length < 20)
    throw new Error(
      "The hosted demo requires a separate administrator secret.",
    );
  const adminHash = hashPassword(env.DEMO_ADMIN_PASSWORD);
  const statements: D1PreparedStatement[] = [];
  for (const [table, records] of dataset as [
    string,
    Record<string, string | number | boolean | null>[],
  ][]) {
    const columns = Object.keys(records[0]);
    // Stay below D1's 100 bound-parameter limit, including larger product rows.
    const groupSize = Math.max(1, Math.floor(90 / columns.length));
    for (let offset = 0; offset < records.length; offset += groupSize) {
      const group = records
        .slice(offset, offset + groupSize)
        .map((original) => {
          const row = { ...original };
          if (table === "User" && row.email === "admin@sunka.demo")
            row.passwordHash = adminHash;
          return row;
        });
      statements.push(
        env.DB.prepare(
          `INSERT OR IGNORE INTO "${table}" (${columns.map((c) => `"${c}"`).join(",")}) VALUES ${group.map(() => `(${columns.map(() => "?").join(",")})`).join(",")}`,
        ).bind(
          ...group
            .flatMap((row) => columns.map((c) => row[c]))
            .map((v) => (typeof v === "boolean" ? Number(v) : v)),
        ),
      );
    }
  }
  // Immutable sample IDs and INSERT OR IGNORE make concurrent first requests/retries safe.
  for (let offset = 0; offset < statements.length; offset += 40)
    await env.DB.batch(statements.slice(offset, offset + 40));
  await env.DB.prepare(
    'INSERT OR IGNORE INTO "SeedState" (id, appliedAt) VALUES (?,?)',
  )
    .bind("sunka-sample-v1", new Date().toISOString())
    .run();
}
