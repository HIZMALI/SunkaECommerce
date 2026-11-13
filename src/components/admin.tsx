"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Package,
  Users,
  MessageSquare,
  ArrowUpRight,
  Search,
  CheckCircle2,
  Settings2,
} from "lucide-react";
import type {
  ApplicationView,
  ContactView,
  OrderView,
  Product,
  QuoteView,
} from "@/lib/types";
import { useStore } from "./store";
import { A, Arrow, DemoNote, Modal, Photo } from "./ui";
import { Status } from "./commerce";
import { Field, FormError, useFormAction } from "./forms";
import { money } from "@/lib/pricing";
export function Admin({
  section = "overview",
  orders,
  quotes,
  applications,
  messages,
}: {
  section?: string;
  orders: OrderView[];
  quotes: QuoteView[];
  applications: ApplicationView[];
  messages: ContactView[];
}) {
  const { t, val, products, user, locale } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  if (user?.role !== "ADMIN")
    return (
      <div className="wrap account-guest">
        <h1>
          {t("Administrator access required.", "Yönetici erişimi gerekiyor.")}
        </h1>
        <p>
          {t(
            "Sign in with an administrator account to view this space.",
            "Bu alanı görmek için yönetici hesabıyla giriş yapın.",
          )}
        </p>
        <A href="/login" className="button">
          {t("Sign in", "Giriş yap")}
          <Arrow />
        </A>
      </div>
    );
  const nav = [
    ["overview", LayoutDashboard, t("Overview", "Genel bakış")],
    ["orders", ShoppingBag, t("Orders", "Siparişler")],
    ["quotes", FileText, t("Quote requests", "Teklif talepleri")],
    ["products", Package, t("Product catalogue", "Ürün kataloğu")],
    ["applications", Users, t("Wholesale applications", "Toptan başvuruları")],
    ["messages", MessageSquare, t("Contact messages", "İletişim mesajları")],
  ] as const;
  const heading = nav.find((n) => n[0] === section)?.[2] ?? nav[0][2];
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <p className="eyebrow">{t("THE BUSINESS SPACE", "İŞLETME ALANI")}</p>
        <h2>Sun-Ka / Larton</h2>
        <p className="admin-mode">
          {t("Local demonstration", "Yerel gösterim")}
        </p>
        <nav>
          {nav.map(([id, Icon, name]) => (
            <A
              className={section === id ? "active" : ""}
              key={id}
              href={id === "overview" ? "/admin" : `/admin/${id}`}
            >
              <Icon size={18} />
              {name}
              {id === "applications" && (
                <span>
                  {applications.filter((a) => a.status === "PENDING").length}
                </span>
              )}
            </A>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <span className="avatar">SA</span>
          <div>
            <strong>{t("Demo administrator", "Demo yöneticisi")}</strong>
            <p>{user.email}</p>
          </div>
        </div>
      </aside>
      <section className="admin-main">
        <div className="admin-topbar">
          <span>
            {t("Administration", "Yönetim")} / {heading}
          </span>
          <A href="/" className="text-link">
            {t("View storefront", "Mağazayı görüntüle")}
            <ArrowUpRight size={16} />
          </A>
        </div>
        <div className="admin-content">
          <div className="admin-page-heading">
            <div>
              <p className="eyebrow">
                {t(
                  "SUN-KA / LARTON · DEMO WORKSPACE",
                  "SUN-KA / LARTON · DEMO ÇALIŞMA ALANI",
                )}
              </p>
              <h1>
                {section === "overview"
                  ? t(
                      "A clear view of your business.",
                      "İşletmenize net bir bakış.",
                    )
                  : heading}
              </h1>
              <p>
                {t(
                  "Sample operations. Real local records.",
                  "Örnek işlemler. Gerçek yerel kayıtlar.",
                )}
              </p>
            </div>
            <span className="admin-demo-badge">
              <span />
              DEMO
            </span>
          </div>
          <div className="admin-warning">
            {t(
              "All figures and identities below are demonstration data, not actual Sun-Ka sales or customer information.",
              "Aşağıdaki tüm rakam ve kimlikler demo verisidir; gerçek Sun-Ka satış veya müşteri bilgileri değildir.",
            )}
          </div>
          {section === "overview" ? (
            <>
              <div className="kpi-grid">
                {[
                  [
                    ShoppingBag,
                    t("Demo orders", "Demo siparişler"),
                    String(orders.length),
                    t(
                      "Locally recorded purchase orders",
                      "Yerel kaydedilen satın alma siparişleri",
                    ),
                  ],
                  [
                    FileText,
                    t("Quote requests", "Teklif talepleri"),
                    String(quotes.length),
                    `${quotes.filter((q) => q.status === "NEW").length} ${t("awaiting review", "inceleme bekliyor")}`,
                  ],
                  [
                    Users,
                    t("Pending applications", "Bekleyen başvurular"),
                    String(
                      applications.filter((a) => a.status === "PENDING").length,
                    ),
                    t(
                      "Wholesale account reviews",
                      "Toptan müşteri hesabı incelemeleri",
                    ),
                  ],
                  [
                    Package,
                    t("Demo order value", "Demo sipariş değeri"),
                    money(
                      orders.reduce((n, o) => n + o.totalCents, 0),
                      locale,
                    ),
                    t(
                      "USD estimates · includes seed samples",
                      "USD tahminleri · seed örnekleri dâhil",
                    ),
                  ],
                ].map(([Icon, label, value, desc]) => (
                  <article key={String(label)}>
                    <div>
                      <span>{String(label)}</span>
                      {typeof Icon !== "string" && (
                        <Icon size={19} strokeWidth={1.5} />
                      )}
                    </div>
                    <strong>{String(value)}</strong>
                    <p>{String(desc)}</p>
                  </article>
                ))}
              </div>
              <div className="admin-overview-grid">
                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <h2>{t("Recent demo orders", "Son demo siparişler")}</h2>
                    <A href="/admin/orders">
                      {t("View all", "Tümünü gör")}
                      <Arrow />
                    </A>
                  </div>
                  <OrderTable orders={orders.slice(0, 5)} compact />
                </section>
                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <h2>{t("Quote inbox", "Teklif kutusu")}</h2>
                    <A href="/admin/quotes">
                      <Arrow />
                    </A>
                  </div>
                  <div className="quote-inbox">
                    {quotes.slice(0, 4).map((q) => (
                      <A href="/admin/quotes" key={q.id}>
                        <span className="inbox-icon">
                          <FileText size={20} />
                        </span>
                        <div>
                          <strong>{val(q.family)}</strong>
                          <p>{q.company}</p>
                          <span>{q.id}</span>
                        </div>
                        <Status value={q.status} />
                      </A>
                    ))}
                  </div>
                </section>
              </div>
              <div className="admin-next-actions">
                <div>
                  <span className="eyebrow">
                    {t(
                      "KEEP THE MATERIAL STORY MOVING",
                      "MALZEME HİKÂYESİ DEVAM ETSİN",
                    )}
                  </span>
                  <h2>{t("Your next actions.", "Sonraki adımlarınız.")}</h2>
                </div>
                <A href="/admin/applications">
                  <Users />
                  <span>
                    {t("Review applications", "Başvuruları inceleyin")}
                  </span>
                  <Arrow />
                </A>
                <A href="/admin/products">
                  <Settings2 />
                  <span>
                    {t("Manage sample catalogue", "Örnek kataloğu yönetin")}
                  </span>
                  <Arrow />
                </A>
              </div>
            </>
          ) : section === "orders" ? (
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <h2>
                  {t("All purchase orders", "Tüm satın alma siparişleri")} (
                  {orders.length})
                </h2>
              </div>
              <OrderTable orders={orders} />
            </section>
          ) : section === "quotes" ? (
            <div className="admin-record-list">
              {quotes.map((q) => (
                <QuoteEditor key={q.id} quote={q} />
              ))}
            </div>
          ) : section === "products" ? (
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <h2>
                  {t("Sample product presentations", "Örnek ürün sunumları")} (
                  {products.length})
                </h2>
                <div className="admin-search">
                  <Search size={16} />
                  <input
                    aria-label={t(
                      "Search product catalogue",
                      "Ürün kataloğunda ara",
                    )}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("Search name or SKU", "Ad veya SKU ara")}
                  />
                </div>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>{t("Product", "Ürün")}</th>
                      <th>{t("Mode", "Satış tipi")}</th>
                      <th>{t("Demo unit price", "Demo birim fiyat")}</th>
                      <th>MOQ</th>
                      <th>{t("Visibility", "Görünürlük")}</th>
                      <th>{t("Manage", "Yönet")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter((p) =>
                        `${p.title} ${p.titleTr} ${p.sku}`
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                      )
                      .map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="admin-product-cell">
                              <div>
                                <Photo
                                  src={p.images[0].src}
                                  alt={p.title}
                                  sizes="60px"
                                />
                              </div>
                              <span>
                                <strong>
                                  {locale === "tr" ? p.titleTr : p.title}
                                </strong>
                                <small>{p.sku}</small>
                              </span>
                            </div>
                          </td>
                          <td>
                            {p.saleMode === "QUOTE_ONLY"
                              ? t("Quote only", "Teklif")
                              : t("Demo order", "Demo sipariş")}
                          </td>
                          <td>{money(p.baseCents ?? 0, locale)}</td>
                          <td>{p.moq}</td>
                          <td>
                            <span
                              className={`status ${p.visible ? "status-approved" : "status-pending"}`}
                            >
                              {p.visible
                                ? t("Visible", "Görünür")
                                : t("Hidden", "Gizli")}
                            </span>
                          </td>
                          <td>
                            <button
                              className="table-button"
                              onClick={() => setEditing(p)}
                            >
                              {t("Edit", "Düzenle")}
                              <Arrow />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : section === "applications" ? (
            <div className="admin-record-list">
              {applications.map((a) => (
                <ApplicationEditor key={a.id} application={a} />
              ))}
            </div>
          ) : (
            <div className="admin-record-list">
              {messages.length ? (
                messages.map((m) => (
                  <article className="admin-panel message-panel" key={m.id}>
                    <div className="record-heading">
                      <h2>{m.company}</h2>
                      <span>
                        {new Date(m.createdAt).toLocaleDateString(
                          locale === "tr" ? "tr-TR" : "en-US",
                          { timeZone: "UTC" },
                        )}
                      </span>
                    </div>
                    <p>
                      {m.name} · {m.email}
                    </p>
                    <p className="message-text">{m.message}</p>
                    <p className="muted">
                      {t(
                        "Recorded locally. No email sent.",
                        "Yerel olarak kaydedildi. E-posta gönderilmedi.",
                      )}
                    </p>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <MessageSquare />
                  <h2>
                    {t("The message inbox is clear.", "Mesaj kutusu boş.")}
                  </h2>
                  <A className="text-link" href="/contact">
                    {t(
                      "Try the demo contact form",
                      "Demo iletişim formunu deneyin",
                    )}
                    <Arrow />
                  </A>
                </div>
              )}
            </div>
          )}
          <DemoNote compact />
        </div>
      </section>
      <Modal
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title={t("Edit sample product", "Örnek ürünü düzenle")}
        className="admin-edit-modal"
      >
        {editing && (
          <ProductEditor
            key={editing.id}
            product={editing}
            onSaved={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
function OrderTable({
  orders,
  compact = false,
}: {
  orders: OrderView[];
  compact?: boolean;
}) {
  const { t, locale } = useStore();
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>{t("Order / company", "Sipariş / firma")}</th>
            <th>{t("Demo estimate", "Demo tahmin")}</th>
            <th>{t("Status", "Durum")}</th>
            {!compact && <th>{t("Details", "Ayrıntılar")}</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <strong>{o.id}</strong>
                <small>{o.company}</small>
                <small>
                  {new Date(o.createdAt).toLocaleDateString(
                    locale === "tr" ? "tr-TR" : "en-US",
                    { timeZone: "UTC" },
                  )}
                </small>
              </td>
              <td className="nowrap">{money(o.totalCents, locale)}</td>
              <td>
                {compact ? (
                  <Status value={o.status} />
                ) : (
                  <OrderStatus order={o} />
                )}
              </td>
              {!compact && (
                <td>
                  <details>
                    <summary className="table-button">
                      {t("View order", "Siparişi gör")}
                    </summary>
                    <div className="admin-order-detail">
                      <p>
                        {o.name} · {o.email} · {o.phone}
                      </p>
                      <p>
                        {o.shippingAddress}, {o.country}
                      </p>
                      <p>
                        {t("Billing", "Fatura")}: {o.billingAddress}
                      </p>
                      {o.items.map((i) => (
                        <p key={i.id}>
                          {i.title} — {i.variantLabel}
                          <br />
                          {i.quantity} × {money(i.unitCents, locale)} ={" "}
                          {money(i.totalCents, locale)}
                        </p>
                      ))}
                      <p>{o.notes}</p>
                      <p className="muted">
                        {t(
                          "Purchase Order · Demo only",
                          "Satın alma siparişi · Yalnızca demo",
                        )}
                      </p>
                    </div>
                  </details>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function OrderStatus({ order: o }: { order: OrderView }) {
  const { api, t, val, toast, ready } = useStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <select
      aria-label={`${t("Order status", "Sipariş durumu")} ${o.id}`}
      disabled={busy || !ready}
      value={o.status}
      onChange={async (e) => {
        const status = e.currentTarget.value;
        setBusy(true);
        try {
          await api("admin/order", { id: o.id, status });
          toast(t("Order status saved.", "Sipariş durumu kaydedildi."));
          router.refresh();
        } catch (e) {
          toast((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      {["RECORDED", "IN_REVIEW", "CONFIRMED", "CANCELLED"].map((s) => (
        <option key={s} value={s}>
          {val(s)}
        </option>
      ))}
    </select>
  );
}
function QuoteEditor({ quote: q }: { quote: QuoteView }) {
  const { t, val, toast, locale } = useStore();
  const router = useRouter();
  const form = useFormAction("admin/quote", () => {
    router.refresh();
    toast(
      t(
        "Quote status and demo response saved.",
        "Teklif durumu ve demo yanıt kaydedildi.",
      ),
    );
  });
  return (
    <article className="admin-panel admin-quote">
      <div className="record-heading">
        <div>
          <p className="eyebrow">{q.id}</p>
          <h2>{val(q.family)}</h2>
        </div>
        <Status value={q.status} />
      </div>
      <div className="admin-quote-grid">
        <div>
          <p>
            <strong>{q.company}</strong>
            <br />
            {q.name} · {q.email}
            <br />
            {q.phone} · {q.country}
          </p>
          <p>
            {q.quantity.toLocaleString(locale === "tr" ? "tr-TR" : "en-US")}{" "}
            {t("pieces", "adet")} · {q.dimensions} · {q.thickness}
          </p>
          <p>
            {q.application} · {q.shape} · {q.finish}
          </p>
          <p>{q.notes}</p>
          <small className="muted">
            {new Date(q.createdAt).toLocaleDateString(
              locale === "tr" ? "tr-TR" : "en-US",
              { timeZone: "UTC" },
            )}
          </small>
        </div>
        <form onSubmit={(e) => form.submit(e, { id: q.id })}>
          <Field name="status" label={t("Quote status", "Teklif durumu")}>
            <select name="status" defaultValue={q.status}>
              {["NEW", "IN_REVIEW", "RESPONDED"].map((s) => (
                <option key={s} value={s}>
                  {val(s)}
                </option>
              ))}
            </select>
          </Field>
          <Field
            name="response"
            label={t(
              "Demo response (visible in buyer account)",
              "Demo yanıt (müşteri hesabında görünür)",
            )}
            type="textarea"
            required={false}
            defaultValue={q.response}
            maxLength={3000}
          />
          <FormError error={form.error} />
          <button disabled={form.busy} className="button small-button">
            {t("Save quote", "Teklifi kaydet")}
            <Arrow />
          </button>
        </form>
      </div>
    </article>
  );
}
function ApplicationEditor({
  application: a,
}: {
  application: ApplicationView;
}) {
  const { t, val, api, toast } = useStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function save(status: string) {
    setBusy(true);
    try {
      await api("admin/application", { id: a.id, status });
      router.refresh();
      toast(
        t(
          "Application saved. Account pricing access has been updated.",
          "Başvuru kaydedildi. Hesabın fiyat erişimi güncellendi.",
        ),
      );
    } catch (e) {
      toast((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="admin-panel application-panel">
      <div className="record-heading">
        <div>
          <p className="eyebrow">{a.id}</p>
          <h2>{a.company}</h2>
        </div>
        <Status value={a.status} />
      </div>
      <p>
        {a.name} · {a.email}
        <br />
        {a.phone} · {a.country}
      </p>
      <p>
        {val(a.businessType)} ·{" "}
        {a.monthlyVolume.replace("pcs", t("pcs", "adet"))}
        <br />
        {a.interests}
      </p>
      <p>{a.notes}</p>
      <div className="button-row">
        <button
          className="button small-button"
          disabled={busy || a.status === "APPROVED"}
          onClick={() => save("APPROVED")}
        >
          <CheckCircle2 size={17} />
          {t("Approve account", "Hesabı onayla")}
        </button>
        <button
          className="button secondary small-button"
          disabled={busy || a.status === "REJECTED"}
          onClick={() => save("REJECTED")}
        >
          {t("Reject / remove access", "Reddet / erişimi kaldır")}
        </button>
        {a.status !== "PENDING" && (
          <button
            className="text-link"
            onClick={() => save("PENDING")}
            disabled={busy}
          >
            {t("Return to pending", "Beklemeye al")}
          </button>
        )}
      </div>
    </article>
  );
}
function ProductEditor({
  product: p,
  onSaved,
}: {
  product: Product;
  onSaved: () => void;
}) {
  const { t, categories, title, toast } = useStore();
  const router = useRouter();
  const form = useFormAction("admin/product", () => {
    router.refresh();
    onSaved();
    toast(
      t(
        "Product changes saved to the catalogue.",
        "Ürün değişiklikleri kataloğa kaydedildi.",
      ),
    );
  });
  return (
    <form
      onSubmit={(e) => {
        const f = new FormData(e.currentTarget);
        const tiers = p.tiers.map((_, i) => ({
          minQty: Number(f.get(`tier-${i}-qty`)),
          discountBps: Number(f.get(`tier-${i}-discount`)),
        }));
        form.submit(e, {
          id: p.id,
          visible: f.get("visible") === "true",
          baseCents: Number(f.get("baseCents")),
          moq: Number(f.get("moq")),
          packMultiple: Number(f.get("packMultiple")),
          tiers,
        });
      }}
    >
      <div className="form-grid">
        <Field
          name="title"
          label={t("Product name · EN", "Ürün adı · EN")}
          defaultValue={p.title}
        />
        <Field
          name="titleTr"
          label={t("Product name · TR", "Ürün adı · TR")}
          defaultValue={p.titleTr}
        />
        <Field name="categoryId" label={t("Collection", "Koleksiyon")}>
          <select name="categoryId" defaultValue={p.categoryId}>
            {categories.map((c) => (
              <option value={c.id} key={c.id}>
                {title(c)}
              </option>
            ))}
          </select>
        </Field>
        <Field name="saleMode" label={t("Sale mode", "Satış tipi")}>
          <select name="saleMode" defaultValue={p.saleMode}>
            <option value="STANDARD_ORDER">
              {t("Demo order", "Demo sipariş")}
            </option>
            <option value="QUOTE_ONLY">
              {t("Quote only", "Yalnızca teklif")}
            </option>
          </select>
        </Field>
        <Field
          name="description"
          label={t("Description · EN", "Açıklama · EN")}
          type="textarea"
          maxLength={2000}
          defaultValue={p.description}
          wide
        />
        <Field
          name="descriptionTr"
          label={t("Description · TR", "Açıklama · TR")}
          type="textarea"
          maxLength={2000}
          defaultValue={p.descriptionTr}
          wide
        />
        <Field
          name="baseCents"
          label={t(
            "Demo unit price · USD cents",
            "Demo birim fiyat · USD sent",
          )}
          type="number"
          defaultValue={String(p.baseCents || 100)}
        />
        <Field
          name="moq"
          label={t("Sample MOQ · pieces", "Örnek MOQ · adet")}
          type="number"
          defaultValue={String(p.moq)}
        />
        <Field
          name="packMultiple"
          label={t("Order multiple · pieces", "Sipariş katı · adet")}
          type="number"
          defaultValue={String(p.packMultiple)}
        />
        <Field
          name="visible"
          label={t("Storefront visibility", "Mağaza görünürlüğü")}
        >
          <select name="visible" defaultValue={String(p.visible)}>
            <option value="true">{t("Visible", "Görünür")}</option>
            <option value="false">{t("Hidden", "Gizli")}</option>
          </select>
        </Field>
      </div>
      <h3 className="tiers-edit-title">
        {t(
          "Demo quantity discounts · basis points (800 = 8%)",
          "Demo miktar indirimleri · baz puan (800 = %8)",
        )}
      </h3>
      {p.tiers.map((tier, i) => (
        <div className="form-grid" key={i}>
          <Field
            name={`tier-${i}-qty`}
            label={t("Minimum pieces", "Minimum adet")}
            type="number"
            defaultValue={String(tier.minQty)}
          />
          <Field
            name={`tier-${i}-discount`}
            label={t("Discount · basis points", "İndirim · baz puan")}
            type="number"
            defaultValue={String(tier.discountBps)}
          />
        </div>
      ))}
      <FormError error={form.error} />
      <button disabled={form.busy} className="button full">
        {t("Save sample product", "Örnek ürünü kaydet")}
        <Arrow />
      </button>
    </form>
  );
}
