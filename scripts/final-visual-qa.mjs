import { chromium } from "@playwright/test";
import fs from "node:fs";
const origin = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";
fs.mkdirSync("screenshots", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("response", (r) => {
  if (r.status() >= 400 && /\.(png|webp|jpg)|_next\/image/.test(r.url()))
    errors.push(`Image error ${r.status()} ${r.url()}`);
});
async function loadImages() {
  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(async (element) => {
      const img = element;
      await img.decode().catch(() => {});
    });
  }
  await page.evaluate(async () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    await document.fonts.ready;
  });
}
async function capture(route, name, fullPage = false) {
  await page.goto(origin + route);
  await page.getByRole("button", { name: "TR", exact: true }).waitFor();
  await loadImages();
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage });
  const broken = await page
    .locator("img")
    .evaluateAll((images) =>
      images.filter((i) => i.complete && !i.naturalWidth).map((i) => i.src),
    );
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  if (broken.length || overflow)
    throw new Error(`${route}: ${JSON.stringify({ broken, overflow })}`);
}
await capture("/?lang=en", "home-desktop");
await capture("/?lang=en", "home-desktop-full", true);
await page.setViewportSize({ width: 390, height: 844 });
await capture("/?lang=en", "home-mobile");
await capture("/?lang=en", "home-mobile-full", true);
await capture("/products?lang=en", "catalog-mobile");
await capture("/products/die-cut-round-boards?lang=en", "product-mobile");
await capture("/request-quote?lang=en", "rfq-mobile");
await page.setViewportSize({ width: 1440, height: 900 });
await capture("/products?lang=en", "catalog");
await capture("/collections/cake-salmon-boards?lang=en", "collection");
await page.goto(origin + "/login");
await page
  .getByLabel("Business email", { exact: true })
  .fill("buyer@sunka.demo");
await page.getByLabel("Password", { exact: true }).fill("BuyerDemo!2026");
await page.getByRole("button", { name: "Sign in", exact: true }).click();
await page.waitForURL("**/account");
await capture("/products/die-cut-round-boards", "product");
await page
  .getByRole("button", { name: "Add to wholesale cart", exact: true })
  .click();
await page
  .getByRole("dialog")
  .getByRole("link", { name: "Review cart", exact: true })
  .click();
await capture("/cart", "cart");
await capture("/checkout", "checkout");
await capture("/request-quote?product=Kraft%20(Paper)%20Cornerboard", "rfq");
await capture("/account", "account");
await page.setViewportSize({ width: 390, height: 844 });
await capture("/cart", "cart-mobile");
await capture("/checkout", "checkout-mobile");
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(origin + "/login");
await page
  .getByLabel("Business email", { exact: true })
  .fill("admin@sunka.demo");
await page.getByLabel("Password", { exact: true }).fill("SunkaDemo!2026");
await page.getByRole("button", { name: "Sign in", exact: true }).click();
await page.waitForURL("**/admin");
await capture("/admin", "admin");
await page.setViewportSize({ width: 390, height: 844 });
await capture("/admin", "admin-mobile");
await browser.close();
console.log(JSON.stringify({ screenshots: "screenshots/", errors }));
if (errors.length) process.exitCode = 1;
