import { test, expect } from "@playwright/test";
const capturePrefix = process.env.WORKER_BASE_URL?.startsWith("https:")
  ? "hosted"
  : "worker";
test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

test("Worker: mobile buyer uses touch controls, pack multiples and the complete purchase-order flow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/wholesale?lang=tr");
  await page
    .getByRole("button", { name: "Demo başvurusunu kaydet", exact: true })
    .tap();
  expect(
    await page
      .getByLabel("Firma adı", { exact: true })
      .evaluate((element) => (element as HTMLInputElement).validationMessage),
  ).toBe("Lütfen bu alanı doldurun.");
  await page.goto("/login?lang=en");
  await page
    .getByLabel("Business email", { exact: true })
    .fill("buyer@sunka.demo");
  await page.getByLabel("Password", { exact: true }).fill("BuyerDemo!2026");
  await page.getByRole("button", { name: "Sign in", exact: true }).tap();
  await expect(page).toHaveURL(/\/account$/);
  await page.goto("/products/die-cut-round-boards");
  await page
    .getByLabel("Sample surface / color", { exact: true })
    .selectOption("Black");
  await expect(
    page.getByLabel("Sample pack size", { exact: true }),
  ).toHaveValue("100");
  await page.getByLabel("Quantity", { exact: true }).fill("200");
  await expect(page.getByTestId("product-total")).toHaveText("$156.00");
  await page.locator(".configuration-fields").scrollIntoViewIfNeeded();
  expect(
    await page.locator(".add-to-cart").evaluate((button) => {
      const box = button.getBoundingClientRect();
      return [box.left + 16, box.right - 16].every((x) =>
        button.contains(document.elementFromPoint(x, box.top + box.height / 2)),
      );
    }),
  ).toBe(true);
  await page.screenshot({
    path: `screenshots/${capturePrefix}-product-mobile-buyer.png`,
  });
  await page
    .getByRole("button", { name: "Add to wholesale cart", exact: true })
    .tap();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Review cart", exact: true })
    .tap();
  await page
    .getByRole("button", { name: "Increase quantity", exact: true })
    .tap();
  await expect(page.locator(".cart-line .stepper span")).toHaveText("300");
  await page.reload();
  await expect(page.locator(".cart-line .stepper span")).toHaveText("300");
  await page
    .getByRole("link", { name: "Continue to demo checkout", exact: true })
    .tap();
  await expect(
    page.getByRole("button", { name: "Record demo order", exact: true }),
  ).toBeEnabled();
  await page
    .getByLabel("Purchase order reference / notes", { exact: true })
    .fill("QA mobile touch checkout — fictional demonstration");
  await page
    .getByRole("button", { name: "Record demo order", exact: true })
    .tap();
  await expect(page).toHaveURL(/\/order-success\/DEMO-/);
  const id = page.url().split("/").pop()!;
  await expect(
    page.getByRole("heading", { name: "Your next move, recorded." }),
  ).toBeVisible();
  await page.screenshot({
    path: `screenshots/${capturePrefix}-order-success-mobile.png`,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await page.goto(`/account/orders/${id}`);
  await expect(page.getByText(id, { exact: false }).first()).toBeVisible();
  await expect(
    page.getByText("$234.00", { exact: true }).first(),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
