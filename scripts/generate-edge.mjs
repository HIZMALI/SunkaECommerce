import fs from "node:fs";
import { spawnSync } from "node:child_process";
const schema = fs.readFileSync("prisma/schema.prisma", "utf8").replace(
  /generator client \{[\s\S]*?\}/,
  `generator client {
  provider = "prisma-client"
  output = "../src/generated/worker"
  engineType = "client"
  runtime = "workerd"
  moduleFormat = "esm"
}`,
);
fs.writeFileSync("prisma/edge.prisma", schema);
const result = spawnSync(
  process.execPath,
  [
    "node_modules/prisma/build/index.js",
    "generate",
    "--schema",
    "prisma/edge.prisma",
  ],
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
