import handler from "vinext/server/fetch-handler";
import { ensureSeed } from "../src/edge/seed";

const worker = {
  async fetch(
    request: Request,
    env: { DB: D1Database; DEMO_ADMIN_PASSWORD?: string },
    ctx: ExecutionContext,
  ) {
    await ensureSeed(env);
    return handler.fetch(request, env, ctx);
  },
};
export default worker;
