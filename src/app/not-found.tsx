import Link from "next/link";
import { cookies } from "next/headers";
export default async function NotFound() {
  const tr = (await cookies()).get("sunka_locale")?.value === "tr";
  return (
    <div className="standalone-error">
      <p className="eyebrow">SUN-KA / LARTON · 404</p>
      <h1>{tr ? "Başka bir yöne." : "A different direction."}</h1>
      <p>
        {tr
          ? "Bu sayfa veya kayıt kullanılamıyor. Kendi siparişlerinizi görmek için giriş yapın."
          : "This page or record is not available. Sign in to view your own orders."}
      </p>
      <Link href={tr ? "/products?lang=tr" : "/products"} className="button">
        {tr ? "Malzemeleri keşfet ↗" : "Explore materials ↗"}
      </Link>
    </div>
  );
}
