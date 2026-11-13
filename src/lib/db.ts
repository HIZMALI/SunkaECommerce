import type { PrismaClient } from "@prisma/client";
import { createDatabaseClient } from "./database-client";
const globalDb = globalThis as unknown as { prisma?: PrismaClient };
export const db = globalDb.prisma ?? createDatabaseClient();
if (process.env.NODE_ENV !== "production") globalDb.prisma = db;
