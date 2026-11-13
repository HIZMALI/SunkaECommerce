# SUN-KA / LARTON — B2B E-COMMERCE DEMO
## CODEX MASTER IMPLEMENTATION PROMPT

Sen bu projede tek başına çalışan kıdemli bir **product designer + creative director + full-stack engineer + QA engineer** ekibisin. Senden konsept, mockup, sadece ana sayfa veya statik HTML değil; müşteri toplantısında tarayıcıda baştan sona gezilebilecek, yüksek görsel kaliteye sahip, gerçekçi ve işlevsel bir **B2B/toptan e-ticaret demosu** istiyorum.

**Çalışma klasörü:** `D:\Project\SunkaECommerce`
Bu klasörü Codex'te zaten açtım ve klasör boş. Uygulamayı **doğrudan bu klasörün içine** kur. İç içe ikinci bir `sunka-ecommerce` dizini oluşturma. Kullanıcıdan yeni kararlar, onaylar, ekran görüntüleri veya dosya isteme. Makul varsayımları kendi yap; bunları README'de açıkla. İzin verilen araçlarla internet, terminal, dosyalar ve tarayıcı kullanarak işi bitir. İşin sadece planlama bölümünde durma. Bir adım başarısız olursa alternatif dene, sorunları gider, devam et. Süre/tokenden tasarruf amacıyla bariz biçimde eksik bir sayfayı 'tamamlandı' olarak bırakma. Ancak üretim düzeyi gerçek ödeme/ERP yerine dürüst ve güvenli bir demo uygula.

### 1. KAYNAK SİTELER — İLK ÖNCE ARAŞTIR

**Markanın mevcut resmi sitesi:** https://www.sunkapaper.com/
**Tasarım ve alışveriş deneyimi referansı:** https://shopprojectgamma.com/
**Ek marka bağlamı:** https://www.larton.com.tr/ (Sun-Ka / Larton marka ilişkisini anlamak için)

İlk olarak bu adresleri ulaşılabilir araçlarla incele. Özellikle mevcut markanın logosu, renkleri, kurumsal dili, ürün fotoğrafları, ürün aileleri, sürdürülebilirlik mesajı ve iletişim bilgilerini araştır; `docs/brand-audit.md` dosyasına kaynak URL'leriyle kısa bulgular yaz. Görsel erişimin varsa ekran görüntüsü de al. Siteye erişim kısıtlıysa tekrar dene, indekslenmiş resmi sayfalardan yararlan; erişilemeyen içeriği uydurma. Sadece siteyi analiz etmekle kalma, analiz sonrası uygulamayı mutlaka geliştir.

Sun-Ka'nın resmi sitesinde yer alan ürün aileleri, **ürün kataloğunun doğrulanmış çekirdeği** olsun:
- Cake Board: Die Cut Boards ve Flower Cut Board
- Salmon Board
- Specialty Presentation Boards / Single-Serve Mono Portion Boards
- Cornerboard: White Moisture Resistant, Kraft (Paper), Oval, U Profile, Notched, Locked, Self-Adhesive
- Cardboard: Metalised / Bright-Finish, Grey, White, Black, Testliner & Kraftliner, Colored
- Grey Board Reel: Grey Board Coil, Slitting Grey Board Reel

Marka; ambalaj, gıda/perakende, lojistik ve üretim sektörlerine hizmet ediyor. Sürdürülebilir karton ürünleri, %100 geri dönüştürülmüş hammadde odağı ve özel üretim kabiliyeti resmi sitede anlatılıyor. İddiaları kaynaktaki anlamıyla koru; ürün bazında doğrulanmamış gıda teması sertifikası, teknik dayanım, ölçü, satış adedi veya kesin termin süresi UYDURMA.

Project Gamma'nın **kopyasını yapma**: rakibin logosunu, görsellerini, içeriklerini veya kodunu kullanma. Oradan ilham alınabilecek özellikler: cesur hero kompozisyonu, temiz ürün kartları, güçlü kategori sunumu, modern grid, hızlı ürün inceleme, arama, sürgülü sepet, akıcı e-ticaret gezinmesi, güven hissi ve premium tipografi. Project Gamma'nın 'araç seçerek parça bulma' akışını Sun-Ka'ya özgü **'Find the Right Board / Ürün Bulucu'** şeklinde adapte et: kullanım alanı → ürün kategorisi → şekil/ebat → yüzey/rengini seçme → ürün sonuçları.

### 2. PROJE HEDEFİ VE DEMO PRENSİBİ

Bu site tüketiciye tekli pasta altlığı satan sıradan bir butik mağaza OLMASIN. Uluslararası ölçekte faaliyet gösteren, üretim ve toptan satış yapan kurumsal bir şirket için tasarlanmış **premium, ticari, katalog + satış + teklif** deneyimi olsun.

Müşteri sunumu için en az şu uçtan uca senaryolar çalışmalı:
1. Ziyaretçi ana sayfada markayı ve ürün ailelerini keşfeder.
2. Ürün bulucuyla Cake Board seçer, filtreler ve bir ürün detayına gider.
3. Boyut, şekil, yüzey ve koli/adet seçeneklerini deneyip toptan adet kademelerine göre **yalnızca demo fiyat** görür.
4. Uygun ürünleri sepete ekler, sepet miktarlarını değiştirir ve DEMO sipariş verir.
5. Aynı kullanıcı özel ölçülü bir ürün için teklif (RFQ) talebi oluşturur.
6. B2B müşteri hesabına giriş yapar; sipariş ve taleplerini görür, yeniden sipariş başlatır.
7. Yönetici panele girip sipariş, teklif, ürün ve müşteri başvurularını görür; birkaç alanı düzenlediğinde arayüz güncellenir.

Gerçek para tahsilatı, canlı kargo fiyatı, vergi kesinliği, ERP aktarımı, otomatik e-posta veya gerçek stok doğruluğu VARMIŞ GİBİ davranma. Ürün maliyeti, stok, MOQ, lead-time ve örnek varyantlar şirket tarafından doğrulanmadıysa demo veri olarak tanımlanacak; kullanıcıya kritik noktalarda bunun temsili olduğu bildirilecek. **Demo çok iyi hissettirmeli ama yanıltıcı olmamalı.**

### 3. ART DIRECTION / MARKA VE GÖRSEL KALİTE

Tasarımı ödüllük bir modern D2B/B2B mağaza ciddiyetinde ele al:
- Çizgi: **modern editorial commerce + premium industrial materials + sustainable manufacturing**.
- Genel zemin: beyaz/kırık beyaz/açık taş tonları; metinde koyu antrasit; sürdürülebilirliği çağrıştıran derin orman yeşili veya markanın gerçek kurumsal rengi; metalize kartonlar için kontrollü champagne/gold vurgu. **Önce resmi logonun gerçek paletini kontrol et**, öneri paleti ancak uyuyorsa kullan.
- Ürün fotoğrafçılığı odakta: metalize cake board detayları, kâğıt dokusu, kartonların geometrisi, üretim ve ambalaj süreçleri. Her bölümde rastgele karton kutu stok fotoğrafı kullanma.
- Tipografi: kaliteli, lisansı uygun fontlar (örn. Manrope/Inter + karakterli bir başlık fontu); yüksek kontrast, iyi boşluk, net hiyerarşi.
- Stil: güçlü 12 kolon grid, asimetrik editorial hero, nefes alan negatif alan, büyük ve keskin ürün görselleri, sofistike micro-interaction; aşırı animasyon veya ağır WebGL kullanma.
- Ürün kartlarında beyaz/soft stone arka plan, tutarlı oran, hover ikinci görseli/zoom, varyant renk swatch'ları, hızlı bak, teklif/sepet CTA'ları.
- Mobil deneyim masaüstünün küçültülmüş hali değil; özel düşünülmüş menü, filtre drawer, sticky CTA, dokunmatik ürün galerisi olsun.
- Icon seti modern, minimal ve tutarlı; hiçbir yerde emoji/clip-art/gereksiz gradient/varsayılan Tailwind demosu hissi istemiyorum.
- Metinler gerçek marka ve ürün bağlamına otursun. `Lorem ipsum`, 'Product 1', anlamsız sahte yorumlar, uydurma ödüller ve generik AI reklam sloganları kullanma.

Olası ana sayfa hero metni (daha iyisini yazabilirsin):
**“Engineered to Protect. Designed to Present.”**
Alt metin: “Sustainable paperboard and presentation solutions for businesses that demand more.”
CTA: **Shop Wholesale** ve **Request Custom Quote**.

Markayı başlıkta gerçek logoyla temsil et; Sun-Ka / Larton ilişkisinden emin değilsen resmi markanın kullandığı en güncel gösterimi seç ve `brand-audit.md` içinde gerekçelendir. Kesinlikle rastgele yeni bir logo üretip resmi logo gibi gösterme.

### 4. TEKNOLOJİ VE ÇALIŞABİLİRLİK

Varsayılan teknoloji kararım:
- Next.js App Router (kararlı sürüm), React, TypeScript (`strict`)
- Tailwind CSS, nitelikli ve erişilebilir component sistemi (shadcn/ui veya eşdeğeri), Lucide ikonları
- Hafif Framer Motion/Motion animasyonları, gerektiği kadar
- Prisma ORM + **yerel SQLite**, seed ve migration: demo için ücretli servis, Docker, harici veritabanı gerekmesin
- Next.js Route Handlers/Server Actions, Zod ile doğrulama
- Güvenli HTTP-only oturum; rol temelli demo auth: `ADMIN`, `APPROVED_BUYER`, `PENDING_BUYER`
- Lokal `public/images` görsel varlıkları, Next/Image optimize kullanım
- Playwright browser testleri ve kritik business logic için uygun bir unit test kütüphanesi

Ama bu stack'in sürümleri ya da Windows uyumluluğu sorun çıkarırsa aynı kaliteye ulaşan **basit ve kararlı alternatif** seç; değişikliği README'de yaz. Sırf moda olduğu için gereksiz microservice, GraphQL, Redis, Docker/Kubernetes, harici CMS kurma. Kod Windows PowerShell altında çalışabilmeli. `.env.example` sağla ve demo ortamının yapılandırmasını otomatik/kolay yap. Gerçek sırları repoya koyma. Uygulama `npm install`, `npm run db:setup` veya eşdeğeri, `npm run dev` ile kalkmalı.

Demo ve production ayrımı açık olsun (`DEMO_MODE` veya eşdeğeri). Canlı ödeme kodu, gerçekte çalışmayan ödeme sağlayıcı logoları, canlı kargo iddiası veya mail gönderildi yalanı istemiyorum.

### 5. SAYFA HARİTASI — HER BİRİ GERÇEK SAYFA OLSUN

**A. Ana Sayfa `/`**
- Mini announcement band: toptan ve özel üretim odağı, ama kanıtlanmamış teslimat/indirim vaadi yok.
- Sticky, şık navbar: Products (mega menu), Industries, Wholesale, Custom Solutions, Sustainability, About, Contact, Search, Account, Cart.
- Güçlü, gerçek ürün odaklı hero; yan ürün görselleri/kompozisyon; iki CTA.
- 'Find Your Material' çok aşamalı çalışan ürün bulucu; sonuçlar gerçek seed kataloğa bağlansın.
- Popüler ürün grupları (Cake Boards, Presentation Boards, Edge Protectors, Cardboard & Reels) görsel tile grid.
- 'Featured for Professionals' ürün karuseli/grid, gerçek seed ürünleri ve çalışan quick-view.
- 'Built for Your Industry': Food & Retail, Packaging & Logistics, Manufacturing & Furniture; ilgili kategorilere link.
- Güçlü full-bleed editorial sustainable materials / made-to-order bölümü.
- 'How Wholesale Works': Discover → Configure → Order / Quote (kısa ve açık).
- Kurumsal güven sinyalleri, sadece doğrulanmış iddialar (örn. 30+ yıl, geri dönüştürülmüş malzeme; varsa resmi kaynak).
- Büyük katalog CTA, özel ölçü teklifi CTA, kapsamlı footer.

**B. Shop All `/products`**
- En az 18 gerçek kaynaklı ürün tipi / mantıklı demo koleksiyonları; aynı görseli her karta basma.
- Çalışan kategoriler, alt kategori, kullanım alanı, yüzey, renk, şekil, ölçü/kalınlık (ürüne uygulanabiliyorsa), satış tipi (buy/quote) filtreleri.
- Search, sort, empty state, reset filters, URL query parametrelerine senkronizasyon, breadcrumb.
- Grid/list görünümü iyi olursa ekle, fakat filtre ve ürün detayı önce gelsin.

**C. Kategori `/collections/[slug]`**
- İlgili koleksiyon için açıklayıcı hero, fotoğraf ve katalog.
- Ana gruplar: Cake & Salmon Boards, Specialty Presentation Boards, Cornerboards, Cardboard, Grey Board Reels.
- Ürün ailelerinin alt kategorileri ve breadcrumb; tüm linkler çalışsın.

**D. Ürün Detayı `/products/[slug]`**
- Gerçek ürün fotoğrafları, galeri, thumb, zoom/lightbox.
- Ürün ailesine uygun varyantlar; Cake Board için şekil, yüzey, ebat, paket adedi; Cornerboard için profil ve ölçü; Reel için kalınlık/bobin gibi alanlar. Alanlar yalnızca ilgili ürünlerde görünsün.
- Birimler açık: mm, cm, gsm, pcs/pack vs. Uydurulan ölçüler DEMO niteliğinde tanımlansın.
- Minimum sipariş, adet kademe örneği ve toplam tahmini tutar hesaplama; aşırı kesin gerçek fiyat vaat etme.
- İki ürün tipi: (1) `STANDARD_ORDER` → demo fiyatlı sepete eklenebilir; (2) `QUOTE_ONLY` → doğrudan RFQ.
- Quantity stepper; yanlış veya minimum altı adet engeli; stoktan fazla sipariş gibi senaryolarda demo mantığı.
- Teknik özellikler tablosu, kullanım alanları, kargo/üretim hakkında güvenli açıklama, varsa dosya/ilgili ürünler, özel üretim CTA.
- Açılır quick-view modalı da aynı doğru fiyat/varyant mantığını kullanmalı.

**E. Arama `/search`**
- Header search overlay + sonuç sayfası; isim, kategori, finish/özellik ve SKU üzerinde arama; otomatik öneriler mümkünse.

**F. Sepet `/cart` + Sağdan açılır mini cart**
- Server/client doğru senkron, sayfa yenilenince kaybolmayan sepet.
- Varyant, paket, miktar, birim fiyat, ara toplam, adet indirim kademeleri; ürün çıkartma/değiştirme, boş sepet.
- `QUOTE_ONLY` ürünler için ayrı teklif akışına geç; sepette aldatıcı checkout'a sokma.

**G. Demo Checkout `/checkout` → `/order-success/[id]`**
- Firma, yetkili, e-posta, telefon, teslimat/fatura adresi, not alanları.
- Demo ödeme şekli: `Request invoice / Pay later — demonstration only` ya da `Purchase Order (Demo)`. Kredi kartı numarası isteme veya gerçek tahsilat yapma.
- Sipariş doğrulama, sipariş numarası, sunucuda kayıt, başarı sayfası, hesapta ve adminde görünürlük.
- Fiyat, vergi ve lojistik ücreti gerçeğe uygun doğrulanmadıysa 'demonstration estimate / to be confirmed' olarak göster; gerçek KDV/kargo oranı uydurma.

**H. Wholesale `/wholesale`**
- Kimler için toptan hesap, satın alma süreci, ihtiyaca göre teklif, avantajlar, SSS.
- İşletme başvurusu: firma, kişi, kurumsal e-posta, ülke, telefon, iş türü, aylık hacim aralığı, ilgi alanı, not. Zod doğrulama, gerçek persist; yönetim panelinde `PENDING` olarak görünür.
- Başvuru gönderimi gerçek mailmiş gibi gösterilmesin: `Your demo application was recorded`.
- Demo müşteri hesabıyla giriş seçeneği olsun.

**I. Custom Quote `/request-quote`**
- Ürün/ürün ailesi, hedef kullanım alanı, şekil, özel ebat, kalınlık, finisaj, tahmini sipariş miktarı, hedef ülke, dosya yükleme **yalnız güvenli/uygulanabilirse**, firma/iletişim ve not.
- Parametre doğrulama, benzersiz RFQ ID, adminde takip (`NEW`, `IN_REVIEW`, `RESPONDED`), kullanıcı hesabında görüntüleme.
- Dosya yükleme zaman alırsa güvenli dosyasız RFQ formunu kusursuz bitirmeyi önceliklendir; sahte upload animasyonu yapma.

**J. About / Sustainability / Industries / Contact / FAQ**
- Kurumsal metinler resmi sitedeki doğrulanabilir bilgilerden türetilsin. Endüstriye özel landing sayfaları ve ilgili katalog linkleri.
- Contact: resmi siteden doğrulanmış ABD / Türkiye ofis bilgileri; farklı sayfalarda email/telefon farkı varsa en güncel görünen resmi kaynağı seç, belirsizliği README'de not et.
- Doldurulabilir iletişim formu veritabanına kaydedilsin; admin görsün; demo olduğunu açıkla.
- Asıl şirketin gerçek hizmet politikası olmadığı sürece uydurma iade/teslimat sözleri, sahte hukuki metinler veya sahte referans logoları yok.

**K. Account `/account` ve Auth**
- Demo login/logout, kişisel hesap sayfası, şirket bilgileri, adres, sipariş geçmişi/detayları, RFQ durumu, yeniden sipariş (variant/quantity ile yeni sepet).
- `PENDING_BUYER` hesapları toptan fiyatı onaylı hesap gibi görmesin; role göre anlaşılır ekran.
- Admin rolü olmadan `/admin` ve admin API'lerine erişilemesin.

**L. Yönetim Paneli `/admin`**
- Ön yüzle tutarlı ama ayrı, temiz ve kullanışlı dashboard.
- Gösterilecek KPI'lar: demo siparişler, demo RFQ'lar, başvurular ve seed veri kaynaklı sipariş değerleri. Bunlar **işletmenin gerçek ciro/satış verisi değil**.
- Ürün listesi, düzenleme: ad, kategori, açıklama, görünürlük, sipariş/teklif tipi, demo fiyat ve MOQ; değişiklikler DB'de kalıcı olsun.
- Sipariş listesi ve detay; status güncelleme.
- RFQ listesi, detay ve durum güncelleme.
- Wholesale başvuru listesi, onay/ret; kullanıcı rolü ve fiyat erişimi buna göre değişsin.
- İletişim talepleri listesi.
- En azından bu çekirdek yönetim akışları gerçek çalışsın; statik sahte dashboard istemiyorum.

### 6. B2B VERİ MODELİ VE KURALLAR

En az şu kavramları kur: `Category`, `Product`, `ProductImage`, `ProductVariant`, `PricingTier`, `Company`, `User`, `WholesaleApplication`, `Cart/CartItem` (client cart + server validation), `Order`, `OrderItem`, `QuoteRequest`, `ContactSubmission`.

- Stable slug, SKU, kategori ilişkileri, localized title/description, specs, sale mode, demo visibility.
- Fiyatları floating-point ile yanlış hesaplama: decimal/minor units kullan. Tek kaynaklı fiyat fonksiyonu server tarafında olsun; client tahmini gösterim yapsa bile server checkout anında yeniden hesaplasın.
- Aynı ürünün farklı varyantları sepette ayrı satır.
- MOQ ve pack multiple kuralları hem istemci hem sunucuda doğrulansın.
- Demo quantity discount (örn. 100+ / 500+ / 1000+) sadece seed kurgusu; admin değiştirilebilir.
- Fiyat görme politikası net: ziyaretçiye `Request quote` veya `Login to see wholesale pricing`; onaylı örnek buyer hesabı demo fiyatı görür. Müşteri toplantısında akışın görünmesi için uygun bir `Explore Buyer Demo` giriş yolu sağla (sadece DEMO_MODE'da).
- Kullanıcı adları, adresler, sipariş durumları, formlar tutarlı; hayali gerçek müşteri yorumu ekleme.
- Hesap onayı değişince fiyat erişimi gerçekten değişsin.
- Şifreler hash'li; oturum güvenli; adminde en az rol kontrolü; input validation ve güvenli hata mesajları.
- Basit ama gerçek DB persistence olsun: refresh ve yeniden başlatmada order/RFQ kaybolmasın.

### 7. DEMO SEED VERİSİ VE FİYAT GERÇEKLİĞİ

- Resmi sitedeki gerçek ürün ailelerine dayalı **18–25 ürün sunumu** ve ürün başına mantıklı, özellikle bazı ürünlerde çoklu varyantlar oluştur. Var olmayan yepyeni SUN-KA ürün serileri uydurma; demo boyut/finish/SKU varyantlarını `sample` olarak belirt.
- Katalogda mümkün olduğunca farklı gerçek ürün fotoğrafları kullan. Aynı görselin 30 kez gösterilmesini istemiyorum.
- Örnek fiyat verisi yalnız `DEMO` etiketiyle ve `seed` kaynaklı; şirketin gerçek fiyat listesi olarak sunulmayacak.
- Cake Boards, Salmon Boards, Mono Portion gibi ürünlerin bir bölümü `STANDARD_ORDER`; Cornerboards, özel üretimler, büyük reel gibi ürünlerin bir bölümü `QUOTE_ONLY` olsun (bu ayrım demo ürün kurgusudur).
- En az 2 örnek sipariş, 3 örnek teklif, 2 müşteri/başvuru ile yönetim panelini boş göstermeyecek seed oluştur; açıkça örnek veri.
- Ürün açıklamaları İngilizce yazılsın; kurumsal ve teknik açıdan düzgün, kısa ve özgün olsun. Mümkünse Türkçe karşılıklarını da ekle.
- Tahmin edilen fiyat/ebat, fotoğraf ve gerçek katalog arasındaki farkları `docs/demo-assumptions.md` içinde kaydet.

### 8. DİL, PAZAR VE İÇERİK

Sun-Ka'nın uluslararası kimliği ve ABD ofisi nedeniyle **varsayılan müşteri dili İngilizce**. Header'da çalışan `EN | TR` dil seçici koy. Görünen bütün temel UI, navigation, form hataları, checkout metinleri ve CTA'lar iki dilde de düzgün çalışmalı. İngilizce daha rafine/profesyonel olsun; Türkçe metinler otomatik yarım çeviri hissi vermesin. SEO için locale route veya güvenilir eşdeğer yapı kullan.

DEMO para birimi varsayılan `USD`; bu şirketin gerçek para birimi veya fiyat listesi olduğu anlamına gelmez. Kur sağlamıyorsan sahte anlık döviz dönüşümü koyma. Hesap birimi ve sayı formatı doğru gösterilsin. İleride EUR/TRY için veri modelini genişletilebilir bırak; canlı kurları bugün eklemek zorunda değilsin.

### 9. GÖRSELLER VE ASSET POLİTİKASI

- Resmi şirket sitesindeki logo ve mevcut ürün fotoğraflarını **müşterinin marka demosunda kullanılmak üzere** mümkün olduğunca yerel `public` varlıklarına indir; uzaktan kırık hotlink'e güvenme. Örnek, gözle doğrulanmış resmi görsel URL'leri (yalnızca kaynak örneği, kullanmadan önce erişimi test et):
  - Cake Board: `https://www.sunkapaper.com/Content/images/Urun_Gorselleri_Webp/Cake_Board/Die_Cut_Boards_yeni_6.webp`
  - Salmon Board: `https://www.sunkapaper.com/Content/images/Urun_Gorselleri_Webp/Salmon_Board/Salmon_Board_yeni_1.webp`
  - Grey Board Reel: `https://www.sunkapaper.com/Content/images/Urun_Gorselleri_Webp/Grey_Board_Reel/Grey_Board_Coil_son_1.webp`
  - Cornerboard: `https://www.sunkapaper.com/Content/images/products/0R7A6521.jpg`
  - Mono Portion Board: `https://www.sunkapaper.com/Content/images/products/KRG_7093-rev.jpg`.
- Görseli kaydettiğinde kaynağını `docs/asset-sources.md` dosyasına yaz. Üçüncü şahıs fotoğraflarına, lisanssız stok içeriğine veya Project Gamma varlıklarına el koyma. Canlı yayına çıkmadan önce müşteriyle kullanım hakları teyit edilecek.
- Resmi kaynak yavaş/engelliyse erişilebilen resmi küçük/optimize görselleri kullan; doğrulanabilir açık lisanslı yardımcı fotoğraf bulunabiliyorsa kaynak/izin bilgisi yaz. Rastgele CSS kutularını 'gerçek ürün fotoğrafı' yerine geçirme.
- `alt`, uygun crop, responsive `sizes`, lazy loading ve LCP hero önceliği.
- Fotoğraflar sayfa tasarımında güçlü yer tutsun; sadece ikon ve metinle boş bir corporate template çıkarma.

### 10. UX KALİTESİ VE DETAYLAR

- Header sticky, düzgün mega-menu, mobile sheet; kategori seçince doğru sayfa.
- Arama inputu klavye ile açılıp ESC ile kapanabilsin.
- Drawer ve dialoglarda focus trap, ESC, erişilebilir etiketler.
- Button states, toast, loading skeleton, optimistic UI uygun yerlerde, form doğrulama, hata ve boş state, 404.
- Tüm bileşenlerde 360px mobil / tablet / 1440px desktop test.
- Filtre ve ürün bulucu sonucu URL'de paylaşılabilir olsun.
- Hero, kartlar, detay ve checkout'ta **gerçek içerik** ve tutarlı görsel dil.
- SEO: metadata, OpenGraph, sitemap, robots, canonical/hreflang (uygunsa), anlamlı URL; erişilebilir HTML yapısı.
- Responsive performans hedefi: gereksiz dependency yok; ağır resim yok; font ve layout shift azaltılmış.
- Güven veren, okunaklı B2B ürün teknik özellikleri ve teklif akışları, güzel ama işe yarar interaktif deneyim öncelikli.

### 11. KESİNLİKLE İSTEMEDİKLERİM

- Sadece planlama veya Figma benzeri statik ekran.
- `TODO` butonları, boşa çıkan linkler, hiç bağlanmamış filtreler, göstermelik sepet/checkout/admin.
- Next.js/Tailwind boilerplate görünümlü UI; yinelenen fotoğraflı katalog.
- Uydurma müşteri yorumları, şirket satış istatistikleri, sertifikalar, kesin teslimat süreleri, canlı kampanyalar.
- Siteyi komple Project Gamma'nın kopyası yapmak.
- Gerçek ödeme alma veya gerçek sipariş maili yollama; gerçek müşteri bilgilerini kullanma.
- API anahtarı, şifre veya token'ı istemciye sızdırma; açık admin endpointleri.
- Tüm kodu dev bir page.tsx dosyasına doldurma, dağınık types, çoğaltılmış fiyat mantığı.
- Onay beklemek için işi yarıda kesme; sürekli yeni soru sorma.

### 12. UYGULAMA SIRASI VE KABUL KRİTERLERİ

İşi kendi içinde aşamalı götür, **her aşamayı tamamlamadan teslim etme**:

**Aşama 0 — Research & Blueprint**
Marka analizi, asset analizi, UX planı, bilgi mimarisi ve DB modelini yaz; `docs/brand-audit.md`, `docs/demo-assumptions.md` oluştur. Sonra beklemeden kodlamaya geç.

**Aşama 1 — Foundation & Visual System**
Proje kurulumu, DB migration, seed, i18n, auth, tasarım token'ları, header/footer, çalışır ana sayfa. Masaüstü ve mobil ekranları tarayıcıda gerçekten incele, hataları düzelt.

**Aşama 2 — Commerce**
Katalog, kategori, arama, filtre, ürün detay/varyant, MOQ/tier pricing, mini cart, cart ve demo checkout + order success. Her ana akış DB/seed'e bağlı olsun.

**Aşama 3 — B2B**
Wholesale account application, custom RFQ, login/account/orders/re-order. Müşteri durumuna göre fiyat erişimini doğrula.

**Aşama 4 — Admin & Content**
Admin CRUD çekirdeği, sipariş/RFQ/başvurular, sektör sayfaları, sürdürülebilirlik, contact, FAQ ve SEO.

**Aşama 5 — Gerçek QA ve Görsel İnceleme**
`npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run test:e2e` (script adları farklıysa eşdeğerleri) çalıştır. Tespit edilen hataları düzelt ve tekrar çalıştır. Playwright/Chromium ile en az şu akışları otomatik doğrula:
1. Ana sayfa açılıyor, görseller yükleniyor, hamburger/mega menu çalışıyor.
2. Product Finder sonuç gösteriyor; ürün listesinde filtre/search sonuç değiştiriyor.
3. Ürün seçimi fiyat/total etkiliyor; sepete ekleme, quantity güncelleme ve refresh persistence var.
4. Onaylı buyer login oluyor; demo siparişi oluşturup order success ve account history görüyor.
5. RFQ gönderimi yapılıyor; adminde görünüyor.
6. Wholesale application gönderiliyor; admin onaylayınca fiyat görünürlüğü değişiyor.
7. Admin ürün veya RFQ status güncellemesi UI'da ve DB'de korunuyor.
8. EN/TR navigation çalışıyor; ana sayfalarda kırık link/çeviri yok.
9. Kritik sayfalarda console error, hydration error, 404 görsel, overflow yok.

**Ekran görüntüsü:** En az ana sayfa (1440x900 ve 390x844), katalog, ürün detay, cart, checkout, RFQ ve admin dashboard ekranlarını `screenshots/` içine kaydet. Görsel erişimin mümkünse resimleri bizzat incele; kötü görünümlü/boş alanları, kırpılmış görselleri, bozuk hero/typography ve mobil taşmaları düzelt. Görsel QA için **en az bir düzeltme iterasyonu** yap. Ekran görüntüsü alınamıyorsa nedenini açıkça belirt; almış gibi davranma.

**P0 zorunlu kabul:** Ana sayfa, katalog, en az 1 kategori, ürün detay, filtre, sepete ekleme, demo checkout/order, RFQ, login ve admin'de sipariş/RFQ görebilme, responsive, gerçek görseller, seed, docs, build başarıyla çalışıyor.

**P1 hedef:** Çalışan iki dil, wholesale application/approval, admin ürün yönetimi, ürün bulucu, re-order, SEO, e2e.

**P2 ancak P0/P1 bittiyse:** Fazladan animasyonlar, gelişmiş arama önerileri, ekstra yönetim raporları. Kusurlu ana akış varken kozmetik ekleme yapma.

### 13. DEMO HESAPLARI VE TESLİM DÖKÜMANLARI

`DEMO_MODE=true` olduğunda seed demo hesaplar oluştur (şifreler hash'li tutulmalı; sadece yerel demo için):
- `admin@sunka.demo` / `SunkaDemo!2026` — admin
- `buyer@sunka.demo` / `BuyerDemo!2026` — onaylı B2B müşteri
- `pending@sunka.demo` / `PendingDemo!2026` — onay bekleyen müşteri

Bu hesaplar production'da oluşturulmasın. Site üzerinde istemeden herkese açık gerçek admin hesabı sunulmamalı. README'ye yalnızca DEMO olduğunu açıkça yaz.

Teslimde şunlar bulunsun:
- `README.md`: hızlı başlat, Windows komutları, demo URL, hesaplar, nelerin çalıştığı, varsayımlar, eksikler.
- `.env.example`: gerekli değişkenler, sır içermeyen örnekler.
- `docs/brand-audit.md`: marka ve referans site bulguları/kaynaklar.
- `docs/demo-assumptions.md`: demo fiyat/ölçü/stok/satış kurgusu ve canlıya geçişte şirketten istenecek bilgiler.
- `docs/asset-sources.md`: görsel kaynakları ve hakları.
- `docs/production-roadmap.md`: gerçek sipariş/ödeme, ERP, müşteri bazlı fiyat, kargo, çoklu para, KVKK/GDPR, şirket onayları için faz 2 yol haritası.
- `docs/demo-walkthrough.md`: müşteriye 5–7 dakikada gösterilecek tıklama senaryosu.
- `screenshots/`: tarayıcıyla alınmış ekranlar (mümkünse).
- Temiz, maintainable source code, migration ve seed.

### 14. TAMAMLANDIĞINDA BANA VERECEĞİN TEK FİNAL RAPORU

Uzun günlük raporu yerine kısa ve kanıtlanabilir bir teslim yaz:
1. Kurulan uygulamanın adı ve hangi stack ile geliştirildiği.
2. Tam dosya yolu: `D:\Project\SunkaECommerce`.
3. Çalıştırmak için tam komutlar ve local URL.
4. Demo giriş bilgileri.
5. Gerçekten çalışan uçtan uca özellikler.
6. `lint`, `typecheck`, `test`, `build`, `e2e` sonuçları, başarısızlar varsa dürüstçe.
7. Screenshots dosya yolları.
8. Kullanılan gerçek kaynak görseller ve demo veri ayrımı.
9. Canlıya almak için gereken en önemli 5 şirket kararı (fiyat, MOQ, gerçek katalog, ödeme/kargo, yasal politikalar vb.).
10. Kalan sınırlamalar ve en mantıklı ikinci aşama.

**En önemli talimat:** Bu, müşteriye sunulacak bir **satış demosu**. Kodun doğru olması kadar ilk 10 saniyelik görsel etki, ürünlerin gerçekten fotoğraflarla sergilenmesi, B2B alışverişin gerçekçi görünmesi ve tüm ana CTA'ların çalışması kritik. Bütünüyle üzerinde düşünülmüş, özgün, modern, güvenilir ve tarayıcıda gezilebilir bir Sun-Ka wholesale commerce deneyimi üret. Planla, uygula, çalıştır, test et, görsel QA yap, düzelt ve ancak sonra raporla. Onay için durma.
