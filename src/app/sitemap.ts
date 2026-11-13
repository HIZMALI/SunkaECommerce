import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.APP_URL ??
    process.env.RENDER_EXTERNAL_URL ??
    "http://127.0.0.1:3000";
  const [products, categories] = await Promise.all([
    db.product.findMany({ where: { visible: true }, select: { slug: true } }),
    db.category.findMany({ select: { id: true } }),
  ]);
  return [
    "",
    "/products",
    "/wholesale",
    "/request-quote",
    "/industries",
    "/industries/food-retail",
    "/industries/packaging-logistics",
    "/industries/manufacturing-furniture",
    "/about",
    "/sustainability",
    "/contact",
    "/faq",
    "/demo-guide",
    ...products.map((p) => `/products/${p.slug}`),
    ...categories.map((c) => `/collections/${c.id}`),
  ].map((path) => ({
    url: base + path,
    alternates: {
      languages: { en: base + path, tr: base + path + "?lang=tr" },
    },
  }));
}
