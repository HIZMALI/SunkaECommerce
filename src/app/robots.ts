import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: `${process.env.APP_URL ?? process.env.RENDER_EXTERNAL_URL ?? "http://127.0.0.1:3000"}/sitemap.xml`,
  };
}
