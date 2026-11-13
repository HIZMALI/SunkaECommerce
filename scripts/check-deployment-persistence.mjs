import { chromium, expect } from "@playwright/test";
import fs from "node:fs";
const origin = process.env.TEST_BASE_URL;
const id = process.env.EXISTING_ORDER_ID;
if (!origin || !/^DEMO-[A-Z0-9-]+$/.test(id ?? ""))
  throw new Error("Set TEST_BASE_URL and an existing fictional demo order ID.");
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await page.goto(origin + "/demo-guide?lang=en");
  await page
    .getByRole("button", { name: "Explore Buyer Demo", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Buyer demo active", exact: true }),
  ).toBeVisible();
  await page.goto(origin + "/account/orders/" + id);
  await expect(
    page.getByRole("button", { name: "Start a reorder", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(id, { exact: false }).first()).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Start a reorder", exact: true }),
  ).toBeVisible();
  fs.mkdirSync("screenshots", { recursive: true });
  await page.screenshot({ path: "screenshots/persistence-after-deploy.png" });
  console.log(
    JSON.stringify({
      existingOrderId: id,
      survivesDeployment: true,
      verifiedInFreshBrowser: true,
    }),
  );
} finally {
  await browser.close();
}
