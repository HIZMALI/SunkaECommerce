import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { fileURLToPath } from "node:url";
import { sites } from "./scripts/vite/sites-vite-plugin";
import hosting from "./.openai/hosting.json";
const local = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: "@/lib/db", replacement: local("./src/edge/db.ts") },
      {
        find: "@/lib/mutations",
        replacement: local("./src/edge/mutations.ts"),
      },
      { find: "@", replacement: local("./src") },
    ],
  },
  plugins: [
    vinext(),
    sites({ mockAuth: false }),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
      inspectorPort: false,
      config: {
        name: "sunka-wholesale-studio",
        main: "./worker/index.ts",
        compatibility_date: "2026-11-13",
        compatibility_flags: ["nodejs_compat"],
        d1_databases: [
          {
            binding: hosting.d1,
            database_name: "sunka-demo",
            database_id: "00000000-0000-4000-8000-000000000000",
            migrations_dir: "drizzle",
          },
        ],
        vars: { DEMO_MODE: "true", APP_ENV: "demo", COOKIE_SECURE: "true" },
      },
    }),
  ],
});
