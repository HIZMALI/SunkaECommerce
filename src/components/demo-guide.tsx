"use client";
import {
  ArrowRight,
  Check,
  Clock3,
  Info,
  ShoppingBag,
  FileText,
  UserRound,
} from "lucide-react";
import { useStore } from "./store";
import { A, Arrow, Breadcrumb, DemoNote, PageHeading, Photo } from "./ui";
import { canPrice } from "@/lib/pricing";
export function DemoGuide() {
  const { t, demo, user, buyerDemo } = useStore();
  const steps = [
    {
      title: t("Discover the right material", "Doğru malzemeyi keşfedin"),
      description: t(
        "Use the homepage Board Finder: Food & Retail → Cake & Salmon Boards → Round → Metalised. Results link directly to the sample catalogue.",
        "Ana sayfadaki ürün bulucuda Gıda ve Perakende → Pasta ve Somon Altlıkları → Yuvarlak → Metalize seçin. Sonuçlar örnek kataloğa bağlanır.",
      ),
      href: "/#product-finder",
      cta: t("Open the Board Finder", "Ürün bulucuyu aç"),
    },
    {
      title: t("Configure a wholesale sample", "Toptan örneği yapılandırın"),
      description: t(
        "Activate the buyer demo, then open Die Cut Round Boards. Try the format, shape, color and pack controls. Compare the 100 / 500 / 1000 piece demo tiers.",
        "Müşteri demosunu açıp Yuvarlak Kesimli Pasta Altlığı ürününe gidin. Format, şekil, renk ve paket seçeneklerini deneyin. 100 / 500 / 1000 adet demo kademelerini karşılaştırın.",
      ),
      href: "/products/die-cut-round-boards",
      cta: t("Configure a board", "Bir altlık yapılandır"),
    },
    {
      title: t("Create a demo purchase order", "Demo sipariş oluşturun"),
      description: t(
        "Add a sample to the cart, change its quantity and refresh. Continue to checkout using the prefilled fictional company details. Record a Purchase Order (Demo) and find its ID in your account.",
        "Örneği sepete ekleyin, miktarı değiştirip sayfayı yenileyin. Doldurulmuş hayali firma bilgileriyle siparişe devam edin. Demo satın alma siparişini kaydedip numarasını hesabınızda görün.",
      ),
      href: "/cart",
      cta: t("Review the cart", "Sepeti incele"),
    },
    {
      title: t("Request your own specification", "Özel ölçü talep edin"),
      description: t(
        "Select a product family, describe the application and dimensions (for example 55 × 55 × 1100 mm), and record a demo RFQ. Quote status appears in the account.",
        "Ürün ailesini seçip kullanım alanı ve ölçüleri (örneğin 55 × 55 × 1100 mm) belirtin. Demo teklif talebini kaydedin; durumu hesabınızda görünür.",
      ),
      href: "/request-quote",
      cta: t("Start a quote request", "Teklif talebi oluştur"),
    },
    {
      title: t("Explore the business account", "İşletme hesabını keşfedin"),
      description: t(
        "Open order details, start a reorder and review quote requests. A pending account can explore the catalogue and submit enquiries; sample prices unlock only after approval.",
        "Sipariş ayrıntılarını açın, yeniden sipariş başlatın ve teklif taleplerini inceleyin. Bekleyen hesap kataloğu gezip talep oluşturabilir; örnek fiyatlar onaydan sonra açılır.",
      ),
      href: "/account",
      cta: t("Open the account", "Hesabı aç"),
    },
    {
      title: t("Try the management workflow", "Yönetim akışını deneyin"),
      description: t(
        "The presenter can review orders, update quote status, edit sample prices and approve wholesale applications. Hosted administrator access is supplied separately by the presenter.",
        "Sunumu yapan kişi siparişleri görebilir, teklif durumunu ve örnek fiyatları değiştirebilir, müşteri başvurularını onaylayabilir. Yayındaki yönetici erişimi sunumu yapan kişi tarafından ayrıca paylaşılır.",
      ),
      href: "/login",
      cta: t("Open sign in", "Giriş sayfasını aç"),
    },
  ];
  return (
    <div className="wrap content-page demo-guide">
      <Breadcrumb items={[{ label: t("Demo guide", "Demo rehberi") }]} />
      <div className="guide-intro">
        <div>
          <PageHeading
            eyebrow={t(
              "A HANDS-ON WHOLESALE PREVIEW",
              "TOPTAN SATIŞ DENEYİMİNİ KEŞFEDİN",
            )}
            title={t("Take a look around.", "Deneyerek keşfedin.")}
            description={t(
              "A five-minute route through materials, configuration, demo ordering and custom enquiries. No installation is required.",
              "Malzemeler, yapılandırma, demo sipariş ve özel talepler arasında beş dakikalık bir rota. Kurulum gerekmez.",
            )}
          />
          <p className="guide-duration">
            <Clock3 size={16} />
            {t(
              "5–7 minutes · Desktop & mobile",
              "5–7 dakika · Masaüstü ve mobil",
            )}
          </p>
        </div>
        <div className="guide-image">
          <Photo
            src="/images/cake-gold.webp"
            alt={t(
              "Official Sun-Ka presentation-board finish assortment",
              "Resmi Sun-Ka sunum altlığı yüzey çeşitleri",
            )}
            priority
          />
        </div>
      </div>
      <div className="guide-access">
        <div>
          <p className="eyebrow">
            {t("START AS AN APPROVED BUYER", "ONAYLI MÜŞTERİ OLARAK BAŞLAYIN")}
          </p>
          <h2>
            {t("Your sample account is ready.", "Örnek hesabınız hazır.")}
          </h2>
          <p>
            {t(
              "Use the one-click buyer demo or sign in manually with the sample credentials.",
              "Tek tıkla müşteri demosuna geçin veya örnek bilgilerle giriş yapın.",
            )}
          </p>
          <code>buyer@sunka.demo</code>
          <code>BuyerDemo!2026</code>
        </div>
        <div>
          {demo && (
            <button className="button full" onClick={buyerDemo}>
              {canPrice(user?.role) ? (
                <Check size={17} />
              ) : (
                <UserRound size={17} />
              )}{" "}
              {canPrice(user?.role)
                ? t("Buyer demo active", "Müşteri demosu açık")
                : t("Explore Buyer Demo", "Müşteri demosunu keşfet")}
              <ArrowRight size={17} />
            </button>
          )}
          <A className="text-link" href="/products/die-cut-round-boards">
            {t("Open the sample product", "Örnek ürünü aç")}
            <Arrow />
          </A>
        </div>
      </div>
      <div className="notice guide-privacy">
        <Info size={20} />
        <span>
          {t(
            "This is a public demonstration with shared sample records. Use fictional company details and contact information. Orders and enquiries do not trigger payment, email, production or shipping.",
            "Bu, ortak örnek kayıtlar içeren herkese açık bir demodur. Hayali firma ve iletişim bilgileri kullanın. Sipariş ve talepler ödeme, e-posta, üretim veya sevkiyat başlatmaz.",
          )}
        </span>
      </div>
      <ol className="guide-steps">
        {steps.map((step, index) => (
          <li key={index}>
            <span className="guide-step-number">0{index + 1}</span>
            <div>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
              <A className="text-link" href={step.href}>
                {step.cta}
                <Arrow />
              </A>
            </div>
          </li>
        ))}
      </ol>
      <div className="guide-next">
        <ShoppingBag size={25} />
        <div>
          <h2>
            {t(
              "Every amount is a demo estimate.",
              "Tüm tutarlar demo tahminidir.",
            )}
          </h2>
          <p>
            {t(
              "Official photos and product families form the catalogue core. SKU codes, configurations, MOQ, pack sizes and USD prices are representative. Tax, freight and actual suitability require company confirmation.",
              "Katalog resmi fotoğraf ve ürün ailelerine dayanır. SKU, yapılandırma, MOQ, paket ve USD fiyatları temsilidir. Vergi, taşıma ve gerçek ürün uygunluğu şirket teyidi gerektirir.",
            )}
          </p>
        </div>
        <A href="/faq" className="text-link">
          {t("Useful to know", "Bilmekte yarar var")}
          <FileText size={17} />
        </A>
      </div>
      <DemoNote />
    </div>
  );
}
