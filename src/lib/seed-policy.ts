export function demoSeedPolicy(env: Record<string, string | undefined>) {
  const demo = env.DEMO_MODE === "true";
  const hosted = env.ALLOW_HOSTED_DEMO_SEED === "true";
  if (hosted && (!demo || env.APP_ENV !== "demo"))
    throw new Error(
      "Hosted sample accounts require APP_ENV=demo and DEMO_MODE=true.",
    );
  if (
    hosted &&
    (!env.DEMO_ADMIN_PASSWORD ||
      env.DEMO_ADMIN_PASSWORD.length < 20 ||
      env.DEMO_ADMIN_PASSWORD === "SunkaDemo!2026")
  )
    throw new Error(
      "Set a separate DEMO_ADMIN_PASSWORD of at least 20 characters for the hosted sandbox.",
    );
  return {
    enabled: demo && (env.NODE_ENV !== "production" || hosted),
    hosted,
    adminPassword: hosted ? env.DEMO_ADMIN_PASSWORD : undefined,
  };
}
