import { randomUUID } from "node:crypto";
import { binding, db } from "./db";
import { reprice } from "../lib/catalog";
import { hashPassword } from "../lib/auth";
import type { CartLine } from "../lib/types";
import type { OrderInput, ApplicationInput } from "../lib/mutations";
import type { Prisma } from "@prisma/client";

type Value = string | number | null;
export function insert(
  table: string,
  data: Record<string, Value>,
  ignore = false,
) {
  // Table and column names come only from authored schema code, never HTTP input.
  const columns = Object.keys(data);
  return binding()
    .prepare(
      `INSERT ${ignore ? "OR IGNORE " : ""}INTO "${table}" (${columns.map((c) => `"${c}"`).join(",")}) VALUES (${columns.map(() => "?").join(",")})`,
    )
    .bind(...Object.values(data));
}
export async function recordOrder(
  userId: string,
  data: OrderInput,
  lines: CartLine[],
) {
  const priced = await reprice(lines);
  const id = `DEMO-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`;
  // D1 batch is transactional. Prisma's D1 adapter alone does not implement transactions.
  await binding().batch([
    insert("Order", {
      ...data,
      id,
      userId,
      totalCents: priced.totalCents,
      status: "RECORDED",
      currency: "USD",
      createdAt: new Date().toISOString(),
    }),
    ...priced.items.map((i) =>
      insert("OrderItem", {
        id: randomUUID(),
        orderId: id,
        productId: i.productId,
        variantId: i.variantId,
        title: i.title,
        titleTr: i.titleTr,
        variantLabel: i.variantLabel,
        image: i.image,
        quantity: i.quantity,
        unitCents: i.unitCents,
        totalCents: i.totalCents,
      }),
    ),
  ]);
  return { id };
}
export async function recordApplication(
  user: { id: string } | null,
  data: ApplicationInput,
  password?: string,
) {
  if (user) {
    const pending = await db.wholesaleApplication.findFirst({
      where: { userId: user.id, status: "PENDING" },
    });
    if (pending) return { id: pending.id, userId: user.id };
  }
  const userId = user?.id ?? randomUUID();
  const companyId = randomUUID();
  const id = randomUUID();
  const statements: D1PreparedStatement[] = [];
  if (!user) {
    statements.push(
      insert("Company", {
        id: companyId,
        name: data.company,
        country: data.country,
        phone: data.phone,
        address: "",
      }),
    );
    statements.push(
      insert("User", {
        id: userId,
        email: data.email,
        name: data.name,
        passwordHash: hashPassword(password!),
        role: "PENDING_BUYER",
        companyId,
      }),
    );
  }
  statements.push(
    insert("WholesaleApplication", {
      ...data,
      id,
      userId,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    }),
  );
  await binding().batch(statements);
  return { id, userId };
}
export async function saveProduct(
  id: string,
  fields: Prisma.ProductUncheckedUpdateInput,
  tiers: { minQty: number; discountBps: number }[],
) {
  const values = { ...fields, updatedAt: new Date().toISOString() };
  const columns = Object.keys(values);
  await binding().batch([
    binding()
      .prepare(
        `UPDATE "Product" SET ${columns.map((c) => `"${c}"=?`).join(",")} WHERE id=?`,
      )
      .bind(
        ...Object.values(values).map((v) =>
          typeof v === "boolean" ? Number(v) : v,
        ),
        id,
      ),
    binding().prepare('DELETE FROM "PricingTier" WHERE productId=?').bind(id),
    ...tiers.map((t) =>
      insert("PricingTier", { ...t, productId: id, id: randomUUID() }),
    ),
  ]);
}
export async function reviewApplication(id: string, status: string) {
  await binding().batch([
    binding()
      .prepare('UPDATE "WholesaleApplication" SET status=? WHERE id=?')
      .bind(status, id),
    binding()
      .prepare(
        'UPDATE "User" SET role=? WHERE id=(SELECT userId FROM "WholesaleApplication" WHERE id=?) AND role<>?',
      )
      .bind(
        status === "APPROVED" ? "APPROVED_BUYER" : "PENDING_BUYER",
        id,
        "ADMIN",
      ),
  ]);
}
