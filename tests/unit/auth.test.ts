import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../../src/lib/auth";
describe("password hashing", () => {
  it("uses unique salts and validates only the original password", () => {
    const a = hashPassword("SamplePassword!2026");
    const b = hashPassword("SamplePassword!2026");
    expect(a).not.toBe(b);
    expect(a).not.toContain("SamplePassword!2026");
    expect(verifyPassword("SamplePassword!2026", a)).toBe(true);
    expect(verifyPassword("wrong", a)).toBe(false);
    expect(verifyPassword("wrong", "invalid")).toBe(false);
  });
});
