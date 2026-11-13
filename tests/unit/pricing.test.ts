import { describe, it, expect } from "vitest";
import {
  canPrice,
  priceCents,
  quantityError,
  orderMultiple,
} from "../../src/lib/pricing";
const tiers = [
  { minQty: 100, discountBps: 0 },
  { minQty: 500, discountBps: 800 },
  { minQty: 1000, discountBps: 1500 },
];
describe("wholesale money and quantity rules", () => {
  it("combines product ordering multiples with variant pack sizes", () => {
    expect(orderMultiple(50, 100)).toBe(100);
    expect(orderMultiple(60, 50)).toBe(300);
    expect(quantityError(150, 100, orderMultiple(50, 100), 10000)).toBe("PACK");
  });
  it("selects the correct tier at the exact threshold and rounds each unit to cents", () => {
    expect(priceCents(68, 0, 450, tiers)).toEqual({
      unitCents: 68,
      totalCents: 30600,
      discountBps: 0,
    });
    expect(priceCents(68, 0, 500, tiers)).toEqual({
      unitCents: 63,
      totalCents: 31500,
      discountBps: 800,
    });
    expect(priceCents(68, 0, 1000, tiers)).toEqual({
      unitCents: 58,
      totalCents: 58000,
      discountBps: 1500,
    });
  });
  it("applies variant adjustments before the tier discount", () => {
    expect(priceCents(68, 18, 1000, tiers)).toEqual({
      unitCents: 73,
      totalCents: 73000,
      discountBps: 1500,
    });
  });
  it("handles unsorted tiers without mutating input", () => {
    const input = [tiers[2], tiers[0], tiers[1]];
    expect(priceCents(100, 0, 500, input).unitCents).toBe(92);
    expect(input[0].minQty).toBe(1000);
  });
  it.each([
    [50, "MOQ"],
    [100.5, "MOQ"],
    [125, "PACK"],
    [10050, "CAPACITY"],
    [100, null],
    [10000, null],
    [NaN, "MOQ"],
    [Infinity, "MOQ"],
  ])("validates quantity %s", (quantity, error) => {
    expect(quantityError(quantity as number, 100, 50, 10000)).toBe(error);
  });
  it("grants price access only to approved buyers and admins", () => {
    expect(canPrice("ADMIN")).toBe(true);
    expect(canPrice("APPROVED_BUYER")).toBe(true);
    expect(canPrice("PENDING_BUYER")).toBe(false);
    expect(canPrice()).toBe(false);
  });
});
