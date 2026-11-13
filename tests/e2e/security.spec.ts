import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
const db = new PrismaClient();
test.afterAll(() => db.$disconnect());
test("server rejects anonymous admin access, cross-origin requests and invalid wholesale quantities", async ({
  page,
}) => {
  expect(
    (await page.request.post("/api/admin/product", { data: {} })).status(),
  ).toBe(403);
  expect(
    (
      await page.request.post("/api/cart/price", {
        data: {
          items: [{ productId: "p01", variantId: "p01-v1", quantity: 100 }],
        },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await page.request.post("/api/auth/demo", {
        headers: { origin: "https://untrusted.example" },
        data: {},
      })
    ).status(),
  ).toBe(403);
  await page.goto("/login");
  await page
    .getByLabel("Business email", { exact: true })
    .fill("buyer@sunka.demo");
  await page.getByLabel("Password", { exact: true }).fill("BuyerDemo!2026");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/account$/);
  const session = (await page.context().cookies()).find(
    (c) => c.name === "sunka_session",
  );
  expect(session?.httpOnly).toBe(true);
  expect(session?.sameSite).toBe("Lax");
  expect(session?.value).toMatch(/^[a-f0-9]{64}$/);
  for (const item of [
    { productId: "p01", variantId: "p01-v1", quantity: 25 },
    { productId: "p01", variantId: "p01-v1", quantity: 125 },
    { productId: "p01", variantId: "p01-v1", quantity: 10050 },
    { productId: "p01", variantId: "p01-v3", quantity: 150 },
    { productId: "p07", variantId: "p07-v1", quantity: 100 },
    { productId: "p02", variantId: "p01-v1", quantity: 100 },
  ])
    expect(
      (
        await page.request.post("/api/cart/price", { data: { items: [item] } })
      ).status(),
    ).toBe(400);
  const duplicate = { productId: "p01", variantId: "p01-v1", quantity: 100 };
  expect(
    (
      await page.request.post("/api/cart/price", {
        data: { items: [duplicate, duplicate] },
      })
    ).status(),
  ).toBe(400);
  const key = randomUUID();
  const data = {
    items: [
      {
        productId: "p01",
        variantId: "p01-v1",
        quantity: 100,
        unitCents: 1,
        totalCents: 1,
      },
    ],
    company: "QA Sample Company",
    name: "QA Buyer",
    email: "buyer@sunka.demo",
    phone: "+1 555 010 2026",
    country: "United States",
    shippingAddress: "100 QA Sample Avenue (fictional)",
    billingAddress: "100 QA Sample Avenue (fictional)",
    notes: "QA server price and idempotency check",
    idempotencyKey: key,
    totalCents: 1,
  };
  const first = await page.request.post("/api/orders", { data });
  expect(first.status()).toBe(201);
  const { id } = await first.json();
  const second = await page.request.post("/api/orders", { data });
  expect(second.status()).toBe(200);
  expect((await second.json()).id).toBe(id);
  expect(await db.order.count({ where: { idempotencyKey: key } })).toBe(1);
  expect((await db.order.findUnique({ where: { id } }))?.totalCents).toBe(6800);
  await page.goto("/account");
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Good to have you here." }),
  ).toBeVisible();
  expect(
    (await page.context().cookies()).some((c) => c.name === "sunka_session"),
  ).toBe(false);
  expect((await page.request.post("/api/orders", { data })).status()).toBe(403);
});
test("admin order status, profile edits, image catalog and localized SSR are persistent and error free", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/login");
  await page
    .getByLabel("Business email", { exact: true })
    .fill("admin@sunka.demo");
  await page.getByLabel("Password", { exact: true }).fill("SunkaDemo!2026");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto("/admin/orders");
  const selector = page.getByLabel("Order status DEMO-2026-0001", {
    exact: true,
  });
  await selector.selectOption("CONFIRMED");
  await expect(selector).toHaveValue("CONFIRMED");
  await expect
    .poll(
      async () =>
        (await db.order.findUnique({ where: { id: "DEMO-2026-0001" } }))
          ?.status,
    )
    .toBe("CONFIRMED");
  await page.reload();
  await expect(
    page.getByLabel("Order status DEMO-2026-0001", { exact: true }),
  ).toHaveValue("CONFIRMED");
  await db.order.update({
    where: { id: "DEMO-2026-0001" },
    data: { status: "RECORDED" },
  });
  await page.goto("/products/die-cut-round-boards");
  await page
    .getByLabel("Sample shape / profile", { exact: true })
    .selectOption("Square");
  await expect(page.getByLabel("Sample format", { exact: true })).toHaveValue(
    "p01-v4",
  );
  await page
    .getByLabel("Sample surface / color", { exact: true })
    .selectOption("Black");
  await expect(
    page.getByLabel("Sample pack size", { exact: true }),
  ).toHaveValue("100");
  await page.getByLabel("Quantity", { exact: true }).fill("150");
  await expect(
    page.getByRole("button", { name: "Add to wholesale cart", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Quantity", { exact: true }).fill("200");
  await expect(
    page.getByRole("button", { name: "Add to wholesale cart", exact: true }),
  ).toBeEnabled();
  await page.goto("/account");
  await page
    .getByRole("button", { name: "Company profile", exact: true })
    .click();
  const company = (
    await db.user.findUniqueOrThrow({
      where: { email: "admin@sunka.demo" },
      include: { company: true },
    })
  ).company!;
  await page
    .getByLabel("Address", { exact: true })
    .fill("200 QA Sample Avenue, Fictional City");
  await page
    .getByRole("button", { name: "Save company profile", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Company profile saved." }),
  ).toBeVisible();
  await page.reload();
  await page
    .getByRole("button", { name: "Company profile", exact: true })
    .click();
  await expect(page.getByLabel("Address", { exact: true })).toHaveValue(
    "200 QA Sample Avenue, Fictional City",
  );
  await db.company.update({
    where: { id: company.id },
    data: { address: company.address },
  });
  await page.goto("/products?lang=tr");
  await expect(
    page.getByLabel("Ürün ailesi filtresi", { exact: true }),
  ).toBeEnabled();
  await expect(page.locator("html")).toHaveAttribute("lang", "tr");
  expect(await page.title()).toContain("Malzeme koleksiyonu");
  await page.evaluate(async () => {
    for (const image of document.images) image.loading = "eager";
    await Promise.all(
      [...document.images].map((i) => i.decode().catch(() => {})),
    );
  });
  expect(
    await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs
          .filter((i) => !(i as HTMLImageElement).naturalWidth)
          .map((i) => (i as HTMLImageElement).src),
      ),
  ).toEqual([]);
  const raw = await (await page.request.get("/?lang=tr")).text();
  expect(raw).toContain('lang="tr"');
  expect(raw).not.toContain("passwordHash");
  expect(errors).toEqual([]);
});
