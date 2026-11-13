# Ücretsiz müşteri yayını: Sites + Cloudflare D1

Müşteri demosu Sites üzerinde yayımlanmak üzere hazırlanmıştır. Render aboneliği veya ücretli disk oluşturulmadı. GitHub Pages uygulamanın sunucu ve veritabanı işlemlerini çalıştıramadığı için kullanılmıyor. Public kaynak depo HIZMALI/SunkaECommerce, geliştirme dalı main olarak korunur.

## İki çalışma hedefi

- Yerel: Next.js App Router + Prisma 6.19 native client + prisma/demo.db. Önceki npm run dev ve npm start akışı korunur.
- Yayın: Aynı React/App Router sayfaları Vinext ile Cloudflare Worker'a derlenir. Prisma'nın Rust gerektirmeyen ESM istemcisi ve D1 adapter'ı, kalıcı SQLite tabanlı D1'e bağlanır.

npm run build iki hedefi de oluşturur; build:next ve build:site hedefleri ayrı çalıştırılabilir. Vite yalnızca yayın hedefinde DB ve çok kayıtlı yazma işlemlerini src/edge/ uyarlamasına yönlendirir. Yerel şema prisma/schema.prisma içinde kalır. D1 şeması db/schema.ts, üretilen ve incelenmiş migration'lar drizzle/ içindedir.

## Kalıcı kayıtlar ve atomik yazma

Sites, .openai/hosting.json içindeki DB binding'ini sağlar ve migration'ları dağıtım sırasında uygular. D1 process belleği veya geçici dosya değildir; sipariş, teklif, başvuru ve yönetici değişiklikleri ayrı ziyaretlerde korunur. Yerel SQLite dosyası sunucuya yüklenmez.

Prisma D1 adapter'ı transactions sağlamadığından sipariş + satırlar, firma + kullanıcı + başvuru, ürün + fiyat kademeleri ve başvuru + hesap rolü değişikliği D1 transactional batch ile kaydedilir. Fiyat/miktar kuralları ortak pricing.ts / catalog.ts kodunu kullanır. Sunucu istemcinin gönderdiği fiyatı kabul etmez.

Worker, Prisma istemcisini AsyncLocalStorage üzerinden her HTTP isteğine ayrı bağlar. D1 I/O'su yapan bekleyen Promise'lar veya Prisma istemcileri farklı istekler arasında paylaşılmaz; iptal edilen bir istek sonrakileri bekletmemelidir. Link ön yüklemesi kapalıdır; gezinme kullanıcı tıkladığında başlar. Etkileşimli düğmeler hydration tamamlanana kadar devre dışıdır. Bu kurallar gerçek yayın testinde görülen iptal/erken tıklama sorunlarını önlemek içindir.

Yalnızca temiz kurulumdan çıkarılmış hayali seed verileri src/edge/seed-data.json içindedir. Çalışma veritabanındaki QA/kullanıcı kayıtları taşınmaz. Yönetici hash'i bu dosyada yoktur; ilk kurulumda Sites secret'ından üretilir. Sabit örnek ID'ler, INSERT OR IGNORE ve migration-owned SeedState kaydı mevcut düzenlemelerin sonraki açılışlarda sıfırlanmasını engeller. Şema request sırasında oluşturulmaz/değiştirilmez.

## Runtime ayarları

Sites ortamında DEMO_MODE=true, APP_ENV=demo, COOKIE_SECURE=true, APP_URL=<public HTTPS origin> ve gizli DEMO_ADMIN_PASSWORD kullanılır. Yönetici parolası en az 20 karakterdir; public depo, istemci paketi ve hosting manifest'inde bulunmaz. Yerel SunkaDemo!2026 şifresi yayında geçerli değildir. Yerel .env, .dev.vars, DB ve araç çıktıları git'e alınmaz.

Müşteri hesabı: buyer@sunka.demo / BuyerDemo!2026. Bekleyen örnek hesap: pending@sunka.demo / PendingDemo!2026. Bunlar ortak hayali demo kimlikleridir. Gerçek kişisel bilgi girilmemelidir. Yönetici parolası sunumu yapan kişiyle özel olarak paylaşılır.

## Worker'ı yerelde denemek

```powershell
npm install
npm run build:site
npm run db:setup:site
npm run start:site
```

Önizleme: http://127.0.0.1:8787. Setup gerekirse .dev.vars.example dosyasını .dev.vars olarak kopyalar ve yerel D1 migration'larını uygular. Yerel Worker verisi .wrangler/commerce içinde korunur. Önizleme yöneticisinin şifresi .dev.vars.example içindedir; hosted yönetici için kullanılmaz.

```powershell
npm run test:worker
```

Testler tamamen hayali kayıtlar oluşturur. WORKER_BASE_URL farklı origin'e yönlendirebilir; hosted yönetici secret'ı terminal argümanlarına veya repoya konmaz. scripts/run-worker-tests.mjs test ayarlarını gizli stdin üzerinden alır.

## Yayın süreci ve sınırlar

Sites skill'i üzerinden build, kaynak senkronizasyonu ve artifact paketleme yapılır. Native save/deploy sonucu doğrulanmadan bir URL yayınlanmış sayılmaz. Müşteri erişimi public olarak ayarlanmıştır; ChatGPT oturumu gerekmez. Güncellemeler manuel yayınlanır. Her yeni sürüm mevcut D1 verisini korur; migration geçmişi değiştirilmez.

Bu ücretsiz demo yolu işletme için SLA veya sınırsız trafik taahhüdü değildir. Sites kullanım ve platform sınırlarına tabidir. Gerçek ticaret için katalog, fiyat, güvenlik, yedekleme ve operasyon planı ayrıca ele alınmalıdır. render.yaml kullanılmayan ücretli Node alternatifi olarak tutulmuştur; otomatik dağıtımı kapalıdır.

Kaynaklar: [Vinext](https://github.com/cloudflare/vinext), [Prisma D1 sınırları](https://www.prisma.io/docs/orm/v6/overview/databases/cloudflare-d1), [D1 batch](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch), [Prisma ESM istemcisi](https://www.prisma.io/docs/orm/v6/prisma-schema/overview/generators).
