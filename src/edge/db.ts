import { env } from "cloudflare:workers";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "../generated/worker/client";
import type { PrismaClient as NodePrismaClient } from "@prisma/client";

// Vite aliases the Node database module to this request-safe D1 adapter.
export const binding = () => (env as unknown as { DB: D1Database }).DB;
const client = new PrismaClient({ adapter: new PrismaD1(binding()) });
export const db = client as unknown as NodePrismaClient;
