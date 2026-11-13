import { db } from "@/lib/db";
import type { CartLine } from "./types";
import { reprice } from "./catalog";
import { hashPassword } from "./auth";
import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";

export type OrderInput = {
  company: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  shippingAddress: string;
  billingAddress: string;
  notes: string;
  idempotencyKey: string;
};
export async function recordOrder(
  userId: string,
  data: OrderInput,
  lines: CartLine[],
) {
  return db.$transaction(async (tx) => {
    const priced = await reprice(lines, tx);
    return tx.order.create({
      data: {
        ...data,
        id: `DEMO-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`,
        userId,
        totalCents: priced.totalCents,
        items: {
          create: priced.items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            title: i.title,
            titleTr: i.titleTr,
            variantLabel: i.variantLabel,
            image: i.image,
            quantity: i.quantity,
            unitCents: i.unitCents,
            totalCents: i.totalCents,
          })),
        },
      },
    });
  });
}
export type ApplicationInput = {
  company: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  businessType: string;
  monthlyVolume: string;
  interests: string;
  notes: string;
};
export async function recordApplication(
  user: { id: string } | null,
  data: ApplicationInput,
  password?: string,
) {
  return db.$transaction(async (tx) => {
    const account =
      user ??
      (await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          passwordHash: hashPassword(password!),
          role: "PENDING_BUYER",
          company: {
            create: {
              name: data.company,
              country: data.country,
              phone: data.phone,
            },
          },
        },
      }));
    const pending = await tx.wholesaleApplication.findFirst({
      where: { userId: account.id, status: "PENDING" },
    });
    if (pending) return { id: pending.id, userId: account.id };
    const row = await tx.wholesaleApplication.create({
      data: { ...data, userId: account.id },
    });
    return { id: row.id, userId: account.id };
  });
}
export async function saveProduct(
  id: string,
  fields: Prisma.ProductUncheckedUpdateInput,
  tiers: { minQty: number; discountBps: number }[],
) {
  await db.$transaction([
    db.product.update({ where: { id }, data: fields }),
    db.pricingTier.deleteMany({ where: { productId: id } }),
    db.pricingTier.createMany({
      data: tiers.map((t) => ({ ...t, productId: id })),
    }),
  ]);
}
export async function reviewApplication(id: string, status: string) {
  await db.$transaction(async (tx) => {
    const a = await tx.wholesaleApplication.update({
      where: { id },
      data: { status },
    });
    const u = await tx.user.findUniqueOrThrow({ where: { id: a.userId } });
    if (u.role !== "ADMIN")
      await tx.user.update({
        where: { id: a.userId },
        data: {
          role: status === "APPROVED" ? "APPROVED_BUYER" : "PENDING_BUYER",
        },
      });
  });
}
