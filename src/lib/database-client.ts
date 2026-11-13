import { PrismaClient } from "@prisma/client";
import { PrismaClient as PostgresClient } from "@/generated/postgres/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getConnectionString } from "@netlify/database";

export function createDatabaseClient(): PrismaClient {
  if (process.env.DATABASE_PROVIDER !== "postgresql") return new PrismaClient();
  const connectionString = process.env.NETLIFY_DB_URL
    ? getConnectionString()
    : process.env.DATABASE_URL;
  if (!connectionString || !/^postgres(ql)?:\/\//.test(connectionString))
    throw new Error(
      "A PostgreSQL connection is required for the hosted database.",
    );
  const secureUrl = new URL(connectionString);
  if (
    ["prefer", "require", "verify-ca"].includes(
      secureUrl.searchParams.get("sslmode") ?? "",
    )
  )
    secureUrl.searchParams.set("sslmode", "verify-full");
  const adapter = new PrismaPg({
    connectionString: secureUrl.toString(),
    max: 2,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 15_000,
  });
  // Both generated clients derive from the same models. The public application
  // keeps one query type while the adapter selects its actual SQL dialect.
  return new PostgresClient({ adapter }) as unknown as PrismaClient;
}
