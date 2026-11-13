import fs from "node:fs";
import { spawnSync } from "node:child_process";
if (!fs.existsSync(".dev.vars"))
  fs.copyFileSync(".dev.vars.example", ".dev.vars");
const result = spawnSync(
  process.execPath,
  [
    "node_modules/wrangler/bin/wrangler.js",
    "d1",
    "migrations",
    "apply",
    "DB",
    "--local",
    "--config",
    "dist/server/wrangler.json",
    "--persist-to",
    ".wrangler/commerce",
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      CI: "true",
      WRANGLER_SEND_METRICS: "false",
      CLOUDFLARE_CF_FETCH_ENABLED: "false",
    },
  },
);
process.exit(result.status ?? 1);
