import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import "@fontsource-variable/manrope";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL ??
      process.env.RENDER_EXTERNAL_URL ??
      "http://127.0.0.1:3000",
  ),
  title: {
    default: "Sun-Ka / Larton — Materials with purpose",
    template: "%s | Sun-Ka / Larton",
  },
  description:
    "Paperboard, presentation boards and protective profiles for business. Sun-Ka / Larton wholesale demonstration.",
  robots: { index: false, follow: false },
  icons: { icon: "/images/logo.png" },
  openGraph: {
    title: "Sun-Ka / Larton — Materials with purpose",
    description: "Presentation. Protection. Possibility.",
    images: [{ url: "/images/cake-gold.webp", width: 833, height: 677 }],
  },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale =
    (await headers()).get("x-sunka-locale") ??
    ((await cookies()).get("sunka_locale")?.value === "tr" ? "tr" : "en");
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
