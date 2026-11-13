import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next/core-web-vitals";
import ts from "eslint-config-next/typescript";
export default defineConfig([
  ...next,
  ...ts,
  globalIgnores([
    ".next/**",
    "playwright-report/**",
    "playwright-report-worker/**",
    "test-results/**",
    "screenshots/**",
    "next-env.d.ts",
    "dist/**",
    ".wrangler/**",
    ".netlify/**",
    "outputs/**",
    "src/generated/**",
  ]),
]);
