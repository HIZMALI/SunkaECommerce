import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  createSession,
  DEMO,
  getUser,
  logout,
  verifyPassword,
} from "@/lib/auth";
import { canPrice } from "@/lib/pricing";
import { reprice } from "@/lib/catalog";
import {
  recordOrder,
  recordApplication,
  saveProduct,
  reviewApplication,
} from "@/lib/mutations";
export const dynamic = "force-dynamic";
const str = (min = 1, max = 200) => z.string().trim().min(min).max(max);
const email = z
  .email()
  .max(200)
  .transform((s) => s.toLowerCase());
const contactFields = {
  company: str(2),
  name: str(2),
  email,
  phone: str(5, 50),
  country: str(2, 100),
};
const cart = z
  .array(
    z.object({
      productId: str(),
      variantId: str(),
      quantity: z.number().int().min(1).max(100000),
    }),
  )
  .min(1)
  .max(50);
const attempts = new Map<string, { count: number; until: number }>();
function limit(key: string, max = 12) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry && entry.until > now) {
    entry.count++;
    if (entry.count > max) throw new Error("RATE");
  } else attempts.set(key, { count: 1, until: now + 15 * 60 * 1000 });
  if (attempts.size > 10000)
    for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
}
function errorMessage(code: string, tr: boolean) {
  const messages: Record<string, [string, string]> = {
    AUTH: ["Please sign in to continue.", "Devam etmek için giriş yapın."],
    ROLE: [
      "An approved wholesale account is required.",
      "Onaylı bir toptan müşteri hesabı gerekiyor.",
    ],
    LOGIN: ["Email or password is incorrect.", "E-posta veya şifre hatalı."],
    DEMO: [
      "This feature is available only in demo mode.",
      "Bu özellik yalnızca demo modunda kullanılabilir.",
    ],
    MOQ: [
      "Quantity is below the sample minimum.",
      "Miktar örnek minimum siparişin altında.",
    ],
    PACK: [
      "Use the displayed pack multiple.",
      "Belirtilen paket katını kullanın.",
    ],
    CAPACITY: [
      "Quantity exceeds sample capacity. Request a quote.",
      "Miktar örnek kapasiteyi aşıyor. Teklif isteyin.",
    ],
    UNAVAILABLE: [
      "A selected item is no longer available for ordering.",
      "Seçilen bir ürün artık siparişe uygun değil.",
    ],
    EMPTY: ["Your cart is empty.", "Sepetiniz boş."],
    DUPLICATE: [
      "Duplicate cart lines are not allowed.",
      "Yinelenen sepet satırlarına izin verilmez.",
    ],
    EXISTS: [
      "This email already has an account. Please sign in first.",
      "Bu e-posta için bir hesap var. Önce giriş yapın.",
    ],
    RATE: [
      "Too many attempts. Please try again later.",
      "Çok fazla deneme yapıldı. Lütfen daha sonra deneyin.",
    ],
    EMAIL: [
      "Use the email associated with your signed-in account.",
      "Giriş yaptığınız hesabın e-postasını kullanın.",
    ],
    NOTFOUND: ["The record could not be found.", "Kayıt bulunamadı."],
  };
  return (messages[code] ?? [
    "Please check the form fields and try again.",
    "Lütfen form alanlarını kontrol edip tekrar deneyin.",
  ])[tr ? 1 : 0];
}
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ action: string[] }> },
) {
  const tr = req.headers.get("x-locale") === "tr";
  try {
    const origin = req.headers.get("origin");
    const trustedOrigin = new URL(process.env.APP_URL ?? req.url).origin;
    if (
      (origin && origin !== trustedOrigin) ||
      req.headers.get("sec-fetch-site") === "cross-site"
    )
      return NextResponse.json(
        { error: tr ? "Geçersiz istek kaynağı." : "Invalid request origin." },
        { status: 403 },
      );
    const raw = await req.text();
    if (Buffer.byteLength(raw) > 65536)
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    const body = JSON.parse(raw || "{}");
    const action = (await context.params).action.join("/");
    const user = await getUser();
    if (action.startsWith("admin/") && user?.role !== "ADMIN")
      return NextResponse.json(
        { error: errorMessage("AUTH", tr) },
        { status: 403 },
      );
    if (action === "auth/login" || action === "auth/demo") {
      limit(`login:${req.headers.get("x-forwarded-for") ?? "local"}`, 30);
      let found;
      if (action === "auth/demo") {
        if (!DEMO) throw new Error("DEMO");
        found = await db.user.findUnique({
          where: { email: "buyer@sunka.demo" },
        });
      } else {
        const input = z.object({ email, password: str(1, 128) }).parse(body);
        found = await db.user.findUnique({ where: { email: input.email } });
        if (!found || !verifyPassword(input.password, found.passwordHash))
          throw new Error("LOGIN");
      }
      if (!found) throw new Error("LOGIN");
      await logout();
      await createSession(found.id);
      return NextResponse.json({ ok: true, role: found.role });
    }
    if (action === "auth/logout") {
      await logout();
      return NextResponse.json({ ok: true });
    }
    if (action === "cart/price" || action === "orders") {
      if (!user) throw new Error("AUTH");
      if (!canPrice(user.role)) throw new Error("ROLE");
      const input = cart.parse(body.items);
      if (action === "cart/price")
        return NextResponse.json(await reprice(input));
      if (!DEMO) throw new Error("DEMO");
      const data = z
        .object({
          ...contactFields,
          shippingAddress: str(10, 1000),
          billingAddress: str(10, 1000),
          notes: str(0, 2000),
          idempotencyKey: z.uuid(),
        })
        .parse(body);
      const previous = await db.order.findUnique({
        where: { idempotencyKey: data.idempotencyKey },
      });
      if (previous) {
        if (previous.userId !== user.id) throw new Error("AUTH");
        return NextResponse.json({ id: previous.id });
      }
      const result = await recordOrder(user.id, data, input);
      return NextResponse.json({ id: result.id }, { status: 201 });
    }
    if (action === "quotes") {
      limit(
        `quote:${user?.id ?? req.headers.get("x-forwarded-for") ?? "local"}`,
        40,
      );
      const data = z
        .object({
          ...contactFields,
          family: str(),
          application: str(2, 500),
          shape: str(0, 100),
          dimensions: str(2, 300),
          thickness: str(0, 100),
          finish: str(0, 100),
          quantity: z.coerce.number().int().min(1).max(100000000),
          notes: str(0, 2000),
        })
        .parse(body);
      const row = await db.quoteRequest.create({
        data: {
          ...data,
          id: `RFQ-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`,
          userId: user?.id,
        },
      });
      return NextResponse.json({ id: row.id }, { status: 201 });
    }
    if (action === "applications") {
      limit(`application:${req.headers.get("x-forwarded-for") ?? "local"}`, 20);
      const data = z
        .object({
          ...contactFields,
          businessType: str(),
          monthlyVolume: str(),
          interests: str(),
          notes: str(0, 2000),
          password: z.string().max(128).optional(),
        })
        .parse(body);
      if (user && data.email !== user.email) throw new Error("EMAIL");
      const existing = await db.user.findUnique({
        where: { email: data.email },
      });
      if (existing && !user) throw new Error("EXISTS");
      if (!user)
        z.string()
          .min(12)
          .max(128)
          .regex(/[A-Z]/)
          .regex(/[a-z]/)
          .regex(/[0-9]/)
          .parse(data.password);
      const { password, ...application } = data;
      const result = await recordApplication(user, application, password);
      if (!user) await createSession(result.userId);
      return NextResponse.json({ id: result.id }, { status: 201 });
    }
    if (action === "contact") {
      limit(`contact:${req.headers.get("x-forwarded-for") ?? "local"}`, 20);
      const data = z
        .object({
          name: str(2),
          company: str(2),
          email,
          message: str(10, 3000),
        })
        .parse(body);
      const row = await db.contactSubmission.create({ data });
      return NextResponse.json({ id: row.id }, { status: 201 });
    }
    if (action === "account") {
      if (!user?.company) throw new Error("AUTH");
      const data = z
        .object({
          name: str(2),
          country: str(2),
          phone: str(5, 50),
          address: str(0, 1000),
        })
        .parse(body);
      await db.company.update({ where: { id: user.company.id }, data });
      return NextResponse.json({ ok: true });
    }
    if (action === "admin/product") {
      const data = z
        .object({
          id: str(),
          title: str(2),
          titleTr: str(2),
          description: str(10, 2000),
          descriptionTr: str(10, 2000),
          categoryId: str(),
          visible: z.boolean(),
          saleMode: z.enum(["STANDARD_ORDER", "QUOTE_ONLY"]),
          baseCents: z.number().int().min(1).max(1000000),
          moq: z.number().int().min(1).max(10000),
          packMultiple: z.number().int().min(1).max(1000),
          tiers: z
            .array(
              z.object({
                minQty: z.number().int().min(1),
                discountBps: z.number().int().min(0).max(5000),
              }),
            )
            .min(1)
            .max(6),
        })
        .parse(body);
      if (
        data.moq % data.packMultiple ||
        new Set(data.tiers.map((t) => t.minQty)).size !== data.tiers.length
      )
        throw new Error("PACK");
      const { id, tiers, ...fields } = data;
      await saveProduct(id, fields, tiers);
      return NextResponse.json({ ok: true });
    }
    if (action === "admin/order") {
      const data = z
        .object({
          id: str(),
          status: z.enum(["RECORDED", "IN_REVIEW", "CONFIRMED", "CANCELLED"]),
        })
        .parse(body);
      await db.order.update({
        where: { id: data.id },
        data: { status: data.status },
      });
      return NextResponse.json({ ok: true });
    }
    if (action === "admin/quote") {
      const data = z
        .object({
          id: str(),
          status: z.enum(["NEW", "IN_REVIEW", "RESPONDED"]),
          response: str(0, 3000),
        })
        .parse(body);
      await db.quoteRequest.update({
        where: { id: data.id },
        data: { status: data.status, response: data.response },
      });
      return NextResponse.json({ ok: true });
    }
    if (action === "admin/application") {
      const data = z
        .object({
          id: str(),
          status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
        })
        .parse(body);
      await reviewApplication(data.id, data.status);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (e) {
    const code = e instanceof Error ? e.message : "";
    const status = ["AUTH", "ROLE"].includes(code)
      ? 403
      : code === "RATE"
        ? 429
        : 400;
    return NextResponse.json({ error: errorMessage(code, tr) }, { status });
  }
}
