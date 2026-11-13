"use client";
import { Leaf, Layers3, Ruler, ArrowRight } from "lucide-react";
import { useStore } from "./store";
import { A, Arrow, Breadcrumb, PageHeading, Photo } from "./ui";
import { CustomCTA } from "./home";
const industryData = [
  {
    slug: "food-retail",
    name: "Food & Retail",
    tr: "Gıda ve Perakende",
    image: "cake-round",
    desc: "From the bakery counter to the retail display, the board is part of the presentation.",
    descTr:
      "Pastane tezgâhından perakende vitrinine, altlık sunumun bir parçasıdır.",
    cats: ["cake-salmon-boards", "presentation-boards", "cardboard"],
  },
  {
    slug: "packaging-logistics",
    name: "Packaging & Logistics",
    tr: "Ambalaj ve Lojistik",
    image: "industrial",
    desc: "Paper-based edge protection and cardboard formats for storage, handling and transport.",
    descTr:
      "Depolama, elleçleme ve taşıma için kâğıt bazlı kenar koruma ve mukavva formatları.",
    cats: ["cornerboards", "cardboard"],
  },
  {
    slug: "manufacturing-furniture",
    name: "Manufacturing & Furniture",
    tr: "Üretim ve Mobilya",
    image: "furniture",
    desc: "Sheet, reel and protective profiles that fit into your manufacturing process.",
    descTr:
      "Üretim sürecinize uyarlanabilen levha, bobin ve koruyucu profiller.",
    cats: ["grey-board-reels", "cardboard", "cornerboards"],
  },
];
export function Industries({ slug }: { slug?: string }) {
  const { t, categories, title } = useStore();
  const industry = industryData.find((i) => i.slug === slug);
  return (
    <>
      <div className="wrap content-page">
        <Breadcrumb
          items={
            industry
              ? [
                  { label: t("Industries", "Sektörler"), href: "/industries" },
                  { label: t(industry.name, industry.tr) },
                ]
              : [{ label: t("Industries", "Sektörler") }]
          }
        />
        <PageHeading
          eyebrow={t(
            "BUILT AROUND YOUR BUSINESS",
            "İŞİNİZİN ETRAFINDA ŞEKİLLENİR",
          )}
          title={
            industry
              ? t(industry.name, industry.tr)
              : t(
                  "Different worlds. The right material.",
                  "Farklı dünyalar. Doğru malzeme.",
                )
          }
          description={
            industry
              ? t(industry.desc, industry.descTr)
              : t(
                  "Explore Sun-Ka / Larton paperboard through the needs of your industry.",
                  "Sun-Ka / Larton mukavvalarını sektörünüzün ihtiyaçlarıyla keşfedin.",
                )
          }
        />
        {industry ? (
          <>
            <div className="industry-feature">
              <div className="industry-feature-image">
                <Photo
                  src={`/images/${industry.image}.webp`}
                  alt={t(industry.name, industry.tr)}
                  priority
                />
              </div>
              <div>
                <p className="eyebrow">
                  {t("MATERIALS FOR YOUR PROCESS", "SÜRECİNİZ İÇİN MALZEMELER")}
                </p>
                <h2>
                  {t("A considered starting point.", "Özenli bir başlangıç.")}
                </h2>
                <p>
                  {t(
                    "Every project has its own requirements. Explore the relevant families, then define the dimensions, surface and quantity with a sample configuration or custom brief.",
                    "Her projenin kendine özgü gereksinimleri vardır. İlgili aileleri keşfedin; ardından örnek yapılandırma veya özel taleple ölçü, yüzey ve miktarı tanımlayın.",
                  )}
                </p>
                {industry.cats.map((id) => {
                  const c = categories.find((c) => c.id === id)!;
                  return (
                    <A
                      className="industry-family"
                      key={id}
                      href={`/collections/${id}`}
                    >
                      {title(c)}
                      <Arrow />
                    </A>
                  );
                })}
                <p className="muted">
                  {t(
                    "Suitability and technical requirements must be confirmed for the intended application.",
                    "Teknik gereksinimler ve uygunluk hedef kullanım için teyit edilmelidir.",
                  )}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="industry-grid">
            {industryData.map((i) => (
              <A
                key={i.slug}
                href={`/industries/${i.slug}`}
                className="industry-card"
              >
                <div className="industry-image">
                  <Photo
                    src={`/images/${i.image}.webp`}
                    alt={t(i.name, i.tr)}
                    priority
                  />
                </div>
                <h2>
                  {t(i.name, i.tr)}
                  <Arrow />
                </h2>
                <p>{t(i.desc, i.descTr)}</p>
              </A>
            ))}
          </div>
        )}
      </div>
      <CustomCTA />
    </>
  );
}
export function About() {
  const { t } = useStore();
  return (
    <>
      <div className="wrap content-page">
        <Breadcrumb items={[{ label: t("About", "Hakkımızda") }]} />
        <div className="about-hero">
          <div>
            <p className="eyebrow">SUN-KA / LARTON</p>
            <h1>
              {t("A material legacy.", "Bir malzeme mirası.")}
              <br />
              <em>{t("A forward view.", "Geleceğe dönük bir bakış.")}</em>
            </h1>
            <p className="lead">
              {t(
                "More than three decades of paperboard manufacturing expertise, connected to the needs of today’s businesses.",
                "Bugünün işletmelerinin ihtiyaçlarına bağlanan, otuz yılı aşkın mukavva üretim uzmanlığı.",
              )}
            </p>
          </div>
          <div className="about-hero-image">
            <Photo
              src="/images/card-metalised-detail.webp"
              alt="Sun-Ka presentation material finishes"
              priority
            />
          </div>
        </div>
        <div className="editorial-text">
          <p className="eyebrow">
            {t("FROM TÜRKİYE, WITH PURPOSE", "TÜRKİYE’DEN, BİR AMAÇLA")}
          </p>
          <h2>
            {t("Protecting products.", "Ürünleri koruyoruz.")}
            <br />
            <em>{t("Presenting possibilities.", "Olanakları sunuyoruz.")}</em>
          </h2>
          <p>
            {t(
              "Sun-Ka / Larton brings recycled-paper manufacturing expertise to packaging, logistics, food, retail and manufacturing. Its official catalogue spans presentation boards, edge protection, cardboard and grey board reels.",
              "Sun-Ka / Larton geri dönüştürülmüş kâğıt üretim uzmanlığını ambalaj, lojistik, gıda, perakende ve üretim sektörlerine taşır. Resmi katalog sunum altlıkları, kenar koruma, mukavva ve gri karton bobinleri kapsar.",
            )}
          </p>
          <p>
            {t(
              "The official corporate site describes manufacturing using 100% recycled raw materials, with customization in dimensions, thickness and color. Product suitability is confirmed for each application.",
              "Resmi kurumsal site, %100 geri dönüştürülmüş hammaddeyle üretimi ve ölçü, kalınlık, renk özelleştirme olanaklarını anlatır. Ürün uygunluğu her kullanım için ayrıca teyit edilir.",
            )}
          </p>
          <a
            href="https://www.sunkapaper.com/corporate"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            {t(
              "Read the official company story",
              "Resmi şirket hikâyesini okuyun",
            )}
            <Arrow />
          </a>
        </div>
        <figure className="factory-figure">
          <div>
            <Photo
              src="/images/factory.webp"
              alt="Official aerial photograph of Sun-Ka manufacturing facility exterior"
              sizes="90vw"
            />
          </div>
          <figcaption>
            {t(
              "Sun-Ka manufacturing facility · Official corporate photograph",
              "Sun-Ka üretim tesisi · Resmi kurumsal fotoğraf",
            )}
          </figcaption>
        </figure>
      </div>
      <CustomCTA />
    </>
  );
}
export function Sustainability() {
  const { t } = useStore();
  return (
    <>
      <div className="wrap content-page">
        <Breadcrumb
          items={[{ label: t("Sustainability", "Sürdürülebilirlik") }]}
        />
        <div className="about-hero">
          <div>
            <p className="eyebrow">
              {t("OUR MATERIAL RESPONSIBILITY", "MALZEME SORUMLULUĞUMUZ")}
            </p>
            <h1>
              {t("A new life.", "Yeni bir yaşam.")}
              <br />
              <em>{t("In every layer.", "Her katmanda.")}</em>
            </h1>
            <p className="lead">
              {t(
                "Recovered paper, reimagined as the foundation for presentation and protection.",
                "Sunum ve korumanın temeli olarak yeniden düşünülen geri kazanılmış kâğıt.",
              )}
            </p>
            <A className="button" href="/products">
              {t("Explore our materials", "Malzemelerimizi keşfedin")}
              <ArrowRight size={18} />
            </A>
          </div>
          <div className="about-hero-image">
            <Photo
              src="/images/card-grey.webp"
              alt="Official Sun-Ka grey cardboard material"
              priority
            />
          </div>
        </div>
        <div className="sustainability-points">
          {[
            [
              Leaf,
              t("Rooted in recovered paper", "Geri kazanılmış kâğıda dayanır"),
              t(
                "Sun-Ka describes its manufacturing raw material as 100% recycled. This is a company-level statement, not a certification for every finished configuration.",
                "Sun-Ka üretim hammaddesini %100 geri dönüştürülmüş olarak tanımlar. Bu kurumsal bir beyandır; her bitmiş yapılandırmanın sertifikası değildir.",
              ),
            ],
            [
              Layers3,
              t("A circular material approach", "Döngüsel malzeme yaklaşımı"),
              t(
                "The official site describes a closed-loop process that recovers post-consumer paper through separation, cleaning and fibre treatment.",
                "Resmi site; tüketim sonrası kâğıdı ayrıştırma, temizleme ve lif işleme süreçleriyle geri kazanan kapalı döngü yaklaşımını anlatır.",
              ),
            ],
            [
              Ruler,
              t("Purpose before excess", "İhtiyaca göre tasarım"),
              t(
                "Made-to-order dimensions and profiles allow requirements to guide the specification. Discuss use, protection and presentation with the team.",
                "Özel ölçü ve profiller, teknik tanımın ihtiyaca göre şekillenmesini sağlar. Kullanım, koruma ve sunumu ekiple değerlendirin.",
              ),
            ],
          ].map(([Icon, name, desc]) => (
            <article key={String(name)}>
              {typeof Icon !== "string" && <Icon size={30} strokeWidth={1} />}
              <h2>{String(name)}</h2>
              <p>{String(desc)}</p>
            </article>
          ))}
        </div>
        <div className="sustainability-source">
          <p>
            {t(
              "Statements are derived from the official company pages. Recyclability, food-contact compliance and technical performance depend on the selected product and application and require company confirmation.",
              "Beyanlar resmi şirket sayfalarından türetilmiştir. Geri dönüştürülebilirlik, gıda teması uygunluğu ve teknik performans seçilen ürün ve kullanıma bağlıdır; şirket teyidi gerektirir.",
            )}
          </p>
          <a
            href="https://www.sunkapaper.com/"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            {t("Official source", "Resmi kaynak")}
            <Arrow />
          </a>
        </div>
      </div>
      <CustomCTA />
    </>
  );
}
export function FAQ() {
  const { t } = useStore();
  const answers = [
    [
      "Is this a live shop?",
      "Bu canlı bir mağaza mı?",
      "This is a local customer-presentation demo. Orders, quote requests, applications and contact messages are recorded in a local database. No payment, email, ERP or shipping operation is performed.",
      "Bu yerel bir müşteri sunum demosudur. Sipariş, teklif, başvuru ve mesajlar yerel veritabanına kaydedilir. Ödeme, e-posta, ERP veya taşıma işlemi yapılmaz.",
    ],
    [
      "Are the products and images real?",
      "Ürünler ve görseller gerçek mi?",
      "The product families and photos come from the official Sun-Ka / Larton websites. The sample configurations, SKUs, prices, pack sizes, minimums and availability are demonstration data.",
      "Ürün aileleri ve fotoğraflar resmi Sun-Ka / Larton sitelerinden gelir. Örnek yapılandırmalar, SKU, fiyat, paket, minimum miktar ve uygunluk demo verisidir.",
    ],
    [
      "How do wholesale prices work?",
      "Toptan fiyatlar nasıl çalışır?",
      "Sign in with an approved buyer account to view illustrative USD prices and quantity tiers. Pending accounts must be approved by the demo administrator.",
      "Temsili USD fiyatlarını ve miktar kademelerini görmek için onaylı müşteri hesabıyla giriş yapın. Bekleyen hesaplar demo yöneticisi tarafından onaylanmalıdır.",
    ],
    [
      "Can I specify a custom product?",
      "Özel ürün tanımlayabilir miyim?",
      "Use the custom quote form for dimensions, thickness, finish and intended use. Quote-only products connect directly to this form. No commercial offer is generated automatically.",
      "Ölçü, kalınlık, yüzey ve kullanım için özel teklif formunu kullanın. Teklifle satılan ürünler doğrudan bu forma bağlanır. Otomatik ticari teklif oluşturulmaz.",
    ],
    [
      "How are tax, delivery and returns handled?",
      "Vergi, teslimat ve iade nasıl ele alınıyor?",
      "No tax or freight rate is assumed. Estimates exclude unconfirmed tax and logistics. Actual commercial, delivery, suitability and return policies must be provided and approved by the company before launch.",
      "Vergi veya taşıma oranı varsayılmaz. Tahminler teyit edilmemiş vergi ve lojistiği içermez. Canlıya geçmeden ticari, teslimat, uygunluk ve iade politikaları şirketçe sağlanıp onaylanmalıdır.",
    ],
    [
      "Can I attach artwork to an RFQ?",
      "Teklif talebine tasarım dosyası ekleyebilir miyim?",
      "File upload is not part of this demo. Describe artwork, tolerances or other requirements in the notes field.",
      "Dosya yükleme bu demoda yer almaz. Baskı, tolerans ve diğer gereksinimleri not alanında açıklayın.",
    ],
  ];
  return (
    <div className="wrap content-page faq-page" id="demo">
      <Breadcrumb
        items={[
          { label: t("Frequently asked questions", "Sıkça sorulan sorular") },
        ]}
      />
      <PageHeading
        eyebrow={t("A LITTLE MORE CLARITY", "BİRAZ DAHA AÇIKLIK")}
        title={t("Useful to know.", "Bilmekte yarar var.")}
        description={t(
          "Materials, wholesale access and how this demonstration works.",
          "Malzemeler, toptan müşteri erişimi ve bu demonun çalışma şekli.",
        )}
      />
      {answers.map(([q, qt, a, at], n) => (
        <details key={q} open={n === 0}>
          <summary>
            <span>0{n + 1}</span>
            {t(q, qt)}
          </summary>
          <p>{t(a, at)}</p>
        </details>
      ))}
      <A href="/contact" className="button">
        {t("Start a conversation", "Bir konuşma başlatın")}
        <Arrow />
      </A>
    </div>
  );
}
