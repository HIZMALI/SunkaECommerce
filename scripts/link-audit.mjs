import { chromium } from "@playwright/test";
const origin = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";
const browser = await chromium.launch();
const page = await browser.newPage();
const links = new Set();
for (const route of [
  "/",
  "/products",
  "/industries",
  "/wholesale",
  "/request-quote",
  "/about",
  "/sustainability",
  "/contact",
  "/faq",
]) {
  await page.goto(origin + route);
  const hrefs = await page
    .locator('a[href^="/"]')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href")));
  hrefs.forEach((h) => links.add(h));
}
const failures = [];
for (const href of links) {
  const response = await page.goto(origin + href);
  if (
    (response?.status()??200) >= 400 ||
    (await page.locator(".standalone-error").count())
  )
    failures.push({ href, status: response?.status()??200 });
}
console.log(JSON.stringify({ checkedInternalLinks: links.size, failures }));
await browser.close();
if (failures.length) process.exitCode = 1;
