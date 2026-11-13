import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";

// Disposable integration database; never touches the presentation database.
const filename = `hosted-verification-${Date.now()}.db`;
const databasePath = path.resolve("prisma", filename);
const origin = "http://127.0.0.1:3001";
const adminPassword = randomBytes(24).toString("hex");
const env = {
  ...process.env,
  PORT: "3001",
  BIND_HOST: "127.0.0.1",
  APP_URL: origin,
  DATABASE_URL: `file:./${filename}`,
  NODE_ENV: "production",
  APP_ENV: "demo",
  DEMO_MODE: "true",
  ALLOW_HOSTED_DEMO_SEED: "true",
  DEMO_ADMIN_PASSWORD: adminPassword,
};
const client = new PrismaClient({ datasourceUrl: env.DATABASE_URL });
let server;
let output = "";
async function boot() {
  output = "";
  server = spawn(process.execPath, ["scripts/start-hosted.mjs"], {
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (data) => {
    output += data;
  });
  server.stderr.on("data", (data) => {
    output += data;
  });
  for (let n = 0; n < 90; n++) {
    if (server.exitCode !== null)
      throw new Error(`Hosted startup exited: ${output}`);
    try {
      const health = await fetch(origin + "/api/health");
      if (health.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Hosted startup timed out: ${output}`);
}
async function stop() {
  if (!server || server.exitCode !== null) return;
  if (process.platform === "win32")
    spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], {
      stdio: "ignore",
    });
  else server.kill("SIGTERM");
  await new Promise((resolve) => {
    if (server.exitCode !== null) resolve();
    else server.once("exit", resolve);
  });
}
async function login(password) {
  return fetch(origin + "/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify({ email: "admin@sunka.demo", password }),
  });
}
try {
  await boot();
  assert.equal(await client.product.count(), 21);
  assert.equal(await client.user.count(), 3);
  assert.equal(
    (await login("SunkaDemo!2026")).ok,
    false,
    "Local admin password must not work on hosted sandbox",
  );
  const authenticated = await login(adminPassword);
  assert.equal(authenticated.ok, true);
  assert.match(authenticated.headers.get("set-cookie"), /HttpOnly/i);
  await client.contactSubmission.create({
    data: {
      company: "Hosted verification (fictional)",
      name: "QA Sample",
      email: "hosted-qa@example.test",
      message: "Restart persistence verification only.",
    },
  });
  await stop();
  await boot();
  assert.equal(
    await client.contactSubmission.count({
      where: { email: "hosted-qa@example.test" },
    }),
    1,
  );
  assert.equal(
    await client.user.count(),
    3,
    "Restart must not duplicate identities",
  );
  assert.equal((await login(adminPassword)).ok, true);
  assert.equal((await fetch(origin + "/demo-guide")).status, 200);
  console.log(
    "Hosted startup passed: migrations, guarded sample seed, separate admin password, HTTP-only session, health, guide and restart persistence.",
  );
} finally {
  await stop();
  await client.$disconnect();
  for (const suffix of ["", "-journal", "-wal", "-shm"])
    if (fs.existsSync(databasePath + suffix))
      fs.unlinkSync(databasePath + suffix);
}
