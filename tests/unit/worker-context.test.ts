import { describe, expect, it, vi } from "vitest";

vi.mock("@prisma/adapter-d1", () => ({
  PrismaD1: class {
    constructor(public binding: { label: string }) {}
  },
}));
vi.mock("../../src/generated/worker/client", () => ({
  PrismaClient: class {
    product;
    constructor({ adapter }: { adapter: { binding: { label: string } } }) {
      this.product = {
        findFirst: async () => {
          await Promise.resolve();
          return { id: adapter.binding.label };
        },
      };
    }
  },
}));
import { db, withDatabase } from "../../src/edge/db";

describe("Worker database request isolation", () => {
  it("rejects database access outside an active request", () => {
    expect(() => db.product).toThrow(/request context/i);
  });
  it("keeps concurrent asynchronous requests on their own D1 binding", async () => {
    const result = await Promise.all(
      ["first-request", "second-request"].map((label) =>
        withDatabase({ label } as unknown as D1Database, async () => {
          await new Promise((resolve) =>
            setTimeout(resolve, label === "first-request" ? 5 : 1),
          );
          const row = await db.product.findFirst();
          await Promise.resolve();
          const sameRequest = await db.product.findFirst();
          expect(sameRequest?.id).toBe(label);
          return row?.id;
        }),
      ),
    );
    expect(result).toEqual(["first-request", "second-request"]);
  });
});
