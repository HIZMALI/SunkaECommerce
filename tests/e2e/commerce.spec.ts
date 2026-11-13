import { test, expect, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
const db = new PrismaClient();
const runtimeErrors = new Map<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});
test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page) ?? []).toEqual([]);
  runtimeErrors.delete(page);
});
async function login(
  page: Page,
  email = "buyer@sunka.demo",
  password = "BuyerDemo!2026",
) {
  await page.goto("/login");
  await page.getByLabel("Business email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(
    email.startsWith("admin") ? /\/admin$/ : /\/account$/,
  );
}
async function capture(page: Page, name: string) {
  await page.evaluate(async () => {
    const images = [...document.images];
    await Promise.all(
      images
        .filter(
          (i) =>
            i.loading !== "lazy" || i.getBoundingClientRect().top < innerHeight,
        )
        .map((i) => i.decode().catch(() => {})),
    );
    await document.fonts.ready;
  });
  fs.mkdirSync("screenshots", { recursive: true });
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: false });
}
test.afterAll(async () => db.$disconnect());
test("home, mega menu, finder, catalog filters, search and accessible quick view", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Engineered",
  );
  await expect(page.locator(".hero-visual img")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".hero-visual img")
        .evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0),
    )
    .toBe(true);
  await capture(page, "home-desktop");
  await page.getByRole("button", { name: "Products", exact: true }).click();
  await expect(page.locator("#product-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#product-menu")).toHaveCount(0);
  const finder = page.locator("#product-finder");
  await finder.locator("select").selectOption("Food & Retail");
  await finder.getByRole("button", { name: "Next step" }).click();
  await finder.locator("select").selectOption("cake-salmon-boards");
  await finder.getByRole("button", { name: "Next step" }).click();
  await finder.locator("select").selectOption("Round");
  await finder.getByRole("button", { name: "Next step" }).click();
  await finder.locator("select").selectOption("Metalised");
  await finder.getByRole("button", { name: "Find my board" }).click();
  await expect(page).toHaveURL(/category=cake-salmon-boards/);
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(21);
  await page.getByLabel("Product family filter").selectOption("cornerboards");
  await expect(page.locator(".product-card")).toHaveCount(7);
  await page.getByLabel("Catalog search").fill("kraft");
  await page.getByLabel("Catalog search").press("Enter");
  await expect(page.locator(".product-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await page.getByLabel("Catalog search").fill("no-such-material");
  await page.getByLabel("Catalog search").press("Enter");
  await expect(
    page.getByRole("heading", { name: "A different combination?" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reset filters", exact: true })
    .click();
  await capture(page, "catalog");
  await page
    .getByRole("button", {
      name: "Quick view: Die Cut Round Boards",
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("dialog").getByRole("link", {
      name: "Sign in for wholesale pricing",
      exact: true,
    }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.getByRole("dialog").getByRole("searchbox").fill("SK-SAMPLE-001");
  await page.getByRole("dialog").getByRole("searchbox").press("Enter");
  await expect(page).toHaveURL(/\/search\?q=SK-SAMPLE-001/);
  await expect(page.locator(".product-card")).toHaveCount(1);
  expect(errors).toEqual([]);
});
test("buyer configures variants, persists cart, checks out, sees account and reorders", async ({
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
  await page.getByLabel("Quantity", { exact: true }).fill("25");
  await expect(
    page.getByRole("button", { name: "Add to wholesale cart", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Quantity", { exact: true }).fill("1000");
  await capture(page, "product");
  await page
    .getByRole("button", { name: "Add to wholesale cart", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page
    .getByLabel("Sample format", { exact: true })
    .selectOption("p01-v1");
  await page
    .getByRole("button", { name: "Add to wholesale cart", exact: true })
    .click();
  await expect(page.getByRole("dialog").locator(".cart-line")).toHaveCount(2);
  await page.getByRole("link", { name: "Review cart", exact: true }).click();
  await page
    .locator(".cart-line")
    .first()
    .getByRole("button", { name: "Increase quantity" })
    .click();
  await expect(
    page.locator(".cart-line").first().locator(".stepper span"),
  ).toHaveText("1050");
  await page.reload();
  await expect(page.locator(".cart-line")).toHaveCount(2);
  await expect(
    page.locator(".cart-line").first().locator(".stepper span"),
  ).toHaveText("1050");
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
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your next move",
  );
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });
  expect(order?.items).toHaveLength(2);
  expect(order?.totalCents).toBe(134650);
  await page
    .getByRole("link", { name: "View your account", exact: true })
    .click();
  await expect(page.getByRole("link").filter({ hasText: id })).toBeVisible();
  await page.getByRole("link").filter({ hasText: id }).click();
  await page
    .getByRole("button", { name: "Start a reorder", exact: true })
    .click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.locator(".cart-line")).toHaveCount(2);
});
test("buyer RFQ persists and administrator updates status and product price", async ({
  page,
}) => {
  await login(page);
  await page.goto("/request-quote?product=Kraft%20(Paper)%20Cornerboard");
  await page.getByLabel("Intended application").fill("QA logistics sample");
  await page
    .getByLabel("Required dimensions (include units)")
    .fill("55 × 55 × 1100 mm");
  await page.getByLabel("Estimated quantity (pieces)").fill("3000");
  await page.getByLabel("Project notes").fill("QA run — fictional project");
  await capture(page, "rfq");
  await page
    .getByRole("button", { name: "Record demo quote request", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your material brief is recorded." }),
  ).toBeVisible();
  const id = (await page.locator(".success-id").innerText()).trim();
  expect(await db.quoteRequest.findUnique({ where: { id } })).toBeTruthy();
  await page.goto("/account");
  await page.getByRole("button", { name: /Quote requests/ }).click();
  await expect(
    page.locator(".quote-record").filter({ hasText: id }),
  ).toBeVisible();
  await login(page, "admin@sunka.demo", "SunkaDemo!2026");
  await capture(page, "admin");
  await page.goto("/admin/quotes");
  const quote = page.locator(".admin-quote").filter({ hasText: id });
  await quote.getByLabel("Quote status").selectOption("IN_REVIEW");
  await quote
    .getByLabel("Demo response (visible in buyer account)")
    .fill("Demo review recorded by QA. No actual offer.");
  await quote.getByRole("button", { name: "Save quote", exact: true }).click();
  await expect(quote.locator(".status")).toHaveText("IN REVIEW");
  await page.reload();
  await expect(
    page.locator(".admin-quote").filter({ hasText: id }).locator(".status"),
  ).toHaveText("IN REVIEW");
  expect((await db.quoteRequest.findUnique({ where: { id } }))?.status).toBe(
    "IN_REVIEW",
  );
  await page.goto("/admin/products");
  const row = page.getByRole("row").filter({ hasText: "SK-SAMPLE-001" });
  await row.getByRole("button", { name: "Edit", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Demo unit price · USD cents").fill("79");
  await dialog.getByRole("button", { name: "Save sample product" }).click();
  await expect(dialog).toHaveCount(0);
  await page.goto("/products/die-cut-round-boards");
  await expect(page.getByTestId("product-total")).toHaveText("$79.00");
  await page.reload();
  await expect(page.getByTestId("product-total")).toHaveText("$79.00");
  expect(
    (await db.product.findUnique({ where: { id: "p01" } }))?.baseCents,
  ).toBe(79);
  await db.product.update({ where: { id: "p01" }, data: { baseCents: 68 } });
});
test("pending approval really controls price access; applications and contact are persistent", async ({
  browser,
}) => {
  const buyer = await browser.newContext();
  const page = await buyer.newPage();
  const email = `qa-${Date.now()}@example.test`;
  await page.goto("/wholesale");
  await page
    .getByLabel("Company name", { exact: true })
    .fill("QA Sample Business");
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
  await expect(
    page.getByRole("heading", { name: "Your account is awaiting approval." }),
  ).toBeVisible();
  const forbidden = await page.request.post("/api/cart/price", {
    data: { items: [{ productId: "p01", variantId: "p01-v1", quantity: 100 }] },
  });
  expect(forbidden.status()).toBe(403);
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Administrator access required." }),
  ).toBeVisible();
  expect(
    (await page.request.post("/api/admin/quote", { data: {} })).status(),
  ).toBe(403);
  const admin = await browser.newPage();
  await login(admin, "admin@sunka.demo", "SunkaDemo!2026");
  await admin.goto("/admin/applications");
  const application = admin
    .locator(".application-panel")
    .filter({ hasText: email });
  await application
    .getByRole("button", { name: "Approve account", exact: true })
    .click();
  await expect(application.locator(".status")).toHaveText("APPROVED");
  await page.goto("/products/die-cut-round-boards");
  await expect(page.getByTestId("product-total")).toHaveText("$68.00");
  expect((await db.user.findUnique({ where: { email } }))?.role).toBe(
    "APPROVED_BUYER",
  );
  await application
    .getByRole("button", { name: "Reject / remove access", exact: true })
    .click();
  await expect(application.locator(".status")).toHaveText("REJECTED");
  await page.reload();
  await expect(page.getByTestId("product-total")).toHaveCount(0);
  await page.goto("/contact");
  await page.getByLabel("Contact name", { exact: true }).fill("QA Contact");
  await page
    .getByLabel("Company name", { exact: true })
    .fill("QA Sample Business");
  await page.getByLabel("Business email", { exact: true }).fill(email);
  await page
    .getByLabel("Your message", { exact: true })
    .fill("A fictional demo message recorded during browser QA.");
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
  await buyer.close();
  await admin.close();
});
test("mobile menu, Turkish navigation, critical pages and all images stay within the viewport", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && /\.(webp|png|jpg)|_next\/image/.test(r.url()))
      errors.push(`Image ${r.status()} ${r.url()}`);
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "All products", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Materials with purpose.",
  );
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Product family filter")
    .selectOption("cake-salmon-boards");
  await page.getByRole("dialog").getByRole("button", { name: /Show:/ }).click();
  await expect(page.locator(".product-card")).toHaveCount(4);
  await page.getByRole("button", { name: "TR", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Amacı olan malzemeler.",
  );
  await page.getByRole("button", { name: "Menüyü aç", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Özel teklif", exact: true })
    .click();
  await expect(page).toHaveURL(/\/request-quote\?lang=tr/);
  await expect(page.getByLabel("Firma adı", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Demo teklif talebini kaydet" }),
  ).toBeVisible();
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/products",
      "/collections/cornerboards",
      "/products/die-cut-round-boards",
      "/cart",
      "/checkout",
      "/request-quote",
      "/wholesale",
      "/contact",
      "/about",
      "/sustainability",
      "/industries",
      "/industries/food-retail",
      "/faq",
    ]) {
      const res = await page.goto(route + "?lang=tr");
      expect(res?.status(), route).toBe(200);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        `${route} overflow ${width}`,
      ).toBe(false);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=en");
  await capture(page, "home-mobile");
  await page.evaluate(async () => {
    for (const image of document.images) {
      image.loading = "eager";
    }
    await Promise.all(
      [...document.images].map((i) => i.decode().catch(() => {})),
    );
  });
  expect(
    await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs
          .filter(
            (i) =>
              !(i as HTMLImageElement).complete ||
              (i as HTMLImageElement).naturalWidth === 0,
          )
          .map((i) => (i as HTMLImageElement).src),
      ),
  ).toEqual([]);
  expect(errors).toEqual([]);
});
