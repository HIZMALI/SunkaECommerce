"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Leaf,
  Ruler,
  Layers3,
  Globe2,
  ChevronRight,
} from "lucide-react";
import { useStore } from "./store";
import { A, Arrow, Photo } from "./ui";
import { ProductCard } from "./products";
export function Home() {
  const { t, categories, title, products } = useStore();
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="line" />
            {t("PAPER. PURPOSE. POSSIBILITY.", "KÂĞIT. AMAÇ. OLASILIK.")}
          </p>
          <h1>
            {t("Engineered", "Korumak için")}
            <br />
            {t("to protect.", "tasarlandı.")}
            <br />
            <em>{t("Designed", "Sunmak için")}</em>
            <br />
            <em>{t("to present.", "üretildi.")}</em>
          </h1>
          <p className="hero-description">
            {t(
              "Considered paperboard solutions, from the finest presentation to the strongest protection. Made for your business.",
              "En özenli sunumdan güçlü korumaya uzanan mukavva çözümleri. İşinizin ihtiyaçları için üretildi.",
            )}
          </p>
          <div className="hero-actions">
            <A href="/products" className="button">
              {t("Explore the collection", "Koleksiyonu keşfet")}
              <ArrowRight size={18} />
            </A>
            <A href="/request-quote" className="text-link">
              {t("Request a custom quote", "Özel teklif isteyin")}
              <Arrow />
            </A>
          </div>
          <div className="hero-footnote">
            <Leaf size={16} />
            <span>
              {t(
                "Rooted in recycled paper. Ready for what’s next.",
                "Geri dönüştürülmüş kâğıttan. Bir sonraki adım için.",
              )}
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <Photo
            src="/images/cake-gold.webp"
            alt="Official Sun-Ka gold, silver and black cake presentation boards"
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
          />
          <div className="hero-image-label">
            <span>
              01 / {t("THE PRESENTATION COLLECTION", "SUNUM KOLEKSİYONU")}
            </span>
            <A
              href="/collections/cake-salmon-boards"
              aria-label={t(
                "Discover presentation boards",
                "Sunum altlıklarını keşfet",
              )}
            >
              <Arrow />
            </A>
          </div>
          <span className="vertical-label">
            SUN-KA / LARTON — {t("MATERIALS WITH PURPOSE", "AMAÇLI MALZEMELER")}
          </span>
        </div>
      </section>
      <div className="proof-strip">
        <span>
          <Leaf />
          {t("Recycled-paper expertise", "Geri dönüştürülmüş kâğıt uzmanlığı")}
        </span>
        <span>
          <Ruler />
          {t("Made-to-order possibilities", "Özel üretim olanakları")}
        </span>
        <span>
          <Layers3 />
          {t("Wholesale by design", "Toptan satış için tasarlandı")}
        </span>
        <span>
          <Globe2 />
          {t("Türkiye to the world", "Türkiye’den dünyaya")}
        </span>
      </div>
      <Finder />
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {t("THE MATERIAL COLLECTION", "MALZEME KOLEKSİYONU")}
            </p>
            <h2>{t("A purpose for every layer.", "Her katmanda bir amaç.")}</h2>
          </div>
          <A href="/products" className="text-link">
            {t("View all materials", "Tüm malzemeler")}
            <Arrow />
          </A>
        </div>
        <div className="category-grid">
          {categories.map((c, n) => (
            <A
              key={c.id}
              href={`/collections/${c.id}`}
              className={`category-tile category-${n}`}
            >
              <div className="category-stage">
                <Photo
                  src={c.image}
                  alt={title(c)}
                  sizes="(max-width: 640px) 80vw, 26vw"
                />
                <span className="tile-number">0{n + 1}</span>
              </div>
              <div className="tile-caption">
                <div>
                  <h3>{title(c)}</h3>
                  <p>
                    {
                      [
                        t(
                          "For moments worth presenting",
                          "Sunmaya değer anlar için",
                        ),
                        t(
                          "Small portions. Great possibilities.",
                          "Küçük porsiyonlar. Büyük olanaklar.",
                        ),
                        t("Protection in every profile", "Her profilde koruma"),
                        t(
                          "The foundation of your next idea",
                          "Bir sonraki fikrinizin temeli",
                        ),
                        t(
                          "Ready for your production line",
                          "Üretim hattınız için hazır",
                        ),
                      ][n]
                    }
                  </p>
                </div>
                <Arrow />
              </div>
            </A>
          ))}
        </div>
      </section>
      <section className="section featured-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {t("SELECTED FOR YOUR BUSINESS", "İŞLETMENİZ İÇİN SEÇİLDİ")}
              </p>
              <h2>
                {t("Made to make an impression.", "İz bırakmak için üretildi.")}
              </h2>
            </div>
            <A href="/products" className="text-link">
              {t("Shop wholesale", "Toptan ürünleri incele")}
              <Arrow />
            </A>
          </div>
          <div className="product-grid four">
            {[products[0], products[2], products[4], products[7]]
              .filter(Boolean)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </div>
      </section>
      <section className="material-story">
        <div className="material-story-image">
          <Photo
            src="/images/corner-kraft-detail.webp"
            alt="Official Sun-Ka kraft cornerboard material profiles"
            sizes="(max-width:760px) 100vw, 50vw"
          />
          <span>
            {t(
              "THOUGHTFUL MATERIALS. LASTING POSSIBILITIES.",
              "ÖZENLİ MALZEMELER. KALICI OLANAKLAR.",
            )}
          </span>
        </div>
        <div className="material-story-copy">
          <p className="eyebrow">
            {t("A BETTER MATERIAL STORY", "DAHA İYİ BİR MALZEME HİKÂYESİ")}
          </p>
          <h2>
            {t("Good for your business.", "İşiniz için iyi.")}
            <br />
            <em>{t("Considered for tomorrow.", "Yarını düşünerek.")}</em>
          </h2>
          <p>
            {t(
              "At Sun-Ka / Larton, recovered paper becomes the foundation for new possibilities. Our manufacturing expertise brings together material responsibility and made-to-order thinking.",
              "Sun-Ka / Larton’da geri kazanılmış kâğıt yeni olanakların temelini oluşturur. Üretim uzmanlığımız, malzeme sorumluluğu ile özel üretim yaklaşımını bir araya getirir.",
            )}
          </p>
          <div className="story-stat">
            <strong>30+</strong>
            <span>
              {t(
                "years of paperboard manufacturing expertise, as stated by Sun-Ka.",
                "Sun-Ka’nın belirttiği mukavva üretim deneyimi.",
              )}
            </span>
          </div>
          <A href="/sustainability" className="text-link light">
            {t(
              "Explore our material responsibility",
              "Malzeme sorumluluğumuzu keşfet",
            )}
            <Arrow />
          </A>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {t("BUILT AROUND YOUR WORLD", "SİZİN DÜNYANIZA GÖRE")}
            </p>
            <h2>
              {t(
                "Different industries. Shared ambition.",
                "Farklı sektörler. Ortak amaç.",
              )}
            </h2>
          </div>
          <A href="/industries" className="text-link">
            {t("Explore industries", "Sektörleri keşfet")}
            <Arrow />
          </A>
        </div>
        <div className="industry-grid">
          {[
            [
              "food-retail",
              "cake-round",
              t("Food & Retail", "Gıda ve Perakende"),
              t(
                "A foundation for beautiful presentation.",
                "Özenli sunumların sağlam temeli.",
              ),
            ],
            [
              "packaging-logistics",
              "industrial",
              t("Packaging & Logistics", "Ambalaj ve Lojistik"),
              t(
                "Considered protection at every stage.",
                "Her aşamada düşünülmüş koruma.",
              ),
            ],
            [
              "manufacturing-furniture",
              "furniture",
              t("Manufacturing & Furniture", "Üretim ve Mobilya"),
              t(
                "Versatile materials for your process.",
                "Süreciniz için çok yönlü malzemeler.",
              ),
            ],
          ].map(([slug, img, name, desc]) => (
            <A
              href={`/industries/${slug}`}
              className="industry-card"
              key={slug}
            >
              <div className="industry-image">
                <Photo src={`/images/${img}.webp`} alt={name} />
              </div>
              <div>
                <h3>
                  {name}
                  <Arrow />
                </h3>
                <p>{desc}</p>
              </div>
            </A>
          ))}
        </div>
      </section>
      <section className="wholesale-steps wrap">
        <div>
          <p className="eyebrow">
            {t("WHOLESALE, WITH CLARITY", "NET BİR TOPTAN SATIŞ DENEYİMİ")}
          </p>
          <h2>
            {t("From material", "Malzemeden")}
            <br />
            <em>{t("to your next move.", "bir sonraki adıma.")}</em>
          </h2>
          <A href="/wholesale" className="text-link">
            {t("How wholesale works", "Toptan satış nasıl işler")}
            <Arrow />
          </A>
        </div>
        <div className="steps">
          {[
            [
              t("Discover", "Keşfedin"),
              t(
                "Find the right board for your application.",
                "Kullanımınıza uygun altlığı bulun.",
              ),
            ],
            [
              t("Configure", "Yapılandırın"),
              t(
                "Choose a sample format, finish and quantity.",
                "Örnek formatı, yüzeyi ve miktarı seçin.",
              ),
            ],
            [
              t("Order or quote", "Sipariş veya teklif"),
              t(
                "Explore a demo order or record your custom requirements.",
                "Demo sipariş oluşturun veya özel ihtiyacınızı kaydedin.",
              ),
            ],
          ].map(([name, desc], i) => (
            <div key={name}>
              <span>0{i + 1}</span>
              <div>
                <h3>{name}</h3>
                <p>{desc}</p>
              </div>
              <ChevronRight size={18} />
            </div>
          ))}
        </div>
      </section>
      <CustomCTA />
    </>
  );
}
export function CustomCTA() {
  const { t } = useStore();
  return (
    <section className="custom-cta">
      <p className="eyebrow">
        {t("YOUR IDEA. OUR EXPERTISE.", "SİZİN FİKRİNİZ. BİZİM UZMANLIĞIMIZ.")}
      </p>
      <h2>
        {t("Let’s make it", "Birlikte, size")}{" "}
        <em>{t("yours.", "özel üretelim.")}</em>
      </h2>
      <p>
        {t(
          "A different dimension, a specific finish, a new possibility. Start with a conversation.",
          "Farklı bir ölçü, özel bir yüzey, yeni bir olanak. Bir konuşmayla başlayalım.",
        )}
      </p>
      <A href="/request-quote" className="button">
        {t("Request a custom quote", "Özel teklif isteyin")}
        <Arrow />
      </A>
    </section>
  );
}
export function Finder() {
  const { t, categories, title, products, href, val } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    industry: "",
    category: "",
    shape: "",
    finish: "",
  });
  const keys = ["industry", "category", "shape", "finish"] as const;
  const eligible = products.filter(
    (p) =>
      (!values.industry || p.industry === values.industry) &&
      (!values.category || p.categoryId === values.category),
  );
  const options =
    step === 0
      ? [
          "Food & Retail",
          "Packaging & Logistics",
          "Manufacturing & Furniture",
        ].map((v) => [v, val(v)])
      : step === 1
        ? categories
            .filter((c) =>
              products.some(
                (p) =>
                  p.categoryId === c.id &&
                  (!values.industry || p.industry === values.industry),
              ),
            )
            .map((c) => [c.id, title(c)])
        : step === 2
          ? [
              ...new Set(
                eligible.flatMap((p) => p.variants.map((v) => v.shape)),
              ),
            ].map((v) => [v, val(v)])
          : [
              ...new Set(
                eligible.flatMap((p) =>
                  p.variants
                    .filter((v) => !values.shape || v.shape === values.shape)
                    .map((v) => v.finish),
                ),
              ),
            ].map((v) => [v, val(v)]);
  return (
    <section className="finder wrap" id="product-finder">
      <div className="finder-intro">
        <p className="eyebrow">{t("THE BOARD FINDER", "ÜRÜN BULUCU")}</p>
        <h2>
          {t("Your purpose.", "Sizin amacınız.")}
          <br />
          <em>{t("The right material.", "Doğru malzeme.")}</em>
        </h2>
      </div>
      <div className="finder-controls">
        <div className="finder-progress">
          {[
            t("Application", "Kullanım"),
            t("Category", "Kategori"),
            t("Shape", "Şekil"),
            t("Finish", "Yüzey"),
          ].map((s, n) => (
            <button
              key={s}
              onClick={() => n < step && setStep(n)}
              className={step === n ? "current" : step > n ? "done" : ""}
              disabled={n > step}
            >
              <span>0{n + 1}</span>
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 3) setStep(step + 1);
            else {
              const query = new URLSearchParams();
              Object.entries(values).forEach(([k, v]) => {
                if (v) query.set(k, v);
              });
              router.push(href("/products?" + query.toString()));
            }
          }}
        >
          <label htmlFor="finder-choice" className="sr-only">
            {t("Board finder selection", "Ürün bulucu seçimi")}
          </label>
          <select
            id="finder-choice"
            value={values[keys[step]]}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                [keys[step]]: e.target.value,
                ...(step === 0
                  ? { category: "", shape: "", finish: "" }
                  : step === 1
                    ? { shape: "", finish: "" }
                    : step === 2
                      ? { finish: "" }
                      : {}),
              }))
            }
          >
            <option value="">
              {
                [
                  t("Choose your application", "Kullanım alanını seçin"),
                  t("Choose a product family", "Ürün ailesini seçin"),
                  t("Any shape", "Tüm şekiller"),
                  t("Any finish", "Tüm yüzeyler"),
                ][step]
              }
            </option>
            {options.map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
          <button className="button">
            {step < 3
              ? t("Next step", "Sonraki adım")
              : t("Find my board", "Ürünleri bul")}
            <ArrowRight size={18} />
          </button>
        </form>
        <p>
          {t(
            "Not sure where to start?",
            "Nereden başlayacağınızı bilmiyor musunuz?",
          )}{" "}
          <A href="/products">
            {t("Explore all materials", "Tüm malzemeleri keşfedin")} ↗
          </A>
        </p>
      </div>
    </section>
  );
}
