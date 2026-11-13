import { describe, expect, it } from "vitest";
// The same dependency-free module is executed by the hosting entrypoint.
import { hostedEnvironment } from "../../scripts/hosted-env.mjs";

describe("hosted server environment", () => {
  it("uses the platform HTTPS origin and secure cookies", () => {
    const result = hostedEnvironment({
      RENDER_EXTERNAL_URL: "https://sunka-test.onrender.com",
      PORT: "10000",
    });
    expect(result.env).toMatchObject({
      NODE_ENV: "production",
      APP_URL: "https://sunka-test.onrender.com",
      COOKIE_SECURE: "true",
      PORT: "10000",
      DATABASE_URL: "file:/var/data/sunka-demo.db",
    });
    expect(result.hostname).toBe("0.0.0.0");
  });
  it("supports a local integration check without a TLS terminator", () => {
    expect(
      hostedEnvironment({
        APP_URL: "http://127.0.0.1:3001",
        DATABASE_URL: "file:./hosted-test.db",
      }).env.COOKIE_SECURE,
    ).toBe("false");
  });
  it("rejects unsafe origins, invalid ports and unsupported databases", () => {
    for (const origin of [
      "http://example.com",
      "https://user:secret@example.com",
      "https://example.com/path",
      "https://example.com?key=x",
    ])
      expect(() => hostedEnvironment({ APP_URL: origin })).toThrow();
    expect(() => hostedEnvironment({})).toThrow();
    expect(() =>
      hostedEnvironment({ APP_URL: "https://example.com", PORT: "0" }),
    ).toThrow();
    expect(() =>
      hostedEnvironment({
        APP_URL: "https://example.com",
        DATABASE_URL: "postgres://example",
      }),
    ).toThrow();
  });
});
