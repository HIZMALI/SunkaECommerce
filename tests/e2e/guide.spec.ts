import { test, expect } from "@playwright/test";

test("customer guide opens the buyer workflow in both languages without mobile overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/demo-guide");
  await expect(
    page.getByRole("heading", { name: "Take a look around." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Explore Buyer Demo", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Buyer demo active", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Configure a board", exact: true })
    .click();
  await expect(page).toHaveURL(/\/products\/die-cut-round-boards$/);
  await expect(
    page.getByRole("button", { name: "Add to cart", exact: true }),
  ).toBeVisible();
  await page.goto("/demo-guide?lang=tr");
  await expect(
    page.getByRole("heading", { name: "Deneyerek keşfedin." }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("button", { name: "Müşteri demosu açık", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  expect(errors).toEqual([]);
});
