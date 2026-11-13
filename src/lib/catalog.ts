import { db } from "./db";
import { canPrice, priceCents, quantityError, orderMultiple } from "./pricing";
import type { CartLine, PricedLine, Product } from "./types";
import type { Prisma } from "@prisma/client";
export const productInclude = {
  images: { orderBy: { position: "asc" as const } },
  variants: true,
  tiers: { orderBy: { minQty: "asc" as const } },
};
export async function catalog(
  role?: string,
  admin = false,
): Promise<Product[]> {
  const products = await db.product.findMany({
    where: admin ? {} : { visible: true },
    include: productInclude,
    orderBy: { id: "asc" },
  });
  return products.map((p) => ({
    ...p,
    updatedAt: undefined,
    baseCents: canPrice(role) ? p.baseCents : null,
    variants: p.variants.map((v) => ({
      ...v,
      adjustmentCents: canPrice(role) ? v.adjustmentCents : null,
    })),
  }));
}
export async function reprice(
  lines: CartLine[],
  client: Prisma.TransactionClient = db,
): Promise<{ items: PricedLine[]; totalCents: number }> {
  if (!lines.length || lines.length > 50) throw new Error("EMPTY");
  if (new Set(lines.map((l) => l.variantId)).size !== lines.length)
    throw new Error("DUPLICATE");
  const products = await client.product.findMany({
    where: { id: { in: lines.map((l) => l.productId) }, visible: true },
    include: productInclude,
  });
  const items = lines.map((line) => {
    const p = products.find((p) => p.id === line.productId);
    const v = p?.variants.find((v) => v.id === line.variantId);
    if (!p || !v || p.saleMode !== "STANDARD_ORDER")
      throw new Error("UNAVAILABLE");
    const error = quantityError(
      line.quantity,
      p.moq,
      orderMultiple(p.packMultiple, v.pack),
      v.demoCapacity,
    );
    if (error) throw new Error(error);
    const price = priceCents(
      p.baseCents,
      v.adjustmentCents,
      line.quantity,
      p.tiers,
    );
    return {
      ...line,
      title: p.title,
      titleTr: p.titleTr,
      variantLabel: `${v.shape} · ${v.size} · ${v.finish} · ${v.thickness} · ${v.pack} pcs/pack`,
      image: p.images[0].src,
      unitCents: price.unitCents,
      totalCents: price.totalCents,
      moq: p.moq,
      packMultiple: p.packMultiple,
      demoCapacity: v.demoCapacity,
      slug: p.slug,
    };
  });
  const totalCents = items.reduce((n, i) => n + i.totalCents, 0);
  if (!Number.isSafeInteger(totalCents) || totalCents > 2147483647)
    throw new Error("CAPACITY");
  return { items, totalCents };
}
