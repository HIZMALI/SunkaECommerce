"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  ChevronDown,
  ArrowRight,
  Globe2,
  Leaf,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useCartSummary, useStore } from "./store";
import { Button, A, Arrow, DemoNote, Modal, Photo } from "./ui";
import { money } from "@/lib/pricing";
export function Header() {
  const { t, locale, categories, title, cart, setDrawer, user } = useStore();
  const [menu, setMenu] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  function language(lang: string) {
    document.cookie = `sunka_locale=${lang};path=/;max-age=31536000;SameSite=Lax`;
    const q = new URLSearchParams(params.toString());
    if (lang === "en") q.delete("lang");
    else q.set("lang", lang);
    router.push(`${pathname}${q.size ? "?" + q : ""}`);
    setMenu(false);
  }
  const nav = (
    <>
      <Button
        className="nav-dropdown"
        onClick={() => setMenu(!menu)}
        aria-expanded={menu}
        aria-controls="product-menu"
      >
        {t("Products", "Ürünler")}
        <ChevronDown size={13} />
      </Button>
      <A href="/industries">{t("Industries", "Sektörler")}</A>
      <A href="/wholesale">{t("Wholesale", "Toptan Satış")}</A>
      <A href="/request-quote">{t("Custom Solutions", "Özel Çözümler")}</A>
      <A href="/sustainability">{t("Sustainability", "Sürdürülebilirlik")}</A>
    </>
  );
  return (
    <>
      <div className="announcement">
        <span>
          {t(
            "Made for business. Considered for the planet.",
            "İşiniz için üretildi. Gelecek düşünülerek tasarlandı.",
          )}
        </span>
        <span className="announcement-right">
          <A href="/about">{t("About", "Hakkımızda")}</A>
          <span>·</span>
          <A href="/contact">{t("Contact", "İletişim")}</A>
          <span>·</span>
          {t("Wholesale & made-to-order", "Toptan ve özel üretim")}{" "}
          <span>·</span>{" "}
          <A href="/demo-guide">
            {t("B2B DEMO · TRY IT", "B2B DEMO · DENEYİN")}
          </A>
        </span>
      </div>
      <header className="header">
        <div className="header-inner">
          <Button
            className="icon-btn hamburger"
            aria-label={t("Open menu", "Menüyü aç")}
            onClick={() => setMobile(true)}
          >
            <Menu size={23} />
          </Button>
          <A href="/" className="logo" aria-label="Sun-Ka / Larton home">
            <Image
              src="/images/logo.png"
              width={110}
              height={57}
              alt="Sun-Ka / Larton"
              priority
            />
          </A>
          <nav
            className="desktop-nav"
            aria-label={t("Main navigation", "Ana gezinme")}
          >
            {nav}
          </nav>
          <div className="header-actions">
            <div className="locale-switch" aria-label={t("Language", "Dil")}>
              <Button
                className={locale === "en" ? "active" : ""}
                onClick={() => language("en")}
              >
                EN
              </Button>
              <span>/</span>
              <Button
                className={locale === "tr" ? "active" : ""}
                onClick={() => language("tr")}
              >
                TR
              </Button>
            </div>
            <Button
              className="icon-btn"
              aria-label={t("Search", "Ara")}
              onClick={() => setSearch(true)}
            >
              <Search size={20} />
            </Button>
            <A
              href="/account"
              className="icon-btn account-icon"
              aria-label={t("Account", "Hesabım")}
            >
              <UserRound size={20} />
              {user && <i />}
            </A>
            <Button
              className="icon-btn bag-btn"
              aria-label={t("Open cart", "Sepeti aç")}
              onClick={() => setDrawer(true)}
            >
              <ShoppingBag size={20} />
              <span>{cart.length}</span>
            </Button>
          </div>
        </div>
        {menu && (
          <>
            <Button
              className="mega-backdrop"
              aria-label={t("Close menu", "Menüyü kapat")}
              onClick={() => setMenu(false)}
            />
            <div className="mega" id="product-menu">
              <div>
                <p className="eyebrow">
                  {t("THE MATERIAL COLLECTION", "MALZEME KOLEKSİYONU")}
                </p>
                <h2>
                  {t("A better board.", "Daha iyi bir altlık.")}
                  <br />
                  {t("For every purpose.", "Her amaç için.")}
                </h2>
                <A
                  href="/products"
                  className="text-link"
                  onClick={() => setMenu(false)}
                >
                  {t("Explore all products", "Tüm ürünleri keşfet")}
                  <Arrow />
                </A>
              </div>
              <div className="mega-links">
                {categories.map((c) => (
                  <A
                    key={c.id}
                    href={`/collections/${c.id}`}
                    onClick={() => setMenu(false)}
                  >
                    {title(c)}
                    <Arrow />
                  </A>
                ))}
              </div>
              <A
                href="/request-quote"
                className="mega-image"
                onClick={() => setMenu(false)}
              >
                <Photo
                  src="/images/corner-kraft-detail.webp"
                  alt="Sun-Ka kraft cornerboard profiles"
                />
                <span>
                  {t(
                    "Your dimensions. Our material.",
                    "Sizin ölçüleriniz. Bizim malzememiz.",
                  )}{" "}
                  <Arrow />
                </span>
              </A>
            </div>
          </>
        )}
      </header>
      <Modal
        open={mobile}
        onOpenChange={setMobile}
        drawer
        title={t("Explore Sun-Ka", "Sun-Ka’yı keşfedin")}
      >
        <div className="mobile-links">
          {[
            ["/products", t("All products", "Tüm ürünler")],
            ...categories.map((c) => [`/collections/${c.id}`, title(c)]),
            ["/industries", t("Industries", "Sektörler")],
            ["/wholesale", t("Wholesale", "Toptan Satış")],
            ["/request-quote", t("Custom quote", "Özel teklif")],
            ["/sustainability", t("Sustainability", "Sürdürülebilirlik")],
            ["/about", t("About", "Hakkımızda")],
            ["/contact", t("Contact", "İletişim")],
            ["/account", t("Account", "Hesabım")],
          ].map(([url, label]) => (
            <A href={url} key={url} onClick={() => setMobile(false)}>
              {label}
              <Arrow />
            </A>
          ))}
        </div>
      </Modal>
      <Modal
        open={search}
        onOpenChange={setSearch}
        title={t("Find your material", "Malzemenizi bulun")}
      >
        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q");
            router.push(
              `${locale === "tr" ? "/search?lang=tr&" : "/search?"}q=${encodeURIComponent(String(q))}`,
            );
            setSearch(false);
          }}
        >
          <Search size={22} />
          <input
            name="q"
            type="search"
            autoFocus
            required
            placeholder={t(
              "Search products, finishes or SKU…",
              "Ürün, yüzey veya SKU arayın…",
            )}
            aria-label={t("Search products", "Ürün ara")}
          />
          <Button
            className="icon-btn"
            aria-label={t("Show results", "Sonuçları göster")}
          >
            <ArrowRight />
          </Button>
        </form>
        <p className="muted">
          {t(
            "Try “cake”, “kraft”, “gold” or “SK-SAMPLE-001”.",
            "“Pasta”, “kraft”, “gold” veya “SK-SAMPLE-001” deneyin.",
          )}
        </p>
        <div className="search-suggestions">
          {categories.map((c) => (
            <A
              key={c.id}
              href={`/collections/${c.id}`}
              onClick={() => setSearch(false)}
            >
              {title(c)}
              <Arrow />
            </A>
          ))}
        </div>
      </Modal>
      <CartDrawer />
    </>
  );
}
export function CartLines({ compact = false }: { compact?: boolean }) {
  const { t, title, val, locale, remove, update, setDrawer } = useStore();
  const { items } = useCartSummary();
  return (
    <div className={`cart-lines ${compact ? "is-compact" : ""}`}>
      {items.map((i) => (
        <article className="cart-line" key={i.variantId}>
          <A
            href={i.product ? `/products/${i.product.slug}` : "/products"}
            onClick={() => setDrawer(false)}
            className="cart-line-image"
          >
            <Photo
              src={i.product?.images[0].src ?? "/images/cake-die-cut.webp"}
              alt={
                i.product
                  ? title(i.product)
                  : t("Unavailable product", "Ürün kullanılamıyor")
              }
            />
          </A>
          <div className="cart-line-info">
            <A
              href={i.product ? `/products/${i.product.slug}` : "/products"}
              onClick={() => setDrawer(false)}
            >
              <h3>
                {i.product
                  ? title(i.product)
                  : t(
                      "Unavailable product — please remove",
                      "Ürün kullanılamıyor — lütfen kaldırın",
                    )}
              </h3>
            </A>
            <p>
              {i.variant &&
                `${val(i.variant.shape)} · ${i.variant.size} · ${val(i.variant.color)}`}
            </p>
            <p>
              {i.variant &&
                `${i.variant.pack} ${t("pcs / pack", "adet / paket")} · ${i.quantity / (i.variant.pack || 1)} ${t("packs", "paket")}`}
            </p>
            <div className="cart-line-bottom">
              <div className="stepper small">
                <Button
                  aria-label={t("Decrease quantity", "Miktarı azalt")}
                  disabled={i.quantity <= i.minimum}
                  onClick={() =>
                    update(
                      i.variantId,
                      Math.max(i.minimum, i.quantity - i.multiple),
                    )
                  }
                >
                  <Minus size={13} />
                </Button>
                <span>{i.quantity}</span>
                <Button
                  aria-label={t("Increase quantity", "Miktarı artır")}
                  disabled={i.quantity >= (i.variant?.demoCapacity ?? 10000)}
                  onClick={() => update(i.variantId, i.quantity + i.multiple)}
                >
                  <Plus size={13} />
                </Button>
              </div>
              <strong>
                {i.price
                  ? money(i.price.totalCents, locale)
                  : t("Approval required", "Onay gerekli")}
              </strong>
              <Button
                className="icon-btn remove"
                onClick={() => remove(i.variantId)}
                aria-label={t("Remove item", "Ürünü kaldır")}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
function CartDrawer() {
  const { t, drawer, setDrawer, cart, user } = useStore();
  const { total } = useCartSummary();
  return (
    <Modal
      open={drawer}
      onOpenChange={setDrawer}
      drawer
      title={t("Your wholesale cart", "Toptan sepetiniz")}
    >
      {cart.length ? (
        <>
          <div className="drawer-scroll">
            <CartLines compact />
          </div>
          <div className="drawer-bottom">
            <div className="total-row">
              <span>{t("Demo subtotal", "Demo ara toplam")}</span>
              <strong>
                {user?.role !== "PENDING_BUYER" && user ? money(total) : "—"}
              </strong>
            </div>
            <DemoNote compact />
            <A
              href="/cart"
              className="button secondary full"
              onClick={() => setDrawer(false)}
            >
              {t("Review cart", "Sepeti incele")}
              <Arrow />
            </A>
            <A
              href="/checkout"
              className="button full"
              onClick={() => setDrawer(false)}
            >
              {t("Continue to demo checkout", "Demo siparişe devam et")}
              <ArrowRight size={18} />
            </A>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={42} strokeWidth={1} />
          <h2>{t("Room for your next project.", "Yeni projenize yer var.")}</h2>
          <p>
            {t(
              "Explore materials and configure your sample order.",
              "Malzemeleri keşfedip örnek siparişinizi yapılandırın.",
            )}
          </p>
          <A
            className="button"
            href="/products"
            onClick={() => setDrawer(false)}
          >
            {t("Explore products", "Ürünleri keşfet")}
            <Arrow />
          </A>
        </div>
      )}
    </Modal>
  );
}
export function Footer() {
  const { t, categories, title } = useStore();
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <Image
            src="/images/logo-light.png"
            width={208}
            height={94}
            alt="Sun-Ka / Larton"
          />
          <p>
            {t("Paper-based possibilities.", "Kâğıt bazlı olanaklar.")}
            <br />
            {t("Made for your business.", "İşiniz için üretildi.")}
          </p>
          <div className="footer-symbol">
            <Leaf size={16} />
            {t("Materials with a future.", "Geleceği olan malzemeler.")}
          </div>
        </div>
        <div>
          <h3>{t("Explore materials", "Malzemeleri keşfet")}</h3>
          {categories.map((c) => (
            <A key={c.id} href={`/collections/${c.id}`}>
              {title(c)}
            </A>
          ))}
        </div>
        <div>
          <h3>{t("For your business", "İşletmeniz için")}</h3>
          <A href="/wholesale">
            {t("Wholesale accounts", "Toptan müşteri hesabı")}
          </A>
          <A href="/request-quote">
            {t("Request a custom quote", "Özel teklif isteyin")}
          </A>
          <A href="/industries">{t("Industries", "Sektörler")}</A>
          <A href="/account">{t("Your account", "Hesabınız")}</A>
          <A href="/demo-guide">
            {t("How to try the demo", "Demo nasıl denenir?")}
          </A>
          <A href="/faq">
            {t("Frequently asked questions", "Sıkça sorulan sorular")}
          </A>
        </div>
        <div>
          <h3>{t("Let’s talk materials.", "Malzemeleri konuşalım.")}</h3>
          <a href="mailto:sales@sunkapaper.com">sales@sunkapaper.com</a>
          <a href="tel:+12145006690">+1 214 500 6690</a>
          <A href="/contact">
            {t("United States & Türkiye", "ABD ve Türkiye")}
            <Arrow />
          </A>
          <A href="/about">
            {t("About Sun-Ka / Larton", "Sun-Ka / Larton hakkında")}
          </A>
          <A href="/sustainability">
            {t("Our material responsibility", "Malzemeye karşı sorumluluğumuz")}
          </A>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Sun-Ka / Larton.{" "}
          {t("Customer presentation demo.", "Müşteri sunum demosu.")}
        </p>
        <span>
          <Globe2 size={14} /> USD ·{" "}
          {t("Demonstration estimates only", "Yalnızca demo tahminleri")}
        </span>
        <A href="/faq#demo">{t("About this demo", "Demo hakkında")}</A>
      </div>
    </footer>
  );
}
