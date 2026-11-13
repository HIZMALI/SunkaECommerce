/// <reference types="@cloudflare/workers-types" />
declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    DEMO_ADMIN_PASSWORD: string;
    APP_URL: string;
    DEMO_MODE: string;
    COOKIE_SECURE: string;
  }
}
