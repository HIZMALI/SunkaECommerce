import handler from "vinext/server/fetch-handler";
import { ensureSeed } from "../src/edge/seed";
import { withDatabase } from "../src/edge/db";

const worker = {
  async fetch(
    request: Request,
    env: { DB: D1Database; DEMO_ADMIN_PASSWORD?: string },
    ctx: ExecutionContext,
  ) {
    return withDatabase(env.DB, async () => {
      await ensureSeed(env);
      return handler.fetch(request, env, ctx);
    });
  },
};
export default worker;
