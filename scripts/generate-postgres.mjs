import fs from "node:fs";
import { spawnSync } from "node:child_process";

// Derive the hosted schema from the same model definitions as local SQLite.
const schema = fs
  .readFileSync("prisma/schema.prisma", "utf8")
  .replace(
    /generator client \{[\s\S]*?\}/,
    `generator client {
  provider = "prisma-client"
  output = "../src/generated/postgres"
  engineType = "client"
  runtime = "nodejs"
  moduleFormat = "esm"
}`,
  )
  .replace('provider = "sqlite"', 'provider = "postgresql"');
fs.writeFileSync("prisma/postgres.prisma", schema);
const result = spawnSync(
  process.execPath,
  [
    "node_modules/prisma/build/index.js",
    "generate",
    "--schema",
    "prisma/postgres.prisma",
  ],
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
