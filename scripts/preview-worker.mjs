import path from "node:path";
import { spawn } from "node:child_process";
const child = spawn(
  process.execPath,
  [
    "node_modules/wrangler/bin/wrangler.js",
    "dev",
    "--config",
    "dist/server/wrangler.json",
    "--env-file",
    path.resolve(".dev.vars"),
    "--local",
    "--persist-to",
    ".wrangler/commerce",
    "--ip",
    "127.0.0.1",
    "--inspector-port",
    "0",
    "--log-level",
    "warn",
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      WRANGLER_SEND_METRICS: "false",
      CLOUDFLARE_CF_FETCH_ENABLED: "false",
    },
  },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 0));
