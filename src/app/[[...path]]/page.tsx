import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { catalog } from "@/lib/catalog";
import { DEMO, getUser } from "@/lib/auth";
import { StoreProvider } from "@/components/store";
import { Header, Footer } from "@/components/chrome";
import { Home } from "@/components/home";
import { Catalog, ProductDetail } from "@/components/products";
import { Contact, Login, RequestQuote, Wholesale } from "@/components/forms";
import { Account, CartPage, OrderDetails } from "@/components/commerce";
import { About, FAQ, Industries, Sustainability } from "@/components/content";
import { Admin } from "@/components/admin";
import { DemoGuide } from "@/components/demo-guide";
import type {
  OrderView,
  QuoteView,
  ApplicationView,
  ContactView,
} from "@/lib/types";
export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
const serialize = <T,>(data: unknown): T => JSON.parse(JSON.stringify(data));
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const path = (await params).path ?? [];
  const query = await searchParams;
  const tr =
    query.lang === "tr" ||
    (query.lang !== "en" &&
      (await cookies()).get("sunka_locale")?.value === "tr");
  const titles: Record<string, [string, string]> = {
    products: ["Material collection", "Malzeme koleksiyonu"],
    search: ["Find your material", "Malzemenizi bulun"],
    wholesale: ["Wholesale accounts", "Toptan müşteri hesabı"],
    "request-quote": ["Custom quote", "Özel teklif"],
    cart: ["Wholesale cart", "Toptan sepet"],
    checkout: ["Demo checkout", "Demo sipariş"],
    account: ["Your account", "Hesabınız"],
    admin: ["Administration", "Yönetim"],
    contact: ["Let’s talk materials", "Malzemeleri konuşalım"],
    about: ["A material legacy", "Bir malzeme mirası"],
    sustainability: ["Our material responsibility", "Malzeme sorumluluğumuz"],
    industries: ["Industries", "Sektörler"],
    faq: ["Useful to know", "Bilmekte yarar var"],
    login: ["Welcome back", "Tekrar hoş geldiniz"],
    "demo-guide": ["Demo guide", "Demo rehberi"],
  };
  let title = path.length
    ? (titles[path[0]] ?? [path[0], path[0]])[tr ? 1 : 0]
    : tr
      ? "Amacı olan malzemeler"
      : "Materials with purpose";
  if (path[0] === "products" && path[1]) {
    const p = await db.product.findUnique({ where: { slug: path[1] } });
    if (p) title = tr ? p.titleTr : p.title;
  }
  if (path[0] === "collections" && path[1]) {
    const c = await db.category.findUnique({ where: { id: path[1] } });
    if (c) title = tr ? c.titleTr : c.title;
  }
  const canonical = "/" + path.join("/");
  return {
    title,
    description: tr
      ? "İşletmeniz için sunum altlıkları, mukavva ve koruyucu profiller. Sun-Ka / Larton toptan satış demosu."
      : "Presentation boards, cardboard and protective profiles for business. Sun-Ka / Larton wholesale demonstration.",
    alternates: {
      canonical: canonical + (tr ? "?lang=tr" : ""),
      languages: {
        en: canonical,
        tr: canonical + "?lang=tr",
        "x-default": canonical,
      },
    },
  };
}
export default async function Page({ params, searchParams }: Props) {
  const path = (await params).path ?? [];
  const query = await searchParams;
  const user = await getUser();
  const jar = await cookies();
  const locale =
    query.lang === "tr"
      ? "tr"
      : query.lang === "en"
        ? "en"
        : jar.get("sunka_locale")?.value === "tr"
          ? "tr"
          : "en";
  const isAdmin = path[0] === "admin" && user?.role === "ADMIN";
  const [products, categories] = await Promise.all([
    catalog(user?.role, isAdmin),
    db.category.findMany(),
  ]);
  let content: React.ReactNode;
  if (!path.length) content = <Home />;
  else if (path[0] === "demo-guide" && path.length === 1)
    content = <DemoGuide />;
  else if (path[0] === "products" && path.length === 1) content = <Catalog />;
  else if (path[0] === "products" && path.length === 2) {
    const p = products.find((p) => p.slug === path[1]);
    if (!p) notFound();
    content = <ProductDetail key={p.id} product={p} />;
  } else if (path[0] === "collections" && path.length === 2) {
    const c = categories.find((c) => c.id === path[1]);
    if (!c) notFound();
    content = <Catalog collection={c} />;
  } else if (path[0] === "search" && path.length === 1)
    content = <Catalog search />;
  else if (path[0] === "cart" && path.length === 1) content = <CartPage />;
  else if (path[0] === "checkout" && path.length === 1)
    content = <CartPage checkout />;
  else if (path[0] === "login" && path.length === 1) content = <Login />;
  else if (path[0] === "wholesale" && path.length === 1)
    content = <Wholesale />;
  else if (path[0] === "request-quote" && path.length === 1)
    content = <RequestQuote />;
  else if (path[0] === "contact" && path.length === 1) content = <Contact />;
  else if (path[0] === "about" && path.length === 1) content = <About />;
  else if (path[0] === "sustainability" && path.length === 1)
    content = <Sustainability />;
  else if (path[0] === "faq" && path.length === 1) content = <FAQ />;
  else if (path[0] === "industries" && path.length <= 2) {
    if (
      path[1] &&
      ![
        "food-retail",
        "packaging-logistics",
        "manufacturing-furniture",
      ].includes(path[1])
    )
      notFound();
    content = <Industries slug={path[1]} />;
  } else if (
    (path[0] === "order-success" && path.length === 2) ||
    (path[0] === "account" && path[1] === "orders" && path.length === 3)
  ) {
    const order = await db.order.findFirst({
      where: {
        id: path[0] === "order-success" ? path[1] : path[2],
        ...(user?.role === "ADMIN" ? {} : { userId: user?.id ?? "NO_ACCESS" }),
      },
      include: { items: true },
    });
    if (!order) notFound();
    content = (
      <OrderDetails
        order={serialize<OrderView>(order)}
        success={path[0] === "order-success"}
      />
    );
  } else if (path[0] === "account" && path.length === 1) {
    const [orders, quotes] = user
      ? await Promise.all([
          db.order.findMany({
            where: { userId: user.id },
            include: { items: true },
            orderBy: { createdAt: "desc" },
          }),
          db.quoteRequest.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
          }),
        ])
      : [[], []];
    content = (
      <Account
        orders={serialize<OrderView[]>(orders)}
        quotes={serialize<QuoteView[]>(quotes)}
      />
    );
  } else if (path[0] === "admin" && path.length <= 2) {
    if (
      path[1] &&
      !["orders", "quotes", "products", "applications", "messages"].includes(
        path[1],
      )
    )
      notFound();
    const [orders, quotes, applications, messages] = isAdmin
      ? await Promise.all([
          db.order.findMany({
            include: { items: true },
            orderBy: { createdAt: "desc" },
          }),
          db.quoteRequest.findMany({ orderBy: { createdAt: "desc" } }),
          db.wholesaleApplication.findMany({ orderBy: { createdAt: "desc" } }),
          db.contactSubmission.findMany({ orderBy: { createdAt: "desc" } }),
        ])
      : [[], [], [], []];
    content = (
      <Admin
        section={path[1]}
        orders={serialize<OrderView[]>(orders)}
        quotes={serialize<QuoteView[]>(quotes)}
        applications={serialize<ApplicationView[]>(applications)}
        messages={serialize<ContactView[]>(messages)}
      />
    );
  } else notFound();
  return (
    <StoreProvider
      locale={locale}
      products={products}
      categories={categories}
      user={user}
      demo={DEMO}
    >
      <a className="skip-link" href="#main">
        {locale === "tr" ? "İçeriğe geç" : "Skip to content"}
      </a>
      <Header />
      <main id="main" lang={locale}>
        {content}
      </main>
      {!isAdmin && <Footer />}
    </StoreProvider>
  );
}
