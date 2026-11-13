import { chromium } from "@playwright/test";
import fs from "node:fs";
fs.mkdirSync("screenshots", { recursive: true });
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
const browser = await chromium.launch({
  ...(executablePath ? { executablePath } : {}),
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await page.evaluate(async () => {
  for (const img of document.images) img.loading = "eager";
  await Promise.all(
    [...document.images].map((i) => i.decode().catch(() => {})),
  );
  await document.fonts.ready;
});
await page.screenshot({
  path: "screenshots/home-desktop-initial.png",
  fullPage: true,
});
console.log(
  JSON.stringify({
    title: await page.title(),
    errors,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    images: await page.locator("img").evaluateAll((imgs) =>
      imgs.map((i) => ({
        src: i.getAttribute("src")?.slice(0, 90),
        loaded: i.complete && i.naturalWidth > 0,
      })),
    ),
  }),
);
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({
  path: "screenshots/home-mobile-initial.png",
  fullPage: true,
});
console.log(
  "Mobile overflow:",
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
);
await browser.close();
