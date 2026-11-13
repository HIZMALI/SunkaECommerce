# Ücretsiz müşteri yayını: Netlify + PostgreSQL

Müşteri adresi: https://sunka-larton-wholesale.netlify.app. Deneme rehberi: /demo-guide?lang=tr. Kaynak depo: https://github.com/HIZMALI/SunkaECommerce; çalışma dalı main. Bu yayın başka bir siteye yönlendiren proxy değildir: Next.js uygulaması Netlify Functions üzerinde, kayıtlar kalıcı Netlify PostgreSQL veritabanında çalışır.

## Ortamlar

- Yerel: Next.js App Router + Prisma native client + SQLite. npm run db:setup ve npm run dev değişmedi; Docker veya uzak hesap gerekmez.
- Müşteri yayını: aynı Next.js sayfaları + Netlify OpenNext adapter'ı + Prisma PostgreSQL adapter'ı. Modeller scripts/generate-postgres.mjs ile yerel Prisma şemasından türetilir; fiyat ve iş kuralları ortaktır.
- Önceki Worker/D1 adapter'ı alternatif hedef olarak korunur; [yerel Worker yönergesi](deployment-worker.md). Müşteriye eski yayın adresi gönderilmez.

## Veritabanı ve sırlar

Netlify Database'in otomatik NETLIFY_DB_URL bağlantısı kullanılır. DATABASE_PROVIDER=postgresql, DEMO_MODE=true, APP_ENV=demo, ALLOW_HOSTED_DEMO_SEED=true, COOKIE_SECURE=true, APP_URL=https://sunka-larton-wholesale.netlify.app ve ayrı DEMO_ADMIN_PASSWORD gereklidir. Yönetici parolası en az 20 karakterdir; public depo ve istemci paketine konmaz. .env.netlify yerel yönetim dosyasıdır ve Git tarafından dışlanır. Yerel yönetici parolası yayında kullanılmaz.

prisma/postgresql/migrations sürümlü SQL içerir. npm run db:setup:postgres her migration'ı transaction ve advisory lock altında bir kez uygular; checksum kontrolü uygulanmış SQL'in sessizce değiştirilmesini engeller. Şema normal HTTP isteklerinde değiştirilmez. Sipariş/satırlar, başvuru/kullanıcı ve ürün/fiyat kademeleri gerçek PostgreSQL transaction'larıyla kaydedilir. Fiyat, rol, MOQ ve paket kuralları sunucuda yeniden kontrol edilir.

Seed tekrarlanabilir; var olan ürün düzenlemeleri ve kayıtlar korunur. Önceki demodan aktarım tablo verilerini taşır; eski oturumlar taşınmaz. Yönetici için yeni hosted demo parolası atanır. Veri dosyaları ve bağlantı sırları depoya eklenmez.

Netlify başlangıçta CLI/PAT araçlarına üretim veritabanında salt okunur erişim verir. İlk aktarım için kullanıcı tarafından onaylanan geçici yazma izni kullanılır; aktarım tamamlanınca tekrar kapatılır. Uygulamanın kendi veritabanı binding'i bu yönetim izninden ayrıdır.

## Build ve yayın

netlify.toml build komutunu npm run build:netlify, çıktı klasörünü .next olarak tanımlar. Build sırası: PostgreSQL istemcisi → migration → idempotent demo seed → Next.js production build. Netlify'nin Next.js adapter'ı sunucu fonksiyonları ve statik varlıkları paketler.

```powershell
npm install
# Hosted ortam değişkenleri yalnız Netlify'de veya Git dışında .env.netlify içinde:
npm run build:netlify
npx netlify-cli deploy --prod
```

Yalnız başarılı deploy kaydı yayınlandığında ve oturumsuz tarayıcı HTTPS adresini açabildiğinde yayın tamamlanmış sayılır. Public erişim yeni projelerde ayrıca açılır. Site ID'si tek başına müşteri erişimi için yeterli değildir. GitHub main kaynak kodunu barındırır; CLI ile yapılan yayınlar manuel güncellenir.

## Doğrulama

Lint, TypeScript, unit test, yerel SQLite/Next build ve e2e korunur. Aynı kapsamlı tarayıcı paketi yeni HTTPS adresinde giriş, varyant/kademe, sepet yenileme, sipariş/hesap/yeniden sipariş, RFQ, yönetici düzenleme ve başvuru onayını doğrular. Testler yalnız hayali bilgiler oluşturur. scripts/run-worker-tests.mjs adı tarihsel olsa da uzak Next.js hedefinde aynı akışları çalıştırır; yönetici ayarları gizli stdin'den alınır.

Yayın sonrası mevcut bir sipariş kimliği scripts/check-deployment-persistence.mjs ile yeni tarayıcı oturumunda tekrar açılır. İkinci deploydan sonra da aynı kaydın görünmesi kontrol edilir. Son gerçek sonuçlar [QA raporundadır](qa-report.md).

## Ücretsiz plan sınırları

Netlify Free aylık 300 kredi ve sert kullanım limiti sağlar; otomatik ücretlendirme yoktur. Üretim deployları, trafik, fonksiyon ve veritabanı kullanımı bu kotayı tüketir. Kota dolunca yayın durabilir. Veritabanı hareketsizlikte uyuyabilir; ilk erişim daha yavaş olabilir. Bu, SLA taahhütlü gerçek ticaret barındırması değildir. Kart, ücretli Render servisi veya özel alan adı satın alınmadı.

Kaynaklar: [Netlify planları](https://www.netlify.com/pricing/), [Next.js desteği](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/), [Netlify Database](https://docs.netlify.com/build/data-and-storage/netlify-database/), [veritabanı erişimi](https://docs.netlify.com/build/data-and-storage/netlify-database/access-control/).
