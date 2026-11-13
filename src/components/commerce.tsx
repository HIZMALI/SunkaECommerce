"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import type { OrderView, PricedLine, QuoteView } from "@/lib/types";
import { money, canPrice } from "@/lib/pricing";
import { A, Arrow, Breadcrumb, DemoNote, PageHeading } from "./ui";
import { CartLines } from "./chrome";
import { useCartSummary, useStore } from "./store";
import { ContactFields, Field, FormError, useFormAction } from "./forms";
export function CartPage({ checkout = false }: { checkout?: boolean }) {
  const { t, locale, cart, ready, user, api, clear, href } = useStore();
  const { total } = useCartSummary();
  const [validation, setValidation] = useState<{
    key: string;
    data?: { items: PricedLine[]; totalCents: number };
    error?: string;
  } | null>(null);
  const [key] = useState(() => globalThis.crypto.randomUUID());
  const router = useRouter();
  const form = useFormAction("orders", (r) => {
    clear();
    router.push(href(`/order-success/${r.id}`));
    router.refresh();
  });
  const cartKey = JSON.stringify(cart);
  const role = user?.role;
  const validationKey = `${role}:${cartKey}`;
  const validated = validation?.key === validationKey ? validation.data : null;
  const validationError =
    (validation?.key === validationKey ? validation.error : "") ?? "";
  useEffect(() => {
    let active = true;
    if (cart.length && canPrice(role))
      api<{ items: PricedLine[]; totalCents: number }>("cart/price", {
        items: cart,
      })
        .then((r) => {
          if (active) setValidation({ key: validationKey, data: r });
        })
        .catch((e) => {
          if (active) setValidation({ key: validationKey, error: e.message });
        });
    return () => {
      active = false;
    }; /* cart identity is serialized to avoid unrelated provider renders */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey, role]);
  const title = checkout
    ? t("Let’s make it an order.", "Siparişe dönüştürelim.")
    : t(
        "Your next project, in the making.",
        "Bir sonraki projeniz şekilleniyor.",
      );
  return (
    <div className="wrap commerce-page">
      <Breadcrumb
        items={
          checkout
            ? [
                { label: t("Cart", "Sepet"), href: "/cart" },
                { label: t("Demo checkout", "Demo sipariş") },
              ]
            : [{ label: t("Wholesale cart", "Toptan sepet") }]
        }
      />
      <PageHeading
        eyebrow={
          checkout
            ? t(
                "PURCHASE ORDER · DEMONSTRATION ONLY",
                "SATIN ALMA SİPARİŞİ · YALNIZCA DEMO",
              )
            : t("YOUR WHOLESALE SELECTION", "TOPTAN ÜRÜN SEÇİMİNİZ")
        }
        title={title}
      />
      {!ready ? (
        <div
          className="skeleton-block"
          aria-label={t("Loading cart", "Sepet yükleniyor")}
        />
      ) : !cart.length ? (
        <div className="empty-state">
          <ShoppingBag size={45} strokeWidth={1} />
          <h2>
            {t(
              "A fresh start for your material story.",
              "Malzeme hikâyeniz için yeni bir başlangıç.",
            )}
          </h2>
          <p>
            {t(
              "Your cart is empty. Explore our collection to get started.",
              "Sepetiniz boş. Başlamak için koleksiyonumuzu keşfedin.",
            )}
          </p>
          <A href="/products" className="button">
            {t("Explore the collection", "Koleksiyonu keşfet")}
            <Arrow />
          </A>
        </div>
      ) : (
        <div className="commerce-grid">
          <div>
            {checkout ? (
              <>
                <div className="checkout-progress">
                  <span className="done">01 {t("Selection", "Seçim")}</span>
                  <span className="current">
                    02 {t("Business details", "İşletme bilgileri")}
                  </span>
                  <span>03 {t("Confirmation", "Onay")}</span>
                </div>
                {canPrice(user?.role) ? (
                  <form
                    id="checkout-form"
                    className="form-panel"
                    onSubmit={(e) =>
                      form.submit(e, { items: cart, idempotencyKey: key })
                    }
                  >
                    <h2>
                      {t(
                        "Business & delivery details",
                        "İşletme ve teslimat bilgileri",
                      )}
                    </h2>
                    <p className="muted">
                      {t(
                        "Use fictional details for this presentation.",
                        "Bu sunum için hayali bilgiler kullanın.",
                      )}
                    </p>
                    <div className="form-grid">
                      <ContactFields />
                      <Field
                        name="shippingAddress"
                        label={t("Delivery address", "Teslimat adresi")}
                        type="textarea"
                        minLength={10}
                        defaultValue={user?.company?.address}
                        wide
                      />
                      <Field
                        name="billingAddress"
                        label={t("Billing address", "Fatura adresi")}
                        type="textarea"
                        minLength={10}
                        defaultValue={user?.company?.address}
                        wide
                      />
                      <Field
                        name="notes"
                        label={t(
                          "Purchase order reference / notes",
                          "Satın alma referansı / notlar",
                        )}
                        type="textarea"
                        required={false}
                        maxLength={2000}
                        wide
                      />
                    </div>
                    <div className="payment-method">
                      <ShieldCheck size={22} />
                      <div>
                        <strong>
                          {t(
                            "Purchase Order (Demo)",
                            "Satın Alma Siparişi (Demo)",
                          )}
                        </strong>
                        <p>
                          {t(
                            "Request invoice / pay later — demonstration only. No card details and no payment.",
                            "Fatura talebi / sonra ödeme — yalnızca gösterim. Kart bilgisi istenmez, ödeme alınmaz.",
                          )}
                        </p>
                      </div>
                      <span className="radio-check" />
                    </div>
                    <FormError error={form.error} />
                  </form>
                ) : (
                  <div className="price-gate">
                    <h2>
                      {t(
                        "Approved access is required.",
                        "Onaylı erişim gerekiyor.",
                      )}
                    </h2>
                    <p>
                      {t(
                        "Sign in with an approved buyer account to record a demo purchase order.",
                        "Demo siparişi kaydetmek için onaylı müşteri hesabıyla giriş yapın.",
                      )}
                    </p>
                    <A href="/login?next=/checkout" className="button">
                      {t("Sign in", "Giriş yap")}
                      <Arrow />
                    </A>
                    <A href="/wholesale" className="text-link">
                      {t("Apply for an account", "Hesaba başvurun")}
                      <Arrow />
                    </A>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="cart-table-heading">
                  <span>
                    {t(
                      "Material & sample configuration",
                      "Malzeme ve örnek yapılandırma",
                    )}
                  </span>
                  <span>
                    {t("Quantity / demo estimate", "Miktar / demo tahmin")}
                  </span>
                </div>
                <CartLines />
                <A href="/products" className="text-link continue-shopping">
                  {t("Continue exploring", "Keşfetmeye devam et")}
                  <Arrow />
                </A>
              </>
            )}
          </div>
          <aside className="order-summary">
            <p className="eyebrow">
              {t("YOUR DEMO ORDER", "DEMO SİPARİŞİNİZ")}
            </p>
            <h2>{t("Order overview", "Sipariş özeti")}</h2>
            {checkout && <CartLines compact />}
            <div className="summary-line">
              <span>{t("Sample items", "Örnek ürünler")}</span>
              <span>
                {cart.reduce((n, l) => n + l.quantity, 0)} {t("pieces", "adet")}
              </span>
            </div>
            <div className="summary-line">
              <span>{t("Material subtotal", "Malzeme ara toplamı")}</span>
              <span>
                {canPrice(user?.role)
                  ? money(validated?.totalCents ?? total, locale)
                  : "—"}
              </span>
            </div>
            <div className="summary-line">
              <span>{t("Tax & freight", "Vergi ve taşıma")}</span>
              <span>{t("To be confirmed", "Teyit edilecek")}</span>
            </div>
            <div className="summary-total">
              <span>{t("Demo estimate", "Demo tahmin")}</span>
              <strong>
                {canPrice(user?.role)
                  ? money(validated?.totalCents ?? total, locale)
                  : "—"}
              </strong>
            </div>
            <FormError error={validationError} />
            <DemoNote compact />
            {checkout ? (
              <button
                type="submit"
                form="checkout-form"
                className="button full"
                disabled={
                  !validated ||
                  !!validationError ||
                  !canPrice(user?.role) ||
                  form.busy
                }
              >
                {form.busy
                  ? t("Recording order…", "Sipariş kaydediliyor…")
                  : t("Record demo order", "Demo siparişi kaydet")}
                <ArrowRight size={18} />
              </button>
            ) : (
              <A
                href="/checkout"
                className={`button full ${validationError ? "is-disabled" : ""}`}
              >
                {t("Continue to demo checkout", "Demo siparişe devam et")}
                <ArrowRight size={18} />
              </A>
            )}
            <A href="/request-quote" className="text-link">
              {t("Need a custom quotation?", "Özel bir teklif mi gerekiyor?")}
              <Arrow />
            </A>
          </aside>
        </div>
      )}
    </div>
  );
}
export function OrderDetails({
  order: o,
  success = false,
}: {
  order: OrderView;
  success?: boolean;
}) {
  const { t, val, locale, setCart, toast, href } = useStore();
  const router = useRouter();
  return (
    <div className="wrap order-page">
      <Breadcrumb
        items={[
          { label: t("Account", "Hesabım"), href: "/account" },
          { label: o.id },
        ]}
      />
      {success ? (
        <div className="order-success-heading">
          <CheckCircle2 size={46} strokeWidth={1.2} />
          <p className="eyebrow">
            {t(
              "DEMO PURCHASE ORDER RECORDED",
              "DEMO SATIN ALMA SİPARİŞİ KAYDEDİLDİ",
            )}
          </p>
          <h1>
            {t("Your next move, recorded.", "Bir sonraki adımınız kaydedildi.")}
          </h1>
          <p>
            {t(
              "No payment was collected. No email was sent. This sample order is saved in your account and the demo admin panel.",
              "Ödeme alınmadı. E-posta gönderilmedi. Örnek sipariş hesabınıza ve demo yönetim paneline kaydedildi.",
            )}
          </p>
          <strong>{o.id}</strong>
        </div>
      ) : (
        <PageHeading
          eyebrow={t("DEMO ORDER DETAILS", "DEMO SİPARİŞ AYRINTILARI")}
          title={o.id}
        />
      )}
      <div className="commerce-grid">
        <div className="record-panel">
          <div className="record-heading">
            <h2>{t("Your materials", "Malzemeleriniz")}</h2>
            <Status value={o.status} />
          </div>
          {o.items.map((i) => (
            <div className="order-item" key={i.id}>
              <div>
                <h3>{locale === "tr" ? i.titleTr : i.title}</h3>
                <p>{val(i.variantLabel)}</p>
                <span>
                  {i.quantity} {t("pieces", "adet")} ×{" "}
                  {money(i.unitCents, locale)}
                </span>
              </div>
              <strong>{money(i.totalCents, locale)}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>{t("Demo total", "Demo toplam")}</span>
            <strong>{money(o.totalCents, locale)}</strong>
          </div>
          <DemoNote compact />
        </div>
        <aside className="record-panel">
          <h2>{t("Business & delivery", "İşletme ve teslimat")}</h2>
          <p>
            <strong>{o.company}</strong>
            <br />
            {o.name}
            <br />
            {o.email}
            <br />
            {o.phone}
          </p>
          <p>
            {o.shippingAddress}
            <br />
            {o.country}
          </p>
          <p className="muted">
            {t("Billing", "Fatura")}: {o.billingAddress}
          </p>
          {o.notes && (
            <p>
              {t("Notes", "Notlar")}: {o.notes}
            </p>
          )}
          <button
            className="button secondary full"
            onClick={() => {
              setCart(
                o.items.map((i) => ({
                  productId: i.productId,
                  variantId: i.variantId,
                  quantity: i.quantity,
                })),
              );
              toast(
                t(
                  "Sample items restored. Current availability and pricing will be checked.",
                  "Örnek ürünler eklendi. Güncel fiyat ve uygunluk kontrol edilecek.",
                ),
              );
              router.push(href("/cart"));
            }}
          >
            <RotateCcw size={16} />
            {t("Start a reorder", "Yeniden sipariş başlat")}
          </button>
          <A href="/account" className="text-link">
            {t("View your account", "Hesabınızı görüntüleyin")}
            <Arrow />
          </A>
        </aside>
      </div>
    </div>
  );
}
export function Status({ value }: { value: string }) {
  const { val } = useStore();
  return (
    <span className={`status status-${value.toLowerCase()}`}>
      {val(value).replaceAll("_", " ")}
    </span>
  );
}
export function Account({
  orders,
  quotes,
}: {
  orders: OrderView[];
  quotes: QuoteView[];
}) {
  const { t, val, user, api, title, locale, ready, toast } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState("orders");
  const [signingOut, setSigningOut] = useState(false);
  const profile = useFormAction("account", () => router.refresh());
  if (!user)
    return (
      <div className="wrap account-guest">
        <PageHeading
          eyebrow={t("YOUR WHOLESALE SPACE", "TOPTAN MÜŞTERİ ALANINIZ")}
          title={t("Good to have you here.", "Sizi burada görmek güzel.")}
          description={t(
            "Sign in to see your orders, enquiries and company profile.",
            "Siparişlerinizi, taleplerinizi ve firma bilgilerinizi görmek için giriş yapın.",
          )}
        />
        <A href="/login" className="button">
          {t("Sign in", "Giriş yap")}
          <Arrow />
        </A>
        <A href="/wholesale" className="text-link">
          {t(
            "Apply for a wholesale account",
            "Toptan müşteri hesabına başvurun",
          )}
          <Arrow />
        </A>
      </div>
    );
  return (
    <div className="wrap account-page">
      <Breadcrumb items={[{ label: t("Account", "Hesabım") }]} />
      <div className="account-heading">
        <PageHeading
          eyebrow={t("YOUR WHOLESALE SPACE", "TOPTAN MÜŞTERİ ALANINIZ")}
          title={`${t("Hello", "Merhaba")}, ${user.name.split(" ")[0]}.`}
          description={user.company?.name}
        />
        <div>
          <Status value={canPrice(user.role) ? "APPROVED" : "PENDING"} />
          <button
            className="text-link"
            disabled={!ready || signingOut}
            onClick={async () => {
              setSigningOut(true);
              try {
                await api("auth/logout", {});
                router.refresh();
              } catch (error) {
                toast((error as Error).message);
                setSigningOut(false);
              }
            }}
          >
            {t("Sign out", "Çıkış yap")}
            <Arrow />
          </button>
          {user.role === "ADMIN" && (
            <A href="/admin" className="text-link">
              {t("Administration", "Yönetim paneli")}
              <Arrow />
            </A>
          )}
        </div>
      </div>
      {!canPrice(user.role) && (
        <div className="notice">
          {t(
            "Your wholesale account is awaiting review. Sample prices and ordering become available after administrator approval. You can request custom quotations now.",
            "Toptan müşteri hesabınız inceleme bekliyor. Yönetici onayından sonra örnek fiyatlar ve sipariş açılır. Şimdi özel teklif talep edebilirsiniz.",
          )}
        </div>
      )}
      <div className="account-tabs">
        {[
          ["orders", t("Orders", "Siparişler")],
          ["quotes", t("Quote requests", "Teklif talepleri")],
          ["profile", t("Company profile", "Firma bilgileri")],
        ].map(([id, name]) => (
          <button
            key={id}
            className={tab === id ? "selected" : ""}
            onClick={() => setTab(id)}
          >
            {name}
            {id === "orders"
              ? ` (${orders.length})`
              : id === "quotes"
                ? ` (${quotes.length})`
                : ""}
          </button>
        ))}
      </div>
      {tab === "orders" ? (
        <div className="account-records">
          {orders.length ? (
            orders.map((o) => (
              <A
                href={`/account/orders/${o.id}`}
                className="account-record"
                key={o.id}
              >
                <div>
                  <span className="eyebrow">{o.id}</span>
                  <h3>
                    {title(
                      o.items[0] ?? { title: "Order", titleTr: "Sipariş" },
                    )}
                    {o.items.length > 1 ? ` +${o.items.length - 1}` : ""}
                  </h3>
                  <p>
                    {new Date(o.createdAt).toLocaleDateString(
                      locale === "tr" ? "tr-TR" : "en-US",
                      { dateStyle: "medium", timeZone: "UTC" },
                    )}{" "}
                    · {o.items.reduce((n, i) => n + i.quantity, 0)}{" "}
                    {t("pieces", "adet")}
                  </p>
                </div>
                <Status value={o.status} />
                <strong>
                  {money(o.totalCents, locale)} <small>DEMO</small>
                </strong>
                <Arrow />
              </A>
            ))
          ) : (
            <div className="empty-state">
              <ShoppingBag />
              <h2>
                {t(
                  "Your first material story starts here.",
                  "İlk malzeme hikâyeniz burada başlıyor.",
                )}
              </h2>
              <A className="button" href="/products">
                {t("Explore products", "Ürünleri keşfet")}
                <Arrow />
              </A>
            </div>
          )}
        </div>
      ) : tab === "quotes" ? (
        <div className="account-records">
          {quotes.map((q) => (
            <details className="quote-record" key={q.id}>
              <summary>
                <div>
                  <span className="eyebrow">{q.id}</span>
                  <h3>{val(q.family)}</h3>
                  <p>
                    {q.quantity.toLocaleString(
                      locale === "tr" ? "tr-TR" : "en-US",
                    )}{" "}
                    {t("pieces", "adet")} · {q.dimensions}
                  </p>
                </div>
                <Status value={q.status} />
              </summary>
              <div className="quote-record-detail">
                <p>
                  {q.application} · {q.shape} · {q.finish} · {q.thickness}
                </p>
                <p>{q.notes}</p>
                {q.response && (
                  <p className="notice">
                    {t("Demo response", "Demo yanıt")}: {q.response}
                  </p>
                )}
                <p className="muted">
                  {t(
                    "No commercial offer or email has been issued.",
                    "Ticari teklif veya e-posta gönderilmedi.",
                  )}
                </p>
              </div>
            </details>
          ))}
          {!quotes.length && (
            <p className="empty-state">
              {t("No quote requests yet.", "Henüz teklif talebi yok.")}
            </p>
          )}
          <A className="button" href="/request-quote">
            {t("Start a custom quote", "Özel teklif talebi oluştur")}
            <Arrow />
          </A>
        </div>
      ) : (
        <div className="form-panel profile-panel">
          <form onSubmit={profile.submit}>
            <h2>{t("Company information", "Firma bilgileri")}</h2>
            <div className="form-grid">
              <Field
                name="name"
                label={t("Company name", "Firma adı")}
                defaultValue={user.company?.name}
              />
              <Field
                name="country"
                label={t("Country", "Ülke")}
                defaultValue={user.company?.country}
              />
              <Field
                name="phone"
                label={t("Phone", "Telefon")}
                defaultValue={user.company?.phone}
              />
              <Field
                name="address"
                label={t("Address", "Adres")}
                defaultValue={user.company?.address}
                wide
                type="textarea"
                required={false}
              />
            </div>
            <FormError error={profile.error} />
            {profile.success && (
              <p className="notice" role="status">
                {t("Company profile saved.", "Firma bilgileri kaydedildi.")}
              </p>
            )}
            <button disabled={profile.busy} className="button">
              {t("Save company profile", "Firma bilgilerini kaydet")}
              <Arrow />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
