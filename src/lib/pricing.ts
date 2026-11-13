import type { Tier } from "./types";
export function quantityError(
  quantity: number,
  moq: number,
  multiple: number,
  capacity: number,
): string | null {
  if (!Number.isSafeInteger(quantity) || quantity < moq) return "MOQ";
  if (quantity % multiple !== 0) return "PACK";
  if (quantity > capacity) return "CAPACITY";
  return null;
}
export function priceCents(
  base: number,
  adjustment: number,
  quantity: number,
  tiers: Tier[],
) {
  const tier = [...tiers]
    .sort((a, b) => b.minQty - a.minQty)
    .find((t) => quantity >= t.minQty);
  const unitCents = Math.round(
    ((base + adjustment) * (10000 - (tier?.discountBps ?? 0))) / 10000,
  );
  return {
    unitCents,
    totalCents: unitCents * quantity,
    discountBps: tier?.discountBps ?? 0,
  };
}
export function money(cents: number, locale: "en" | "tr" = "en") {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
export const canPrice = (role?: string) =>
  role === "APPROVED_BUYER" || role === "ADMIN";
export function orderMultiple(productMultiple: number, variantPack: number) {
  let a = productMultiple,
    b = variantPack;
  while (b) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return (productMultiple / a) * variantPack;
}
