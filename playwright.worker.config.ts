import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: ["e2e/commerce.spec.ts", "e2e/guide.spec.ts", "worker/*.spec.ts"],
  grep: /home, mega menu|mobile menu, Turkish|customer guide|Worker:/,
  workers: 1,
  fullyParallel: false,
  timeout: 120000,
  expect: { timeout: 15000 },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report-worker", open: "never" }],
  ],
  use: {
    ...devices["Desktop Chrome"],
    viewport: { width: 1440, height: 900 },
    baseURL: process.env.WORKER_BASE_URL ?? "http://127.0.0.1:8787",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: process.env.WORKER_BASE_URL
    ? undefined
    : {
        command: "npm run start:site",
        url: "http://127.0.0.1:8787/api/health",
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
});
