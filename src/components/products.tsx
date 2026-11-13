"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  SlidersHorizontal,
  Search,
  Minus,
  Plus,
  ZoomIn,
  Check,
  Ruler,
  Layers3,
} from "lucide-react";
import type { Category, Product } from "@/lib/types";
import {
  canPrice,
  money,
  priceCents,
  quantityError,
  orderMultiple,
} from "@/lib/pricing";
import { useStore } from "./store";
import { localValue } from "@/lib/i18n";
import { A, Arrow, Breadcrumb, DemoNote, Modal, Photo } from "./ui";
export function ProductCard({ product: p }: { product: Product }) {
  const { t, title, val, user, locale } = useStore();
  const [quick, setQuick] = useState(false);
  return (
    <article className="product-card">
      <div className="product-stage">
        <A href={`/products/${p.slug}`} className="product-photo">
          <Photo
            src={p.images[0].src}
            alt={p.images[0].alt}
            sizes="(max-width:640px) 48vw, 25vw"
          />
          {p.images[1] && p.images[1].src !== p.images[0].src && (
            <Photo
              className="second-image"
              src={p.images[1].src}
              alt={p.images[1].alt}
              sizes="(max-width:640px) 48vw, 25vw"
            />
          )}
        </A>
        <span className="product-tag">
          {p.saleMode === "QUOTE_ONLY"
            ? t("MADE TO ORDER", "ÖZEL ÜRETİM")
            : t("WHOLESALE", "TOPTAN")}
        </span>
        <button
          className="quick-view"
          onClick={() => setQuick(true)}
          aria-label={`${t("Quick view", "Hızlı bakış")}: ${title(p)}`}
        >
          <Eye size={17} />
          <span>{t("Quick view", "Hızlı bakış")}</span>
        </button>
      </div>
      <div className="product-card-info">
        <p className="product-category">{val(p.subcategory)}</p>
        <A href={`/products/${p.slug}`}>
          <h3>
            {title(p)}
            <Arrow />
          </h3>
        </A>
        <div className="swatch-row">
          {[...new Set(p.variants.map((v) => v.color))].map((c) => (
            <span
              className={`swatch swatch-${c.toLowerCase()}`}
              key={c}
              title={val(c)}
              aria-label={val(c)}
            />
          ))}
          <span>
            {p.variants.length} {t("sample formats", "örnek format")}
          </span>
        </div>
        <div className="card-bottom">
          {p.saleMode === "QUOTE_ONLY" ? (
            <A href={`/request-quote?product=${encodeURIComponent(p.title)}`}>
              {t("Request a custom quote", "Özel teklif isteyin")}
            </A>
          ) : canPrice(user?.role) && p.baseCents !== null ? (
            <span>
              <strong>{money(p.baseCents, locale)}</strong> / {t("pc", "adet")}{" "}
              <small>DEMO</small>
            </span>
          ) : (
            <A href="/login">
              {t(
                "Sign in for wholesale pricing",
                "Toptan fiyatlar için giriş yapın",
              )}
            </A>
          )}
          <span>
            {t("Sample MOQ", "Örnek MOQ")}: {p.moq}
          </span>
        </div>
      </div>
      <Modal
        open={quick}
        onOpenChange={setQuick}
        title={t("Quick view", "Hızlı bakış")}
        className="quick-modal"
      >
        <div className="quick-grid">
          <div className="quick-image">
            <Photo src={p.images[0].src} alt={p.images[0].alt} />
          </div>
          <div>
            <Configurator product={p} compact />
            <A
              className="text-link"
              href={`/products/${p.slug}`}
              onClick={() => setQuick(false)}
            >
              {t("View full product details", "Tüm ürün ayrıntıları")}
              <Arrow />
            </A>
          </div>
        </div>
      </Modal>
    </article>
  );
}
export function Catalog({
  collection,
  search = false,
}: {
  collection?: Category;
  search?: boolean;
}) {
  const { t, products, categories, title, val, user, locale, ready } =
    useStore();
  const params = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const selected = Object.fromEntries(params.entries());
  const category = collection?.id ?? selected.category ?? "";
  const base = products.filter(
    (p) => !collection || p.categoryId === collection.id,
  );
  function change(key: string, value: string) {
    const q = new URLSearchParams(params.toString());
    if (value) q.set(key, value);
    else q.delete(key);
    startTransition(() =>
      router.replace(
        `${search ? "/search" : collection ? `/collections/${collection.id}` : "/products"}${q.size ? "?" + q : ""}`,
        { scroll: false },
      ),
    );
  }
  const list = base
    .filter((p) => {
      const cat = categories.find((c) => c.id === p.categoryId);
      const haystack = [
        p.title,
        p.titleTr,
        p.description,
        p.sku,
        cat?.title,
        cat?.titleTr,
        ...p.variants.flatMap((v) => [
          v.sku,
          v.finish,
          v.color,
          val(v.color),
          val(v.finish),
          v.shape,
          val(v.shape),
        ]),
      ]
        .join(" ")
        .toLowerCase();
      if (selected.q && !haystack.includes(selected.q.toLowerCase()))
        return false;
      if (category && p.categoryId !== category) return false;
      if (selected.industry && p.industry !== selected.industry) return false;
      if (selected.subcategory && p.subcategory !== selected.subcategory)
        return false;
      if (selected.saleMode && p.saleMode !== selected.saleMode) return false;
      return p.variants.some((v) =>
        ["shape", "finish", "color", "size", "thickness"].every(
          (k) => !selected[k] || v[k as keyof typeof v] === selected[k],
        ),
      );
    })
    .sort((a, b) =>
      selected.sort === "name"
        ? title(a).localeCompare(title(b))
        : selected.sort === "price"
          ? (a.baseCents ?? 0) - (b.baseCents ?? 0)
          : a.id.localeCompare(b.id),
    );
  const clear = () => {
    startTransition(() =>
      router.replace(
        `${search ? "/search" : collection ? `/collections/${collection.id}` : "/products"}${selected.lang ? "?lang=" + selected.lang : ""}`,
        { scroll: false },
      ),
    );
  };
  const controls = (
    <>
      <div className="filters-heading">
        <h2>{t("Refine your selection", "Seçiminizi daraltın")}</h2>
        <button disabled={isPending} onClick={clear}>
          {t("Reset", "Sıfırla")}
        </button>
      </div>
      {!collection && (
        <label>
          {t("Product family", "Ürün ailesi")}
          <select
            disabled={!ready || isPending}
            aria-label={t("Product family filter", "Ürün ailesi filtresi")}
            value={category}
            onChange={(e) => change("category", e.target.value)}
          >
            <option value="">{t("All materials", "Tüm malzemeler")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {title(c)}
              </option>
            ))}
          </select>
        </label>
      )}
      {[
        [
          "subcategory",
          t("Product type", "Ürün tipi"),
          [...new Set(base.map((p) => p.subcategory))],
        ],
        [
          "industry",
          t("Application", "Kullanım alanı"),
          [...new Set(base.map((p) => p.industry))],
        ],
        ...(["finish", "color", "shape", "size", "thickness"] as const).map(
          (k) =>
            [
              k,
              {
                finish: t("Surface / finish", "Yüzey / finisaj"),
                color: t("Color", "Renk"),
                shape: t("Shape / profile", "Şekil / profil"),
                size: t("Sample dimensions", "Örnek ölçüler"),
                thickness: t("Sample thickness", "Örnek kalınlık"),
              }[k],
              [...new Set(base.flatMap((p) => p.variants.map((v) => v[k])))],
            ] as [string, string, string[]],
        ),
      ].map(([k, label, opts]) => (
        <label key={String(k)}>
          {label}
          <select
            disabled={!ready || isPending}
            aria-label={String(label)}
            value={selected[String(k)] ?? ""}
            onChange={(e) => change(String(k), e.target.value)}
          >
            <option value="">{t("All options", "Tüm seçenekler")}</option>
            {(opts as string[]).map((v) => (
              <option key={v} value={v}>
                {val(v)}
              </option>
            ))}
          </select>
        </label>
      ))}
      <label>
        {t("Purchase options", "Satın alma seçenekleri")}
        <select
          disabled={!ready || isPending}
          value={selected.saleMode ?? ""}
          onChange={(e) => change("saleMode", e.target.value)}
        >
          <option value="">{t("All options", "Tüm seçenekler")}</option>
          <option value="STANDARD_ORDER">
            {t("Demo order", "Demo sipariş")}
          </option>
          <option value="QUOTE_ONLY">{t("Custom quote", "Özel teklif")}</option>
        </select>
      </label>
      <div className="filter-assistance">
        <Ruler size={22} />
        <h3>{t("A size of your own?", "Size özel bir ölçü mü?")}</h3>
        <p>
          {t(
            "Tell us what your project needs.",
            "Projenizin ihtiyaçlarını paylaşın.",
          )}
        </p>
        <A href="/request-quote" className="text-link">
          {t("Let’s talk", "Konuşalım")}
          <Arrow />
        </A>
      </div>
    </>
  );
  return (
    <div className="catalog-page">
      <div className="wrap">
        <Breadcrumb
          items={
            collection
              ? [
                  { label: t("Products", "Ürünler"), href: "/products" },
                  { label: title(collection) },
                ]
              : [
                  {
                    label: search
                      ? t("Search", "Arama")
                      : t("All materials", "Tüm malzemeler"),
                  },
                ]
          }
        />
        <section
          className={`catalog-hero ${collection ? "collection-hero" : ""}`}
        >
          <div>
            <p className="eyebrow">
              {search
                ? t(
                    "A MATERIAL FOR YOUR NEXT IDEA",
                    "BİR SONRAKİ FİKRİNİZ İÇİN",
                  )
                : t(
                    "THE SUN-KA / LARTON COLLECTION",
                    "SUN-KA / LARTON KOLEKSİYONU",
                  )}
            </p>
            <h1>
              {collection
                ? title(collection)
                : search
                  ? t("Find your material.", "Malzemenizi bulun.")
                  : t("Materials with purpose.", "Amacı olan malzemeler.")}
            </h1>
            <p className="lead">
              {collection
                ? locale === "tr"
                  ? collection.descriptionTr
                  : collection.description
                : t(
                    "Presentation. Protection. Possibility. Explore paperboard solutions made for your business.",
                    "Sunum. Koruma. Olanak. İşletmeniz için üretilen mukavva çözümlerini keşfedin.",
                  )}
            </p>
          </div>
          {collection && (
            <div className="collection-hero-image">
              <Photo src={collection.image} alt={title(collection)} priority />
            </div>
          )}
        </section>
        <div className="collection-pills">
          <A href="/products" className={!category ? "selected" : ""}>
            {t("All materials", "Tüm malzemeler")}
          </A>
          {categories.map((c) => (
            <A
              key={c.id}
              href={`/collections/${c.id}`}
              className={category === c.id ? "selected" : ""}
            >
              {title(c)}
            </A>
          ))}
        </div>
        <div className="catalog-toolbar">
          <form
            className="catalog-search"
            onSubmit={(e) => {
              e.preventDefault();
              change("q", String(new FormData(e.currentTarget).get("q") ?? ""));
            }}
          >
            <button
              type="submit"
              disabled={isPending}
              aria-label={t("Search catalogue", "Katalogda ara")}
            >
              <Search size={18} />
            </button>
            <input
              name="q"
              disabled={!ready || isPending}
              key={selected.q ?? "empty"}
              type="search"
              defaultValue={selected.q ?? ""}
              placeholder={t("Search materials…", "Malzeme ara…")}
              aria-label={t("Catalog search", "Katalog arama")}
            />
          </form>
          <button
            className="filter-toggle"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={17} />
            {t("Filters", "Filtreler")}
          </button>
          <span className="result-count" aria-live="polite">
            {isPending
              ? t("Updating…", "Güncelleniyor…")
              : `${list.length} ${t("materials", "ürün")}`}
          </span>
          <label className="sort-control">
            {t("Sort by", "Sıralama")}
            <select
              disabled={!ready || isPending}
              aria-label={t("Sort products", "Ürünleri sırala")}
              value={selected.sort ?? "featured"}
              onChange={(e) => change("sort", e.target.value)}
            >
              <option value="featured">{t("Featured", "Öne çıkanlar")}</option>
              <option value="name">{t("Name A–Z", "Ad A–Z")}</option>
              {canPrice(user?.role) && (
                <option value="price">
                  {t("Demo price: low to high", "Demo fiyat: artan")}
                </option>
              )}
            </select>
          </label>
        </div>
        <div className="catalog-layout" aria-busy={isPending}>
          <aside className="filters">{controls}</aside>
          <div>
            {Object.keys(selected).some(
              (k) => !["lang", "sort"].includes(k),
            ) && (
              <div className="active-filters">
                {Object.entries(selected)
                  .filter(([k, v]) => !["lang", "sort"].includes(k) && v)
                  .map(([k, v]) => (
                    <button key={k} onClick={() => change(k, "")}>
                      {k === "category"
                        ? title(
                            categories.find((c) => c.id === v) ?? {
                              title: v,
                              titleTr: v,
                            },
                          )
                        : val(v)}{" "}
                      ×
                    </button>
                  ))}
                <button onClick={clear}>
                  {t("Clear all", "Tümünü temizle")}
                </button>
              </div>
            )}
            {list.length ? (
              <div className="product-grid">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Layers3 size={42} strokeWidth={1} />
                <h2>
                  {t("A different combination?", "Farklı bir kombinasyon mu?")}
                </h2>
                <p>
                  {t(
                    "No sample material matches these filters. Try a broader selection or request a custom quote.",
                    "Bu filtrelerle eşleşen örnek ürün yok. Seçimi genişletin veya özel teklif isteyin.",
                  )}
                </p>
                <button className="button" onClick={clear}>
                  {t("Reset filters", "Filtreleri sıfırla")}
                </button>
                <A href="/request-quote" className="text-link">
                  {t("Request a custom quote", "Özel teklif isteyin")}
                  <Arrow />
                </A>
              </div>
            )}
            <DemoNote />
          </div>
        </div>
      </div>
      <Modal
        drawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        title={t("Filter materials", "Ürünleri filtrele")}
      >
        <div className="mobile-filters">{controls}</div>
        <button className="button full" onClick={() => setFiltersOpen(false)}>
          {t("Show", "Göster")}: {list.length} {t("materials", "ürün")}
          <ArrowRight size={18} />
        </button>
      </Modal>
    </div>
  );
}
export function Configurator({
  product: p,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { t, title, val, user, locale, add, demo, buyerDemo, ready } =
    useStore();
  const [vId, setVId] = useState(p.variants[0].id);
  const [quantity, setQuantity] = useState(
    Math.ceil(p.moq / orderMultiple(p.packMultiple, p.variants[0].pack)) *
      orderMultiple(p.packMultiple, p.variants[0].pack),
  );
  const v = p.variants.find((v) => v.id === vId)!;
  const multiple = orderMultiple(p.packMultiple, v.pack);
  const minimum = Math.ceil(p.moq / multiple) * multiple;
  const err = quantityError(quantity, p.moq, multiple, v.demoCapacity);
  function chooseVariant(id: string) {
    const next = p.variants.find((v) => v.id === id)!;
    const step = orderMultiple(p.packMultiple, next.pack);
    setVId(id);
    setQuantity((q) => Math.ceil(Math.max(p.moq, q) / step) * step);
  }
  function chooseAttribute(key: "shape" | "color" | "pack", value: string) {
    const options = p.variants.filter(
      (option) => String(option[key]) === value,
    );
    const next =
      options.find(
        (option) => option.shape === v.shape && option.size === v.size,
      ) ??
      options.find((option) => option.shape === v.shape) ??
      options[0];
    if (next) chooseVariant(next.id);
  }
  const price =
    p.baseCents !== null
      ? priceCents(p.baseCents, v.adjustmentCents ?? 0, quantity, p.tiers)
      : null;
  const approved = canPrice(user?.role);
  const quote = p.saleMode === "QUOTE_ONLY";
  return (
    <div className={`configurator ${compact ? "compact" : ""}`}>
      <p className="eyebrow">
        {val(p.subcategory)}{" "}
        <span className="sample-label">
          {t("SAMPLE CONFIGURATION", "ÖRNEK YAPILANDIRMA")}
        </span>
      </p>
      <h1>{title(p)}</h1>
      <p className="product-description">
        {locale === "tr" ? p.descriptionTr : p.description}
      </p>
      <p className="sku">{v.sku}</p>
      <div className="configuration-fields">
        <label>
          {t("Sample format", "Örnek format")}
          <select
            aria-label={t("Sample format", "Örnek format")}
            value={vId}
            disabled={!ready}
            onChange={(e) => chooseVariant(e.target.value)}
          >
            {p.variants.map((v) => (
              <option key={v.id} value={v.id}>
                {val(v.shape)} · {val(v.size)} · {val(v.color)} · {v.thickness}
              </option>
            ))}
          </select>
        </label>
        <div className="variant-specs">
          <label>
            <small>{t("Shape / profile", "Şekil / profil")}</small>
            <select
              aria-label={t("Sample shape / profile", "Örnek şekil / profil")}
              value={v.shape}
              disabled={
                !ready || new Set(p.variants.map((v) => v.shape)).size === 1
              }
              onChange={(e) => chooseAttribute("shape", e.target.value)}
            >
              {[...new Set(p.variants.map((v) => v.shape))].map((shape) => (
                <option key={shape} value={shape}>
                  {val(shape)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <small>{t("Surface", "Yüzey")}</small>
            <select
              aria-label={t("Sample surface / color", "Örnek yüzey / renk")}
              value={v.color}
              disabled={
                !ready || new Set(p.variants.map((v) => v.color)).size === 1
              }
              onChange={(e) => chooseAttribute("color", e.target.value)}
            >
              {[...new Set(p.variants.map((v) => v.color))].map((color) => (
                <option key={color} value={color}>
                  {val(color)} /{" "}
                  {val(p.variants.find((v) => v.color === color)!.finish)}
                </option>
              ))}
            </select>
          </label>
          {p.categoryId === "grey-board-reels" ? (
            <span>
              <small>{t("Winding requirements", "Sarım gereksinimleri")}</small>
              {t("Defined by quote", "Teklifle tanımlanır")}
            </span>
          ) : (
            <label>
              <small>{t("Sample pack", "Örnek paket")}</small>
              <select
                aria-label={t("Sample pack size", "Örnek paket adedi")}
                value={v.pack}
                disabled={
                  !ready || new Set(p.variants.map((v) => v.pack)).size === 1
                }
                onChange={(e) => chooseAttribute("pack", e.target.value)}
              >
                {[...new Set(p.variants.map((v) => v.pack))].map((pack) => (
                  <option value={pack} key={pack}>
                    {pack} {t("pcs / pack", "adet / paket")}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <p className="configuration-help">
          {t(
            "Sample choices update together to form a valid configuration.",
            "Örnek seçenekler geçerli bir yapılandırma oluşturmak için birlikte güncellenir.",
          )}
        </p>
      </div>
      {quote ? (
        <div className="quote-block">
          <h3>
            {t(
              "Configured for your process.",
              "Sürecinize göre yapılandırılır.",
            )}
          </h3>
          <p>
            {t(
              "Share your required dimensions, volume and application for a specification-led quote.",
              "Ölçü, hacim ve kullanım alanınızı paylaşarak ihtiyacınıza özel teklif isteyin.",
            )}
          </p>
          <A
            className="button full"
            href={`/request-quote?product=${encodeURIComponent(p.title)}&dimensions=${encodeURIComponent(v.size)}`}
          >
            {t("Request a custom quote", "Özel teklif isteyin")}
            <Arrow />
          </A>
        </div>
      ) : approved && price ? (
        <>
          <div className="pricing-tiers">
            <p>
              {t(
                "Illustrative wholesale tiers",
                "Temsili toptan fiyat kademeleri",
              )}{" "}
              <span>DEMO · USD</span>
            </p>
            <div>
              {p.tiers.map((tier) => (
                <button
                  disabled={!ready}
                  className={
                    price.discountBps === tier.discountBps ? "selected" : ""
                  }
                  onClick={() =>
                    setQuantity(
                      Math.ceil(Math.max(tier.minQty, p.moq) / multiple) *
                        multiple,
                    )
                  }
                  key={tier.minQty}
                >
                  <span>
                    {tier.minQty.toLocaleString(
                      locale === "tr" ? "tr-TR" : "en-US",
                    )}
                    + {t("pcs", "adet")}
                  </span>
                  <strong>
                    {money(
                      priceCents(
                        p.baseCents!,
                        v.adjustmentCents ?? 0,
                        tier.minQty,
                        p.tiers,
                      ).unitCents,
                      locale,
                    )}
                  </strong>
                </button>
              ))}
            </div>
          </div>
          <div className="quantity-price">
            <label>
              {t("Quantity (pieces)", "Miktar (adet)")}
              <div className="stepper">
                <button
                  aria-label={t("Decrease quantity", "Miktarı azalt")}
                  disabled={quantity <= minimum}
                  onClick={() =>
                    setQuantity((q) => Math.max(minimum, q - multiple))
                  }
                >
                  <Minus size={15} />
                </button>
                <input
                  aria-label={t("Quantity", "Miktar")}
                  type="number"
                  disabled={!ready}
                  min={minimum}
                  step={multiple}
                  max={v.demoCapacity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <button
                  aria-label={t("Increase quantity", "Miktarı artır")}
                  disabled={quantity >= v.demoCapacity}
                  onClick={() => setQuantity((q) => q + multiple)}
                >
                  <Plus size={15} />
                </button>
              </div>
            </label>
            <div className="price-total">
              <small>{t("Demo estimate", "Demo tahmin")}</small>
              <strong data-testid="product-total">
                {money(price.totalCents, locale)}
              </strong>
              <small>
                {money(price.unitCents, locale)} / {t("pc", "adet")}
              </small>
            </div>
          </div>
          <p className={err ? "form-error" : "muted quantity-hint"}>
            {err
              ? t(
                  `Use at least ${minimum} pieces, in multiples of ${multiple}, up to ${v.demoCapacity}.`,
                  `En az ${minimum} adet, ${multiple} adet katıyla, en fazla ${v.demoCapacity} adet girin.`,
                )
              : t(
                  `${quantity / v.pack} packs × ${v.pack} pieces · sample MOQ ${p.moq}`,
                  `${quantity / v.pack} paket × ${v.pack} adet · örnek MOQ ${p.moq}`,
                )}
          </p>
          <button
            className="button full add-to-cart"
            disabled={!ready || !!err || quantity % v.pack !== 0}
            onClick={() => add({ productId: p.id, variantId: v.id, quantity })}
          >
            {t("Add to wholesale cart", "Toptan sepete ekle")}
            <ArrowRight size={18} />
          </button>
        </>
      ) : (
        <div className="price-gate">
          <h3>
            {user
              ? t(
                  "Your account is awaiting approval.",
                  "Hesabınız onay bekliyor.",
                )
              : t(
                  "A wholesale view, just for your business.",
                  "İşletmenize özel toptan satış görünümü.",
                )}
          </h3>
          <p>
            {t(
              "Approved accounts can explore sample pricing and demo ordering. Custom quotations are open to everyone.",
              "Onaylı hesaplar örnek fiyatları ve demo siparişi keşfedebilir. Herkes özel teklif isteyebilir.",
            )}
          </p>
          {!user && (
            <A className="button full" href="/login">
              {t(
                "Sign in for wholesale pricing",
                "Toptan fiyatlar için giriş yapın",
              )}
              <ArrowRight size={18} />
            </A>
          )}
          {demo && (
            <button className="button secondary full" onClick={buyerDemo}>
              {t("Explore Buyer Demo", "Müşteri demosunu keşfet")}
              <Arrow />
            </button>
          )}
          <A
            className="text-link"
            href={`/request-quote?product=${encodeURIComponent(p.title)}`}
          >
            {t("Request a quote", "Teklif isteyin")}
            <Arrow />
          </A>
        </div>
      )}
      <DemoNote compact />
      <div className="product-promises">
        <span>
          <Check size={15} />
          {t("Official product family", "Resmi ürün ailesi")}
        </span>
        <span>
          <Ruler size={15} />
          {t("Custom formats on request", "Talebe göre özel ölçüler")}
        </span>
      </div>
    </div>
  );
}
export function ProductDetail({ product: p }: { product: Product }) {
  const { t, title, locale, categories, products } = useStore();
  const [image, setImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const c = categories.find((c) => c.id === p.categoryId)!;
  return (
    <div className="wrap product-page">
      <Breadcrumb
        items={[
          { label: t("Products", "Ürünler"), href: "/products" },
          { label: title(c), href: `/collections/${c.id}` },
          { label: title(p) },
        ]}
      />
      <div className="product-detail">
        <div className="product-gallery">
          <button
            className="gallery-main"
            onClick={() => setZoom(true)}
            aria-label={t("Enlarge product photo", "Ürün görselini büyüt")}
          >
            <Photo
              src={p.images[image].src}
              alt={p.images[image].alt}
              priority
            />
            <span className="zoom-icon">
              <ZoomIn size={20} />
            </span>
            <span className="image-index">
              0{image + 1} / 0{p.images.length}
            </span>
          </button>
          <div className="gallery-thumbs">
            {p.images.map((im, n) => (
              <button
                key={n}
                onClick={() => setImage(n)}
                className={n === image ? "active" : ""}
                aria-label={`${t("Photo", "Görsel")} ${n + 1}`}
              >
                <Photo src={im.src} alt={im.alt} sizes="100px" />
              </button>
            ))}
            <p>
              {t(
                "Official family photography. Selected sample formats may differ.",
                "Resmi ürün ailesi fotoğrafı. Seçili örnek format farklı olabilir.",
              )}
            </p>
          </div>
        </div>
        <Configurator product={p} />
      </div>
      <section className="product-information">
        <div>
          <p className="eyebrow">{t("A CLOSER LOOK", "DAHA YAKINDAN")}</p>
          <h2>{t("Material, in detail.", "Malzemenin ayrıntıları.")}</h2>
          <p>{locale === "tr" ? p.descriptionTr : p.description}</p>
          <A className="text-link" href="/request-quote">
            {t("Need something specific?", "Özel bir ihtiyacınız mı var?")}
            <Arrow />
          </A>
        </div>
        <div className="specifications">
          <h3>{t("Technical overview", "Teknik genel bakış")}</h3>
          <dl>
            <div>
              <dt>{t("Product family", "Ürün ailesi")}</dt>
              <dd>{title(c)}</dd>
            </div>
            <div>
              <dt>{t("Application", "Kullanım alanı")}</dt>
              <dd>{localValue(p.industry, locale)}</dd>
            </div>
            <div>
              <dt>{t("Material", "Malzeme")}</dt>
              <dd>{t("Paperboard", "Mukavva")}</dd>
            </div>
            <div>
              <dt>{t("Sample configuration", "Örnek yapılandırma")}</dt>
              <dd>
                {t(
                  "Dimensions, thickness and pack values are representative.",
                  "Ölçü, kalınlık ve paket değerleri temsilidir.",
                )}
              </dd>
            </div>
            <div>
              <dt>{t("Production & logistics", "Üretim ve lojistik")}</dt>
              <dd>
                {t(
                  "Availability, suitability, production and freight are confirmed with the team. No guaranteed delivery time is implied.",
                  "Stok, uygunluk, üretim ve taşıma ekiple teyit edilir. Kesin teslim süresi verilmez.",
                )}
              </dd>
            </div>
          </dl>
          <a
            href={p.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            {t("Official catalogue source", "Resmi katalog kaynağı")}
            <Arrow />
          </a>
        </div>
      </section>
      <section className="section related">
        <div className="section-heading">
          <h2>
            {t(
              "Continue your material story.",
              "Malzeme hikâyenize devam edin.",
            )}
          </h2>
          <A href={`/collections/${c.id}`} className="text-link">
            {t("Explore the family", "Ürün ailesini keşfet")}
            <Arrow />
          </A>
        </div>
        <div className="product-grid four">
          {products
            .filter((q) => q.categoryId === p.categoryId && q.id !== p.id)
            .slice(0, 4)
            .map((q) => (
              <ProductCard key={q.id} product={q} />
            ))}
        </div>
      </section>
      <Modal
        open={zoom}
        onOpenChange={setZoom}
        title={title(p)}
        className="lightbox"
      >
        <div className="lightbox-image">
          <Photo
            src={p.images[image].src}
            alt={p.images[image].alt}
            sizes="90vw"
          />
        </div>
        <div className="lightbox-nav">
          {p.images.map((_, n) => (
            <button
              key={n}
              className="button secondary"
              onClick={() => setImage(n)}
            >
              {n + 1}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
