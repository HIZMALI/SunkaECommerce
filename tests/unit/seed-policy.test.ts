import { describe, expect, it } from "vitest";
import { demoSeedPolicy } from "../../src/lib/seed-policy";

describe("demo identity seeding policy", () => {
  it("creates local sample identities only in demo mode", () => {
    expect(demoSeedPolicy({ DEMO_MODE: "true" }).enabled).toBe(true);
    expect(demoSeedPolicy({ DEMO_MODE: "false" }).enabled).toBe(false);
  });
  it("never seeds sample identities in ordinary production", () => {
    expect(
      demoSeedPolicy({ NODE_ENV: "production", DEMO_MODE: "true" }).enabled,
    ).toBe(false);
  });
  it("requires an explicitly identified hosted sandbox and separate administrator secret", () => {
    const env = {
      NODE_ENV: "production",
      DEMO_MODE: "true",
      APP_ENV: "demo",
      ALLOW_HOSTED_DEMO_SEED: "true",
      DEMO_ADMIN_PASSWORD: "A-long-random-test-secret-only",
    };
    expect(demoSeedPolicy(env)).toMatchObject({
      enabled: true,
      hosted: true,
      adminPassword: env.DEMO_ADMIN_PASSWORD,
    });
    expect(() => demoSeedPolicy({ ...env, APP_ENV: "production" })).toThrow();
    expect(() => demoSeedPolicy({ ...env, DEMO_MODE: "false" })).toThrow();
    expect(() =>
      demoSeedPolicy({ ...env, DEMO_ADMIN_PASSWORD: "SunkaDemo!2026" }),
    ).toThrow();
    expect(() =>
      demoSeedPolicy({ ...env, DEMO_ADMIN_PASSWORD: undefined }),
    ).toThrow();
  });
});
