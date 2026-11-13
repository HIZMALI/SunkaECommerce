# Sun-Ka / Larton — Wholesale Studio

Müşteri toplantıları için, gerçek resmi ürün fotoğraflarıyla geliştirilmiş, yerel veritabanına sahip B2B katalog / sipariş / teklif demosu.

**Çalışma klasörü:** `D:\Projects\SunkaECommerce` (şartnamedeki `D:\Project` yerine açık çalışma alanı kullanıldı). Git dalı: `main`. İç içe proje klasörü yok.

## Uzaktan müşteri demosu

**Canlı demo:** [Sun-Ka Wholesale Studio](https://sunka-larton-wholesale.netlify.app). **Müşteriye gönderilecek rehber:** [Demo nasıl denenir?](https://sunka-larton-wholesale.netlify.app/demo-guide?lang=tr)

Kaynak depo: [HIZMALI/SunkaECommerce](https://github.com/HIZMALI/SunkaECommerce). Ücretsiz yayın **Netlify + kalıcı PostgreSQL** üzerindedir; ücretli abonelik oluşturulmadı. [Yayın yönergesi](docs/deployment.md).

Müşteri için [5–7 dakikalık deneme yönergesi](docs/customer-demo-guide.md) ve uygulamada **`/demo-guide`** sayfası vardır. Header'daki **B2B DEMO · TRY IT** bağlantısıyla açılır. Tek tıkla onaylı müşteri demosuna geçilebilir. Public demo ortak örnek kayıtlar kullanır; yalnız hayali bilgiler girilmelidir.

## Hızlı başlatma · Windows PowerShell

Node.js 22 veya 24 LTS ve npm gereklidir. Docker veya harici servis gerekmez.

```powershell
Set-Location D:\Projects\SunkaECommerce
npm install
npm run db:setup
npm run dev
```

Tarayıcı: **http://127.0.0.1:3000**

`db:setup`, yoksa `.env.example` → `.env` kopyalar; SQLite dosyasını oluşturur; sürümlü migration'ları uygular ve tekrar çalıştırılabilen seed'i yükler. Var olan kayıtları ve yönetici düzenlemelerini sıfırlamaz. SQLite dosyası `prisma/demo.db` içindedir. Aynı `.env` ve DB dosyası korunduğu sürece siparişler/talepler yeniden başlatmada kalır. Tarayıcı sepeti `localStorage` içinde korunur ve sunucuda yeniden doğrulanır.

Windows'ta Prisma DLL dosyası çalışan Next.js süreci tarafından kilitlenebilir. `npm install` veya `db:setup` öncesinde geliştirme sunucusunu **Ctrl+C** ile durdurun; sonra tekrar başlatın. `.env` içindeki `APP_URL` ile tarayıcıda kullandığınız origin aynı olmalıdır. Varsayılan `127.0.0.1` yerine `localhost` kullanmak isterseniz `APP_URL` değerini de değiştirin ve sunucuyu yeniden başlatın.

Optimize sunum sürümü:

```powershell
npm run build
npm start
```

## Yalnızca yerel demo hesapları

| Rol            | E-posta              | Şifre              |
| -------------- | -------------------- | ------------------ |
| Yönetici       | `admin@sunka.demo`   | `SunkaDemo!2026`   |
| Onaylı müşteri | `buyer@sunka.demo`   | `BuyerDemo!2026`   |
| Onay bekleyen  | `pending@sunka.demo` | `PendingDemo!2026` |

Seed bu yerel hesapları yalnızca `DEMO_MODE=true` ve `NODE_ENV` production değilken oluşturur. Normal production'da örnek kimlikler oluşturulmaz. Bunlar gerçek şirket hesapları değildir. Ayrı bir hosted demo sandbox için açık opt-in ve en az 20 karakterli, ayrı yönetici secret'ı zorunludur; [ayrıntılar](docs/deployment.md). **Yayında yerel yönetici şifresi kullanılmaz.** `npm start` ile yerel sunum için optimize build çalıştırmak, canlı ticaret entegrasyonu oluşturmaz. DEMO_MODE kapatıldığında tek tıkla müşteri demosu ve demo sipariş oluşturma kapanır. Yönetici parolası arayüzde yayımlanmaz.

## Çalışan deneyim

- Gerçek birleşik logo; özel editorial tasarım; mobil menü; ürün mega menüsü; klavye destekli arama, focus trap ve Escape destekli sepet/quick-view/lightbox.
- 5 koleksiyon, 21 ürün sunumu; aile, alt tip, kullanım, yüzey, renk, şekil, ebat, kalınlık ve satış türü filtreleri; SKU/özellik araması; sıralama; URL ile paylaşılabilen filtreler; dört aşamalı ürün bulucu.
- Ürüne uygun örnek yapılandırmalar; şekil, yüzey/renk ve paket seçenekleri; MOQ/paket/sipariş katı/temsili kapasite doğrulaması; USD sent üzerinden kademe hesabı.
- Kalıcı sepet; ayrı varyant satırları; sunucu tarafından tekrar hesaplanan fiyatlar; kayıtlı demo satın alma siparişi; başarı ve sipariş ayrıntı sayfası; hesap geçmişi; yeniden sipariş.
- Özel RFQ, hesapta durum/yanıt takibi, toptan başvuru, gerçek onay/red ile fiyat erişimi, firma adres bilgisi düzenleme, iletişim mesajı kaydı.
- Rol korumalı yönetim: örnek KPI'lar, sipariş ayrıntıları/durumları, RFQ durum/yanıtı, ürün adı/koleksiyon/açıklama/görünürlük/satış tipi/fiyat/MOQ/sipariş katı/kademe düzenleme, müşteri başvuruları ve mesajlar.
- EN/TR temel arayüz, doğrulama mesajları, navigation ve metadata; `?lang=tr` + tercih çerezi. Proxy, sunucuda da doğru `html lang` üretir.
- About, Sustainability, üç sektör landing sayfası, Contact ve FAQ. Canonical, hreflang, OpenGraph, sitemap ve kasıtlı **noindex / robots disallow**: demo arama motorlarına açılmamalıdır.

## Teknoloji ve yapı

Next.js 16.4 App Router, React 19, strict TypeScript, Tailwind CSS 4 + özgün CSS tasarım sistemi, Radix Dialog, Lucide, yerel Manrope/Instrument Serif fontları, Zod, Prisma 6.19 + SQLite, Playwright/Chromium, Vitest. Prisma 6.19, SQLite ve basit yerel Windows kurulumunu korumak için sabitlendi. Güncel Next sürümü resmi dokümantasyondan kontrol edildi; gereksiz animasyon bağımlılığı eklenmedi.

Müşteriye açık yayın **Next.js + Netlify Functions + PostgreSQL** kullanır. Yerel Next/SQLite hedefi ve önceki Vinext/Cloudflare Worker adapter'ı korunur. SQLite ve PostgreSQL istemcileri aynı Prisma modellerinden üretilir; PostgreSQL'de sipariş ve başvuru işlemleri gerçek transaction kullanır. `npm run build:netlify` yayın hedefini, `npm run build` yerel ve alternatif Worker hedeflerini derler.

- `src/components/`: storefront, commerce, form ve admin bileşenleri.
- `src/lib/`: tek fiyat/miktar kuralı, DB, oturum, katalog, tipler, dil ve sepet deposu.
- `src/app/[[...path]]/page.tsx`: sayfa yönlendirme ve sunucu veri erişimi; sayfa içerikleri ayrı bileşenlerde.
- `src/app/api/[...action]/route.ts`: Zod doğrulaması, aynı origin kontrolü ve her yönetim işleminde rol kontrolü.
- `prisma/schema.prisma`, `prisma/migrations/`, `prisma/seed.ts`: veri modeli, migration ve seed.

Şifreler benzersiz salt + scrypt ile hash'lenir. Oturum cookie'si HTTP-only ve SameSite=Lax'tır; DB yalnızca rastgele oturum token'ının SHA-256 özetini saklar. HTTPS ortamında `COOKIE_SECURE=true` gerekir. Rol her sunucu isteğinde DB'den okunur. Siparişte fiyat yeniden hesaplanır; istemciden fiyat kabul edilmez; tekrar gönderimler için idempotency anahtarı kullanılır. Sipariş satırları tarihsel fiyat/varyant kopyası tutar. Doğrulanmamış kullanıcıya ürün fiyat verileri sunucu çıktısında verilmez.

## Testler ve ekranlar

```powershell
npx playwright install chromium
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Playwright varsayılan yerel sunucuyu bulursa kullanır, aksi halde başlatır. `TEST_BASE_URL` ile optimize sunum sürümüne yönlendirilebilir. Testler yalnızca bu demo veritabanına hayali QA siparişleri/RFQ/başvurular ekler; gerçek müşteri verisiyle çalıştırılmamalıdır. Ürün fiyatı gibi değiştirilen seed alanları test sonunda geri alınır. Son doğrulama kanıtı: [docs/qa-report.md](docs/qa-report.md). HTML test raporu `playwright-report/index.html`; ekranlar `screenshots/`.

## Gerçek kaynak ve demo ayrımı

45 optimize edilmiş resmi Sun-Ka/Larton görseli yereldedir; tamamının toplamı yaklaşık 2,48 MB. Ürün aileleri ve kurumsal bağlam resmi kaynaklara dayanır. Fotoğraf ürün ailesini temsil eder; seçilen örnek varyantın ölçü/renk/baskısına birebir kanıt sayılmaz. Üçüncü taraf stok, yapay ürün fotoğrafı veya Gamma varlığı kullanılmadı. Fontlar Fontsource üzerinden yereldir, OFL lisans metinleri ilgili npm paketlerinde bulunur.

**Tüm SKU, fiyat, MOQ, paket, ölçü, kalınlık, stok/kapasite ve kademe değerleri temsili demodur.** Siparişler ve başvurular hayali işletmelere aittir. Gerçek ödeme, KDV, kargo fiyatı, kesin termin, ERP, mail gönderimi veya dosya yükleme yoktur. RFQ dosyasızdır; teknik gereksinimler not olarak kaydedilir. Ürün uygunluğu ve gıda teması sertifikaları varsayılmaz.

Resmi iletişim kaynakları arasında e-posta/ikinci telefon farklılıkları var. Bu demoda ortak footer'daki `sales@sunkapaper.com` ve tutarlı ana numara `+1 214 500 6690` seçildi; yayın öncesi şirket teyidi gerekir. En yeni adres olduğu iddia edilmez. Ayrıntılar [marka denetiminde](docs/brand-audit.md).

## Sunum ve sonraki aşama

5–7 dakikalık senaryo: [docs/demo-walkthrough.md](docs/demo-walkthrough.md). Görsel kaynaklar: [docs/asset-sources.md](docs/asset-sources.md). Varsayımlar: [docs/demo-assumptions.md](docs/demo-assumptions.md). Canlıya geçiş: [docs/production-roadmap.md](docs/production-roadmap.md).

Başlıca sınırlar: USD demo tahminleri; örnek konfigürasyonlar; ürün/varyant oluşturma ve görsel yükleme yönetimi bu sürümde yok; yönetim mevcut ürünlerin çekirdek alanlarını düzenler. Canlı ticaret için şirketin katalog/teknik uygunluk, fiyat/MOQ, ödeme/ERP, vergi/kargo ve hukuki/veri saklama politikalarının onaylanması gerekir. Rate limit yerel süreç belleğindedir; üretimde merkezi kalıcı sınırlama, MFA, parola sıfırlama, denetim kaydı, yedekleme ve izleme eklenmelidir.
