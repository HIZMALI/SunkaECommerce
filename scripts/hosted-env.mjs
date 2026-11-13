import path from "node:path";
/** @param {Record<string, string | undefined>} input */
export function hostedEnvironment(input = process.env) {
  const origin = input.APP_URL || input.RENDER_EXTERNAL_URL;
  if (!origin)
    throw new Error(
      "APP_URL or RENDER_EXTERNAL_URL is required for hosted deployment.",
    );
  const url = new URL(origin);
  if (
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error(
      "The public URL must be an origin without credentials, path or query.",
    );
  const loopback = ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback))
    throw new Error("Public hosting requires an HTTPS origin.");
  const port = Number(input.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("PORT must be a valid TCP port.");
  const databaseUrl = input.DATABASE_URL || "file:/var/data/sunka-demo.db";
  if (!databaseUrl.startsWith("file:"))
    throw new Error("This deployment expects SQLite on a persistent disk.");
  const databasePath = path.resolve("prisma", databaseUrl.slice(5));
  return {
    env: {
      ...input,
      NODE_ENV: "production",
      APP_URL: url.origin,
      PORT: String(port),
      DATABASE_URL: databaseUrl,
      COOKIE_SECURE: String(url.protocol === "https:"),
    },
    databasePath,
    hostname: input.BIND_HOST || "0.0.0.0",
  };
}
