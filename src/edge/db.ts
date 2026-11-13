import { AsyncLocalStorage } from "node:async_hooks";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "../generated/worker/client";
import type { PrismaClient as NodePrismaClient } from "@prisma/client";

// D1 I/O and the Prisma query engine must belong to the current Worker request.
const requests = new AsyncLocalStorage<{
  binding: D1Database;
  client?: PrismaClient;
}>();
function context() {
  const current = requests.getStore();
  if (!current)
    throw new Error("Database access requires a Worker request context.");
  return current;
}
export const binding = () => context().binding;
export function withDatabase<T>(database: D1Database, run: () => T) {
  return requests.run({ binding: database }, run);
}
export const db = new Proxy({} as NodePrismaClient, {
  get(_target, property) {
    const current = context();
    current.client ??= new PrismaClient({
      adapter: new PrismaD1(current.binding),
    });
    const value = Reflect.get(current.client, property);
    return typeof value === "function" ? value.bind(current.client) : value;
  },
});
