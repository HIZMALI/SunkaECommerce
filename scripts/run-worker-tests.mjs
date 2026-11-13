import { spawn } from "node:child_process";
process.stdout.write(
  "Ready for worker test settings on stdin (input is hidden).\n",
);
if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.stdin.resume();
let input = "";
process.stdin.on("data", (chunk) => {
  input += chunk.toString();
  if (!input.includes("\n") && !input.includes("\r")) return;
  process.stdin.removeAllListeners("data");
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  process.stdin.pause();
  let settings;
  try {
    settings = JSON.parse(input.trim());
  } catch {
    console.error("Invalid test settings.");
    process.exit(1);
  }
  const child = spawn(
    process.execPath,
    [
      "node_modules/@playwright/test/cli.js",
      "test",
      "--config",
      "playwright.worker.config.ts",
    ],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        WORKER_BASE_URL: settings.origin,
        WORKER_ADMIN_PASSWORD: settings.adminPassword,
      },
    },
  );
  child.on("exit", (code) => process.exit(code ?? 1));
});
