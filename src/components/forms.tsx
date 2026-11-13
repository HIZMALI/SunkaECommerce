"use client";
import {
  useState,
  cloneElement,
  isValidElement,
  type ReactElement,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  Ruler,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useStore } from "./store";
import { A, Arrow, Breadcrumb, DemoNote, PageHeading, Photo } from "./ui";
export function Field({
  name,
  label,
  type = "text",
  required = true,
  wide = false,
  defaultValue = "",
  placeholder = "",
  minLength,
  maxLength = 200,
  children,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  wide?: boolean;
  defaultValue?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  children?: ReactNode;
}) {
  const { ready, t } = useStore();
  type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  const validationProps = {
    onInvalid: (event: FormEvent<Control>) => {
      const field = event.currentTarget;
      field.setCustomValidity(
        field.validity.valueMissing
          ? t("Please complete this field.", "Lütfen bu alanı doldurun.")
          : field.validity.typeMismatch
            ? t(
                "Please enter a valid email address.",
                "Lütfen geçerli bir e-posta adresi girin.",
              )
            : t(
                "Please check the format and minimum length of this field.",
                "Lütfen bu alanın biçimini ve minimum uzunluğunu kontrol edin.",
              ),
      );
    },
    onInput: (event: FormEvent<Control>) =>
      event.currentTarget.setCustomValidity(""),
  };
  return (
    <label className={`field ${wide ? "wide" : ""}`}>
      <span data-required={required}>{label}</span>
      {(isValidElement(children)
        ? cloneElement(
            children as ReactElement<{
              "aria-label"?: string;
              disabled?: boolean;
              onInvalid?: (event: FormEvent<Control>) => void;
              onInput?: (event: FormEvent<Control>) => void;
            }>,
            {
              "aria-label": label,
              ...validationProps,
              disabled:
                !ready || (children.props as { disabled?: boolean }).disabled,
            },
          )
        : children) ??
        (type === "textarea" ? (
          <textarea
            {...validationProps}
            name={name}
            disabled={!ready}
            aria-label={label}
            required={required}
            defaultValue={defaultValue}
            placeholder={placeholder}
            minLength={minLength}
            maxLength={maxLength}
            rows={4}
          />
        ) : (
          <input
            {...validationProps}
            name={name}
            disabled={!ready}
            aria-label={label}
            type={type}
            required={required}
            defaultValue={defaultValue}
            placeholder={placeholder}
            minLength={minLength}
            maxLength={maxLength}
          />
        ))}
    </label>
  );
}
export function useFormAction(
  path: string,
  onSuccess?: (result: { id?: string; role?: string }) => void,
) {
  const { api, t, ready } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  async function submit(
    e: FormEvent<HTMLFormElement>,
    extra: Record<string, unknown> = {},
  ) {
    e.preventDefault();
    if (busy) return;
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);
    setError("");
    try {
      const r = await api<{ id?: string; role?: string }>(path, {
        ...data,
        ...extra,
      });
      setSuccess(r.id ?? t("Saved", "Kaydedildi"));
      onSuccess?.(r);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return { submit, busy: busy || !ready, error, success };
}
export function FormError({ error }: { error: string }) {
  return error ? (
    <p role="alert" className="form-error error-box">
      {error}
    </p>
  ) : null;
}
export function ContactFields() {
  const { t, user } = useStore();
  return (
    <>
      <Field
        name="company"
        label={t("Company name", "Firma adı")}
        defaultValue={user?.company?.name}
      />
      <Field
        name="name"
        label={t("Contact name", "Yetkili adı")}
        defaultValue={user?.name}
      />
      <Field
        name="email"
        type="email"
        label={t("Business email", "Kurumsal e-posta")}
        defaultValue={user?.email}
      />
      <Field
        name="phone"
        type="tel"
        label={t("Phone number", "Telefon numarası")}
        defaultValue={user?.company?.phone}
      />
      <Field
        name="country"
        label={t("Destination country", "Hedef ülke")}
        defaultValue={user?.company?.country}
      />
    </>
  );
}
function FormSuccess({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  const { t } = useStore();
  return (
    <div className="form-success" role="status">
      <CheckCircle2 size={42} strokeWidth={1.2} />
      <p className="eyebrow">
        {t("RECORDED LOCALLY", "YEREL OLARAK KAYDEDİLDİ")}
      </p>
      <h2>{title}</h2>
      <p className="success-id">{id}</p>
      <p>{description}</p>
      <div className="button-row">
        <A href="/account" className="button">
          {t("Go to your account", "Hesabınıza gidin")}
          <Arrow />
        </A>
        <A href="/products" className="text-link">
          {t("Explore materials", "Malzemeleri keşfet")}
          <Arrow />
        </A>
      </div>
      <DemoNote />
    </div>
  );
}
export function Login() {
  const { t, demo, buyerDemo, user } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const form = useFormAction("auth/login", (r) => {
    const next = params.get("next");
    router.push(
      r.role === "ADMIN"
        ? "/admin"
        : next && ["/checkout", "/account"].includes(next)
          ? next
          : "/account",
    );
    router.refresh();
  });
  return (
    <div className="login-page">
      <div className="login-editorial">
        <Photo
          src="/images/card-metalised-detail.webp"
          alt="Sun-Ka gold, silver and black metalised cardboard"
          priority
        />
        <div>
          <p className="eyebrow">SUN-KA / LARTON</p>
          <h2>
            {t("Your business.", "Sizin işiniz.")}
            <br />
            <em>
              {t("Our material expertise.", "Bizim malzeme uzmanlığımız.")}
            </em>
          </h2>
        </div>
      </div>
      <div className="login-form">
        <p className="eyebrow">
          {t("THE WHOLESALE SPACE", "TOPTAN MÜŞTERİ ALANI")}
        </p>
        <h1>{t("Welcome back.", "Tekrar hoş geldiniz.")}</h1>
        <p className="lead">
          {t(
            "Your orders, custom enquiries and material possibilities, all in one place.",
            "Siparişleriniz, özel talepleriniz ve malzeme olanaklarınız bir arada.",
          )}
        </p>
        {user && (
          <p className="notice">
            {t(
              "You are already signed in. You can switch accounts below.",
              "Zaten giriş yaptınız. Aşağıdan hesap değiştirebilirsiniz.",
            )}
          </p>
        )}
        <form onSubmit={form.submit}>
          <Field
            name="email"
            label={t("Business email", "Kurumsal e-posta")}
            type="email"
          />
          <Field
            name="password"
            label={t("Password", "Şifre")}
            type="password"
            maxLength={128}
          />
          <FormError error={form.error} />
          <button className="button full" disabled={form.busy}>
            {form.busy
              ? t("Signing in…", "Giriş yapılıyor…")
              : t("Sign in", "Giriş yap")}
            <ArrowRight size={18} />
          </button>
        </form>
        {demo && (
          <div className="buyer-demo-card">
            <span className="sample-label">
              {t("PRESENTATION MODE", "SUNUM MODU")}
            </span>
            <h3>
              {t("Take the buyer’s seat.", "Müşteri deneyimini keşfedin.")}
            </h3>
            <p>
              {t(
                "Try an approved sample account and explore demo wholesale pricing.",
                "Onaylı örnek hesapla demo toptan fiyatları inceleyin.",
              )}
            </p>
            <button
              className="button secondary full"
              onClick={async () => {
                await buyerDemo();
                router.push("/account");
              }}
            >
              {t("Explore Buyer Demo", "Müşteri demosunu keşfet")}
              <Arrow />
            </button>
          </div>
        )}
        <p className="login-apply">
          {t("New to Sun-Ka?", "Sun-Ka’da yeni misiniz?")}{" "}
          <A href="/wholesale">
            {t(
              "Apply for a wholesale account",
              "Toptan müşteri hesabına başvurun",
            )}{" "}
            ↗
          </A>
        </p>
      </div>
    </div>
  );
}
export function RequestQuote() {
  const { t, categories, title, user } = useStore();
  const params = useSearchParams();
  const form = useFormAction("quotes");
  return (
    <div className="wrap form-page">
      <Breadcrumb items={[{ label: t("Custom quote", "Özel teklif") }]} />
      <div className="form-page-grid">
        <aside className="form-intro">
          <p className="eyebrow">
            {t("MADE AROUND YOUR NEEDS", "İHTİYAÇLARINIZA GÖRE ÜRETİM")}
          </p>
          <h1>
            {t("Your dimensions.", "Sizin ölçüleriniz.")}
            <br />
            <em>{t("Our possibilities.", "Bizim olanaklarımız.")}</em>
          </h1>
          <p className="lead">
            {t(
              "Tell us what you have in mind. From a different cut to a production-specific profile, the right conversation starts here.",
              "Aklınızdakini paylaşın. Farklı bir kesimden üretime özel bir profile, doğru konuşma burada başlar.",
            )}
          </p>
          <div className="form-intro-image">
            <Photo
              src="/images/corner-kraft-detail.webp"
              alt="Official Sun-Ka made-to-order edge protection profiles"
            />
          </div>
          <div className="intro-detail">
            <Ruler />
            <div>
              <h3>
                {t("Built around your brief", "İhtiyacınıza göre şekillenir")}
              </h3>
              <p>
                {t(
                  "Dimensions, finish, quantity and application help define the specification.",
                  "Ölçü, yüzey, miktar ve kullanım alanı teknik ihtiyacı tanımlar.",
                )}
              </p>
            </div>
          </div>
          <p className="muted">
            {t(
              "This demo records your enquiry locally. No email is sent and no commercial quote is issued.",
              "Bu demo talebinizi yerel olarak kaydeder. E-posta gönderilmez, ticari teklif verilmez.",
            )}
          </p>
        </aside>
        <div className="form-panel">
          {form.success ? (
            <FormSuccess
              id={form.success}
              title={t(
                "Your material brief is recorded.",
                "Malzeme talebiniz kaydedildi.",
              )}
              description={
                user
                  ? t(
                      "Find your demo RFQ in your account. Its status can be updated by the demo administrator.",
                      "Demo teklif talebini hesabınızda görebilirsiniz. Durumu demo yöneticisi tarafından güncellenebilir.",
                    )
                  : t(
                      "Your guest enquiry is available in the demo administration panel. No email was sent.",
                      "Misafir talebiniz demo yönetim panelinde görüntülenebilir. E-posta gönderilmedi.",
                    )
              }
            />
          ) : (
            <form onSubmit={form.submit}>
              <div className="form-section-title">
                <span>01</span>
                <h2>{t("The material brief", "Malzeme talebi")}</h2>
              </div>
              <div className="form-grid">
                <Field
                  name="family"
                  label={t("Product / family", "Ürün / ürün ailesi")}
                  wide
                >
                  <select
                    name="family"
                    defaultValue={params.get("product") ?? ""}
                    required
                  >
                    <option value="">
                      {t("Select a product family", "Ürün ailesi seçin")}
                    </option>
                    {params.get("product") && (
                      <option value={params.get("product")!}>
                        {params.get("product")}
                      </option>
                    )}
                    {categories.map((c) => (
                      <option key={c.id} value={c.title}>
                        {title(c)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  name="application"
                  label={t("Intended application", "Hedef kullanım")}
                  placeholder={t(
                    "e.g. bakery presentation",
                    "örn. pastane sunumu",
                  )}
                />
                <Field
                  name="shape"
                  label={t("Shape / profile", "Şekil / profil")}
                  required={false}
                />
                <Field
                  name="dimensions"
                  label={t(
                    "Required dimensions (include units)",
                    "İstenen ölçüler (birim belirtin)",
                  )}
                  defaultValue={params.get("dimensions") ?? ""}
                  placeholder="300 × 300 mm"
                />
                <Field
                  name="thickness"
                  label={t(
                    "Thickness (include units)",
                    "Kalınlık (birim belirtin)",
                  )}
                  required={false}
                  placeholder="3 mm"
                />
                <Field
                  name="finish"
                  label={t("Finish / color", "Yüzey / renk")}
                  required={false}
                />
                <Field
                  name="quantity"
                  label={t(
                    "Estimated quantity (pieces)",
                    "Tahmini miktar (adet)",
                  )}
                  type="number"
                />
              </div>
              <div className="form-section-title">
                <span>02</span>
                <h2>{t("Your business", "İşletmeniz")}</h2>
              </div>
              <div className="form-grid">
                <ContactFields />
                <Field
                  name="notes"
                  type="textarea"
                  label={t("Project notes", "Proje notları")}
                  required={false}
                  wide
                  maxLength={2000}
                />
              </div>
              <FormError error={form.error} />
              <DemoNote compact />
              <button className="button full" disabled={form.busy}>
                {form.busy
                  ? t("Recording…", "Kaydediliyor…")
                  : t(
                      "Record demo quote request",
                      "Demo teklif talebini kaydet",
                    )}
                <Arrow />
              </button>
              <p className="form-footnote">
                {t(
                  "No files are uploaded. Describe artwork or technical requirements in the notes.",
                  "Dosya yüklenmez. Baskı ve teknik gereksinimleri notlarda açıklayın.",
                )}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
export function Wholesale() {
  const { t, user, demo, buyerDemo } = useStore();
  const form = useFormAction("applications");
  return (
    <>
      <div className="wrap form-page">
        <Breadcrumb items={[{ label: t("Wholesale", "Toptan Satış") }]} />
        <div className="form-page-grid">
          <aside className="form-intro">
            <p className="eyebrow">
              {t("A PARTNERSHIP IN MATERIALS", "MALZEMEDE İŞ ORTAKLIĞI")}
            </p>
            <h1>
              {t("Good business", "İyi işler,")}
              <br />
              <em>{t("starts here.", "burada başlar.")}</em>
            </h1>
            <p className="lead">
              {t(
                "For bakeries, distributors, packaging specialists and manufacturers. Build your material supply around your business.",
                "Pastaneler, distribütörler, ambalaj uzmanları ve üreticiler için. Malzeme tedarikinizi işinizin etrafında şekillendirin.",
              )}
            </p>
            {[
              [
                Building2,
                t("A dedicated business account", "İşletmenize özel hesap"),
                t(
                  "Keep orders and specifications together.",
                  "Siparişleri ve teknik ihtiyaçları bir arada tutun.",
                ),
              ],
              [
                Ruler,
                t("Made-to-order thinking", "Özel üretim yaklaşımı"),
                t(
                  "Define the size, profile and finish you need.",
                  "İhtiyacınız olan ölçü, profil ve yüzeyi tanımlayın.",
                ),
              ],
              [
                Leaf,
                t("Material responsibility", "Malzeme sorumluluğu"),
                t(
                  "Explore a portfolio rooted in recycled paper expertise.",
                  "Geri dönüştürülmüş kâğıt uzmanlığına dayanan portföyü keşfedin.",
                ),
              ],
            ].map(([Icon, name, desc]) => (
              <div className="intro-detail" key={String(name)}>
                {typeof Icon !== "string" && <Icon size={24} />}
                <div>
                  <h3>{String(name)}</h3>
                  <p>{String(desc)}</p>
                </div>
              </div>
            ))}
            <div className="buyer-demo-card">
              <h3>
                {t("Already have an account?", "Zaten hesabınız var mı?")}
              </h3>
              <A href="/login" className="text-link">
                {t(
                  "Sign in to your wholesale space",
                  "Toptan müşteri alanına giriş yapın",
                )}
                <Arrow />
              </A>
              {demo && (
                <button className="button secondary full" onClick={buyerDemo}>
                  {t("Explore Buyer Demo", "Müşteri demosunu keşfet")}
                  <Arrow />
                </button>
              )}
            </div>
            <p className="muted">
              {t(
                "Apply → Review → Approved access. In this demo, approval is controlled in the administrator panel. No email is sent.",
                "Başvuru → İnceleme → Onaylı erişim. Bu demoda onay yönetim panelinden verilir. E-posta gönderilmez.",
              )}
            </p>
          </aside>
          <div className="form-panel">
            {form.success ? (
              <FormSuccess
                id={form.success}
                title={t(
                  "Your demo application was recorded.",
                  "Demo başvurunuz kaydedildi.",
                )}
                description={t(
                  "Your account is awaiting review. The demo administrator can approve it to unlock sample prices.",
                  "Hesabınız inceleme bekliyor. Demo yöneticisi onayladığında örnek fiyatlara erişebilirsiniz.",
                )}
              />
            ) : (
              <form onSubmit={(e) => form.submit(e).then(() => {})}>
                <div className="form-section-title">
                  <span>01</span>
                  <h2>
                    {t("Wholesale application", "Toptan müşteri başvurusu")}
                  </h2>
                </div>
                <div className="form-grid">
                  <ContactFields />
                  <Field
                    name="businessType"
                    label={t("Business type", "İşletme türü")}
                  >
                    <select name="businessType" required defaultValue="">
                      <option value="" disabled>
                        {t("Select your business", "İşletmenizi seçin")}
                      </option>
                      {[
                        ["Bakery", "Pastane"],
                        ["Distributor", "Distribütör"],
                        ["Packaging", "Ambalaj"],
                        ["Manufacturer", "Üretici"],
                        ["Retail", "Perakende"],
                        ["Other business", "Diğer işletme"],
                      ].map(([en, tr]) => (
                        <option key={en} value={en}>
                          {t(en, tr)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    name="monthlyVolume"
                    label={t("Estimated monthly volume", "Tahmini aylık hacim")}
                  >
                    <select name="monthlyVolume" required defaultValue="">
                      <option value="" disabled>
                        {t("Select a range", "Aralık seçin")}
                      </option>
                      {[
                        "100–1000 pcs",
                        "1000–5000 pcs",
                        "5000–25000 pcs",
                        "25000+ pcs",
                      ].map((value) => (
                        <option key={value} value={value}>
                          {value.replace("pcs", t("pcs", "adet"))}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    name="interests"
                    label={t(
                      "Materials of interest",
                      "İlgilendiğiniz malzemeler",
                    )}
                  />
                  {!user && (
                    <Field
                      name="password"
                      label={t(
                        "Create a password (12+ characters, upper/lowercase & number)",
                        "Şifre oluşturun (12+ karakter, büyük/küçük harf ve rakam)",
                      )}
                      type="password"
                      minLength={12}
                      maxLength={128}
                      wide
                    />
                  )}
                  <Field
                    name="notes"
                    label={t(
                      "Tell us about your business",
                      "İşletmenizi anlatın",
                    )}
                    type="textarea"
                    required={false}
                    maxLength={2000}
                    wide
                  />
                </div>
                <FormError error={form.error} />
                <p className="notice">
                  <ShieldCheck size={18} />
                  {t(
                    "Demo application only. Please use fictional contact and company details.",
                    "Yalnızca demo başvurusu. Lütfen hayali iletişim ve firma bilgileri kullanın.",
                  )}
                </p>
                <button className="button full" disabled={form.busy}>
                  {form.busy
                    ? t("Recording…", "Kaydediliyor…")
                    : t("Record demo application", "Demo başvurusunu kaydet")}
                  <Arrow />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <section className="wrap section wholesale-faq">
        <h2>{t("A few useful answers.", "Birkaç yararlı yanıt.")}</h2>
        <details>
          <summary>
            {t(
              "Who is a wholesale account for?",
              "Toptan müşteri hesabı kimler için?",
            )}
          </summary>
          <p>
            {t(
              "Businesses sourcing presentation and protective paperboard, from independent bakeries to industrial converters.",
              "Bağımsız pastanelerden endüstriyel dönüştürücülere kadar sunum ve koruyucu mukavva tedarik eden işletmeler için.",
            )}
          </p>
        </details>
        <details>
          <summary>
            {t(
              "Can I request a custom format?",
              "Özel format isteyebilir miyim?",
            )}
          </summary>
          <p>
            {t(
              "Yes. Use the custom quote form to describe dimensions, thickness, surface and quantity. The demo records the brief without issuing an offer.",
              "Evet. Özel teklif formunda ölçü, kalınlık, yüzey ve miktarı belirtin. Demo, ticari teklif vermeden talebi kaydeder.",
            )}
          </p>
        </details>
        <details>
          <summary>
            {t(
              "Are these actual wholesale prices?",
              "Bunlar gerçek toptan fiyatlar mı?",
            )}
          </summary>
          <p>
            {t(
              "No. Every displayed USD amount is a demonstration estimate seeded for this presentation.",
              "Hayır. Görünen tüm USD tutarları sunum için oluşturulmuş demo tahminleridir.",
            )}
          </p>
        </details>
      </section>
    </>
  );
}
export function Contact() {
  const { t } = useStore();
  const form = useFormAction("contact");
  return (
    <div className="wrap form-page">
      <Breadcrumb items={[{ label: t("Contact", "İletişim") }]} />
      <PageHeading
        eyebrow={t("LET’S TALK MATERIALS", "MALZEMELERİ KONUŞALIM")}
        title={t("A conversation away.", "Bir konuşma uzağınızda.")}
        description={t(
          "From a material question to your next project, find the right starting point.",
          "Bir malzeme sorusundan bir sonraki projenize, doğru başlangıcı bulun.",
        )}
      />
      <div className="contact-grid">
        <div>
          <div className="contact-office">
            <MapPin />
            <p className="eyebrow">
              {t("UNITED STATES · OFFICE", "ABD · OFİS")}
            </p>
            <h2>Dallas, Texas</h2>
            <p>
              8330 FWY LBJ, STE 820
              <br />
              Dallas, TX 75243, USA
            </p>
            <a href="tel:+12145006690">
              <Phone size={16} />
              +1 214 500 6690
            </a>
            <a href="mailto:sales@sunkapaper.com">
              <Mail size={16} />
              sales@sunkapaper.com
            </a>
          </div>
          <div className="contact-office">
            <MapPin />
            <p className="eyebrow">
              {t("TÜRKİYE · MANUFACTURING", "TÜRKİYE · ÜRETİM")}
            </p>
            <h2>Sungurlu, Çorum</h2>
            <p>
              OSB Mevkii 4. Sokak No:2/1
              <br />
              19302 Sungurlu, Çorum, Türkiye
            </p>
            <a href="tel:+903643110224">
              <Phone size={16} />
              +90 364 311 0224
            </a>
            <a
              href="https://www.sunkapaper.com/contact-and-collaboration-6"
              className="text-link"
              target="_blank"
              rel="noreferrer"
            >
              {t("Official contact information", "Resmi iletişim bilgileri")}
              <Arrow />
            </a>
          </div>
        </div>
        <div className="form-panel">
          {form.success ? (
            <FormSuccess
              id={form.success}
              title={t(
                "Your demo message was recorded.",
                "Demo mesajınız kaydedildi.",
              )}
              description={t(
                "It is available in the local administrator panel. No email was sent to the company.",
                "Yerel yönetim panelinde görüntülenebilir. Şirkete e-posta gönderilmedi.",
              )}
            />
          ) : (
            <form onSubmit={form.submit}>
              <h2>{t("Start a conversation.", "Bir konuşma başlatın.")}</h2>
              <p className="muted">
                {t(
                  "Demo form — messages are saved locally, not sent.",
                  "Demo formu — mesajlar yerel kaydedilir, gönderilmez.",
                )}
              </p>
              <div className="form-grid">
                <Field name="name" label={t("Contact name", "Yetkili adı")} />
                <Field name="company" label={t("Company name", "Firma adı")} />
                <Field
                  name="email"
                  type="email"
                  label={t("Business email", "Kurumsal e-posta")}
                  wide
                />
                <Field
                  name="message"
                  type="textarea"
                  label={t("Your message", "Mesajınız")}
                  minLength={10}
                  maxLength={3000}
                  wide
                />
              </div>
              <FormError error={form.error} />
              <button className="button full" disabled={form.busy}>
                {form.busy
                  ? t("Recording…", "Kaydediliyor…")
                  : t("Record demo message", "Demo mesajını kaydet")}
                <Arrow />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
