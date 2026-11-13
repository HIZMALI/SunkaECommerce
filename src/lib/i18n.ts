import type { Locale } from "./types";
const translations: Record<string, string> = {
  Round: "Yuvarlak",
  Square: "Kare",
  Rectangle: "Dikdörtgen",
  Flower: "Çiçek",
  "L profile": "L profil",
  "U profile": "U profil",
  Oval: "Oval",
  Notched: "Çentikli",
  Locked: "Kilitli",
  Sheet: "Levha",
  Coil: "Bobin",
  "Slit reel": "Dilimlenmiş bobin",
  Gold: "Altın",
  Silver: "Gümüş",
  Kraft: "Kraft",
  White: "Beyaz",
  Black: "Siyah",
  Grey: "Gri",
  Colored: "Renkli",
  Metalised: "Metalize",
  Natural: "Doğal",
  "Bright finish": "Parlak yüzey",
  Matte: "Mat",
  "Moisture resistant": "Neme dayanıklı",
  "Self-adhesive": "Kendinden yapışkanlı",
  "Food & Retail": "Gıda ve Perakende",
  "Packaging & Logistics": "Ambalaj ve Lojistik",
  "Manufacturing & Furniture": "Üretim ve Mobilya",
  RECORDED: "KAYDEDİLDİ",
  IN_REVIEW: "İNCELENİYOR",
  CONFIRMED: "ONAYLANDI",
  CANCELLED: "İPTAL EDİLDİ",
  NEW: "YENİ",
  RESPONDED: "YANITLANDI",
  PENDING: "BEKLEMEDE",
  APPROVED: "ONAYLANDI",
  REJECTED: "REDDEDİLDİ",
  "Die Cut Boards": "Kesimli Pasta Altlıkları",
  "Flower Cut Board": "Çiçek Kesim Altlık",
  "Salmon Board": "Somon Altlığı",
  "Single-Serve Mono Portion Boards": "Tek Porsiyon Sunum Altlıkları",
  Cornerboard: "Karton Köşebent",
  Cardboard: "Mukavva",
  "Grey Board Reel": "Gri Karton Bobin",
  "Cake & Salmon Boards": "Pasta ve Somon Altlıkları",
  "Specialty Presentation Boards": "Özel Sunum Altlıkları",
  Cornerboards: "Karton Köşebentler",
  "Grey Board Reels": "Gri Karton Bobinler",
  Distributor: "Distribütör",
  Bakery: "Pastane",
  Manufacturer: "Üretici",
  Packaging: "Ambalaj",
  Retail: "Perakende",
  "Other business": "Diğer işletme",
};
export function localValue(s: string, locale: Locale) {
  if (locale === "en") return s;
  return (
    translations[s] ??
    s
      .split(" · ")
      .map((part) =>
        (translations[part] ?? part)
          .replace("pcs/pack", "adet/paket")
          .replace("pcs / pack", "adet / paket")
          .replace("mm width", "mm en")
          .replace("(sample)", "(örnek)"),
      )
      .join(" · ")
  );
}
export function localized<T extends { title: string; titleTr: string }>(
  item: T,
  locale: Locale,
) {
  return locale === "tr" ? item.titleTr : item.title;
}
export function linkLocale(href: string, locale: Locale) {
  if (
    locale === "en" ||
    href.startsWith("#") ||
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  )
    return href;
  return `${href}${href.includes("?") ? "&" : "?"}lang=tr`;
}
