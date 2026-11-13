import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import dotenv from "dotenv";
import { hostedEnvironment } from "./hosted-env.mjs";
dotenv.config({ quiet: true });
const { env, databasePath, hostname } = hostedEnvironment();
fs.mkdirSync(path.dirname(databasePath), { recursive: true });
if (!fs.existsSync(databasePath)) fs.closeSync(fs.openSync(databasePath, "a"));
// Persistent disks exist at runtime on Render, not while the build is running.
for (const args of [
  ["node_modules/prisma/build/index.js", "migrate", "deploy"],
  ["node_modules/tsx/dist/cli.mjs", "prisma/seed.ts"],
]) {
  const result = spawnSync(process.execPath, args, { env, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    hostname,
    "--port",
    env.PORT,
  ],
  { env, stdio: "inherit" },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.kill(signal));
server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.on("exit", (code) => process.exit(code ?? 0));
