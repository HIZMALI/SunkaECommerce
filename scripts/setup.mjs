import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import dotenv from "dotenv";
if (!fs.existsSync(".env")) fs.copyFileSync(".env.example", ".env");
dotenv.config({ quiet: true });
if (process.env.DATABASE_URL?.startsWith("file:")) {
  const databasePath = path.resolve(
    "prisma",
    process.env.DATABASE_URL.slice(5),
  );
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  if (!fs.existsSync(databasePath))
    fs.closeSync(fs.openSync(databasePath, "a"));
}
for (const args of [
  ["prisma", "generate"],
  ["prisma", "migrate", "deploy"],
  ["tsx", "prisma/seed.ts"],
]) {
  const result = spawnSync(
    process.execPath,
    [
      args[0] === "prisma"
        ? "node_modules/prisma/build/index.js"
        : "node_modules/tsx/dist/cli.mjs",
      ...args.slice(1),
    ],
    { stdio: "inherit", env: process.env },
  );
  if (result.status !== 0) process.exit(result.status || 1);
}
