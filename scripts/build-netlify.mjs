import { spawnSync } from "node:child_process";
import dotenv from "dotenv";
dotenv.config({ path: ".env.netlify", quiet: true });
if (process.env.DATABASE_PROVIDER !== "postgresql")
  throw new Error(
    "The Netlify build requires its persistent PostgreSQL database.",
  );
if (process.env.DEMO_MODE !== "true" || process.env.APP_ENV !== "demo")
  throw new Error("This deployment target is a demonstration sandbox.");
for (const args of [
  ["scripts/generate-postgres.mjs"],
  ["scripts/setup-postgres.mjs"],
  ["node_modules/tsx/dist/cli.mjs", "prisma/seed.ts"],
  ["node_modules/next/dist/bin/next", "build"],
]) {
  const result = spawnSync(process.execPath, args, {
    env: process.env,
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
