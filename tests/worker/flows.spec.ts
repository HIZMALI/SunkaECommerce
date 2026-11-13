import { test, expect, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";
const adminPassword =
  process.env.WORKER_ADMIN_PASSWORD ?? "Local-Worker-Demo-Admin!2026";
const errors = new Map<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const list: string[] = [];
  errors.set(page, list);
  page.on("pageerror", (e) => list.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") list.push(m.text());
  });
});
test.afterEach(async ({ page }) => {
  expect(errors.get(page)).toEqual([]);
  errors.delete(page);
});
async function login(page: Page, admin = false) {
  await page.goto("/login?lang=en");
  await page
    .getByLabel("Business email", { exact: true })
    .fill(admin ? "admin@sunka.demo" : "buyer@sunka.demo");
  await page
    .getByLabel("Password", { exact: true })
    .fill(admin ? adminPassword : "BuyerDemo!2026");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(admin ? /\/admin$/ : /\/account$/);
  await expect(
    page.locator(admin ? ".admin-shell" : ".account-page"),
  ).toBeVisible();
}
async function capture(page: Page, name: string) {
  for (const img of await page.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate(async (el) =>
      (el as HTMLImageElement).decode().catch(() => {}),
    );
  }
  await page.evaluate(async () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    await document.fonts.ready;
  });
  await page.screenshot({ path: `screenshots/worker-${name}.png` });
}

test("Worker: buyer configures, persists cart, records an order and reorders", async ({
  page,
}) => {
  await login(page);
  await page.goto("/products/die-cut-round-boards");
  await expect(page.getByTestId("product-total")).toHaveText("$68.00");
  await page
    .getByLabel("Sample format", { exact: true })
    .selectOption("p01-v2");
  await expect(page.getByTestId("product-total")).toHaveText("$86.00");
  await page.locator(".pricing-tiers button").last().click();
  await expect(page.getByTestId("product-total")).toHaveText("$730.00");
  await capture(page, "product");
  await page
    .getByRole("button", { name: "Add to wholesale cart", exact: true })
    .click();
  await page.getByRole("link", { name: "Review cart", exact: true }).click();
  await page
    .getByRole("button", { name: "Increase quantity", exact: true })
    .click();
  await page.reload();
  await expect(page.locator(".cart-line .stepper span")).toHaveText("1050");
  await capture(page, "cart");
  await page
    .getByRole("link", { name: "Continue to demo checkout", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Record demo order", exact: true }),
  ).toBeEnabled();
  await capture(page, "checkout");
  await page
    .getByRole("button", { name: "Record demo order", exact: true })
    .click();
  await expect(page).toHaveURL(/\/order-success\/DEMO-/);
  const id = new URL(page.url()).pathname.split("/").pop()!;
  await page
    .getByRole("link", { name: "View your account", exact: true })
    .click();
  const order = page.getByRole("link").filter({ hasText: id });
  await expect(order).toBeVisible();
  await order.click();
  await expect(page).toHaveURL(new RegExp(`/account/orders/${id}$`));
  await expect(
    page.getByRole("button", { name: "Start a reorder", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByText(id, { exact: false }).first()).toBeVisible();
  await page
    .getByRole("button", { name: "Start a reorder", exact: true })
    .click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.locator(".cart-line")).toHaveCount(1);
  await login(page, true);
  await page.goto("/admin/orders");
  const status = page.getByLabel(`Order status ${id}`, { exact: true });
  await status.selectOption("IN_REVIEW");
  await expect(
    page.getByRole("status").filter({ hasText: "Saved." }),
  ).toBeVisible();
  await page.reload();
  await expect(status).toHaveValue("IN_REVIEW");
});

test("Worker: RFQ and admin product edits persist across refresh", async ({
  page,
}) => {
  await login(page);
  await page.goto("/request-quote?product=Kraft%20(Paper)%20Cornerboard");
  await page
    .getByLabel("Intended application")
    .fill("Hosted QA fictional logistics sample");
  await page
    .getByLabel("Required dimensions (include units)")
    .fill("55 × 55 × 1100 mm");
  await page.getByLabel("Estimated quantity (pieces)").fill("3000");
  await page
    .getByLabel("Project notes")
    .fill("QA only, no commercial enquiry.");
  await capture(page, "rfq");
  await page
    .getByRole("button", { name: "Record demo quote request", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your material brief is recorded." }),
  ).toBeVisible();
  const id = (await page.locator(".success-id").innerText()).trim();
  await login(page, true);
  await capture(page, "admin");
  await page.goto("/admin/quotes");
  const quote = page.locator(".admin-quote").filter({ hasText: id });
  await quote.getByLabel("Quote status").selectOption("IN_REVIEW");
  await quote
    .getByLabel("Demo response (visible in buyer account)")
    .fill("Demo review only — no commercial offer.");
  await quote.getByRole("button", { name: "Save quote", exact: true }).click();
  await expect(quote.locator(".status")).toHaveText("IN REVIEW");
  await page.reload();
  await expect(quote.locator(".status")).toHaveText("IN REVIEW");
  async function price(value: string) {
    await page.goto("/admin/products");
    await page
      .getByRole("row")
      .filter({ hasText: "SK-SAMPLE-001" })
      .getByRole("button", { name: "Edit", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Demo unit price · USD cents").fill(value);
    await dialog.getByRole("button", { name: "Save sample product" }).click();
    await expect(dialog).toHaveCount(0);
  }
  try {
    await price("79");
    await page.goto("/products/die-cut-round-boards");
    await page.reload();
    await expect(page.getByTestId("product-total")).toHaveText("$79.00");
  } finally {
    await price("68");
  }
  await login(page);
  await page.goto("/account");
  await page.getByRole("button", { name: /Quote requests/ }).click();
  await expect(
    page.locator(".quote-record").filter({ hasText: id }),
  ).toContainText("Demo review only");
});

test("Worker: new wholesale account approval changes price authorization", async ({
  page,
  browser,
}) => {
  const email = `worker-qa-${Date.now()}@example.test`;
  await page.goto("/wholesale");
  await page
    .getByLabel("Company name", { exact: true })
    .fill("Hosted QA Fictional Company");
  await page.getByLabel("Contact name", { exact: true }).fill("Sample Buyer");
  await page.getByLabel("Business email", { exact: true }).fill(email);
  await page
    .getByLabel("Phone number", { exact: true })
    .fill("+1 555 010 0099");
  await page
    .getByLabel("Destination country", { exact: true })
    .fill("United States");
  await page
    .getByLabel("Business type", { exact: true })
    .selectOption("Distributor");
  await page
    .getByLabel("Estimated monthly volume", { exact: true })
    .selectOption("1000–5000 pcs");
  await page
    .getByLabel("Materials of interest", { exact: true })
    .fill("Cake boards");
  await page.getByLabel(/Create a password/).fill("SampleBuyer!2026");
  await page
    .getByRole("button", { name: "Record demo application", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your demo application was recorded." }),
  ).toBeVisible();
  await page.goto("/products/die-cut-round-boards");
  await expect(page.getByTestId("product-total")).toHaveCount(0);
  const denied = await page.request.post("/api/cart/price", {
    data: { items: [{ productId: "p01", variantId: "p01-v1", quantity: 100 }] },
  });
  expect(denied.status()).toBe(403);
  const admin = await browser.newPage();
  try {
    await login(admin, true);
    await admin.goto("/admin/applications");
    const row = admin.locator(".application-panel").filter({ hasText: email });
    await row
      .getByRole("button", { name: "Approve account", exact: true })
      .click();
    await expect(row.locator(".status")).toHaveText("APPROVED");
    await page.reload();
    await expect(page.getByTestId("product-total")).toHaveText("$68.00");
    await admin.reload();
    await expect(row.locator(".status")).toHaveText("APPROVED");
    await row
      .getByRole("button", { name: "Reject / remove access", exact: true })
      .click();
    await expect(row.locator(".status")).toHaveText("REJECTED");
    await page.reload();
    await expect(page.getByTestId("product-total")).toHaveCount(0);
    await page.goto("/contact");
    await page.getByLabel("Contact name", { exact: true }).fill("Hosted QA");
    await page
      .getByLabel("Company name", { exact: true })
      .fill("Fictional Sample Company");
    await page.getByLabel("Business email", { exact: true }).fill(email);
    await page
      .getByLabel("Your message", { exact: true })
      .fill("A fictional message for hosted persistence QA only.");
    await page
      .getByRole("button", { name: "Record demo message", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Your demo message was recorded." }),
    ).toBeVisible();
    await admin.goto("/admin/messages");
    await expect(
      admin.locator(".message-panel").filter({ hasText: email }),
    ).toBeVisible();
  } finally {
    await admin.close();
  }
});

test("Worker: authorization, quantity rejection, server repricing and idempotency", async ({
  page,
}) => {
  expect(
    (await page.request.post("/api/admin/product", { data: {} })).status(),
  ).toBe(403);
  expect(
    (
      await page.request.post("/api/auth/demo", {
        headers: { origin: "https://untrusted.example" },
        data: {},
      })
    ).status(),
  ).toBe(403);
  await login(page);
  const cookie = (await page.context().cookies()).find(
    (c) => c.name === "sunka_session",
  );
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe("Lax");
  if (page.url().startsWith("https:")) expect(cookie?.secure).toBe(true);
  for (const quantity of [25, 125, 10050])
    expect(
      (
        await page.request.post("/api/cart/price", {
          data: {
            items: [{ productId: "p01", variantId: "p01-v1", quantity }],
          },
        })
      ).status(),
    ).toBe(400);
  const body = {
    items: [
      { productId: "p01", variantId: "p01-v1", quantity: 100, unitCents: 1 },
    ],
    company: "Hosted QA Fictional Company",
    name: "Sample Buyer",
    email: "buyer@sunka.demo",
    phone: "+1 555 010 2026",
    country: "United States",
    shippingAddress: "100 Fictional Sample Avenue",
    billingAddress: "100 Fictional Sample Avenue",
    notes: "Hosted QA idempotency check only.",
    idempotencyKey: randomUUID(),
    totalCents: 1,
  };
  const first = await page.request.post("/api/orders", { data: body });
  expect(first.status()).toBe(201);
  const id = (await first.json()).id as string;
  const repeat = await page.request.post("/api/orders", { data: body });
  expect(repeat.status()).toBe(200);
  expect((await repeat.json()).id).toBe(id);
  await page.goto(`/account/orders/${id}`);
  await expect(page.getByText("$68.00", { exact: true }).first()).toBeVisible();
  await page.goto("/account");
  const [logout] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/auth/logout") &&
        response.request().method() === "POST",
    ),
    page.getByRole("button", { name: "Sign out", exact: true }).click(),
  ]);
  expect(logout.ok()).toBe(true);
  await expect(
    page.getByRole("heading", { name: "Good to have you here." }),
  ).toBeVisible();
  expect(
    (await page.context().cookies()).some((c) => c.name === "sunka_session"),
  ).toBe(false);
  expect(
    (await page.request.post("/api/orders", { data: body })).status(),
  ).toBe(403);
});
