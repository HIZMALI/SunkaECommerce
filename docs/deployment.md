# GitHub + Render yayınlama

Uygulama Next.js sunucusu, HTTP-only oturumlar ve SQLite yazma erişimi gerektirir. GitHub Pages bu sunucuyu çalıştıramaz. Public GitHub deposu kaynak kodu barındırır; çalışan müşteri demosu Render Node web servisi üzerinde çalışır.

## Hazır yapılandırma

13 Kasım 2026 tarihinde kontrol edilen [Render fiyatlandırmasına](https://render.com/pricing) göre bu servisin taban maliyeti 7 USD/ay compute + 0,25 USD/ay disk = **7,25 USD/ay**; vergi, kota aşımı ve mevcut hesap kullanımından kaynaklanan ek ücretler ayrıca olabilir. Hobby workspace yükseltmesi gerekmez. Kart doğrulaması geçici 1 USD provizyon gösterebilir. Dağıtım sırasında Render ekranındaki güncel tutar esas alınır.

Kökteki `render.yaml`, `main` dalını kullanan **0.5 CPU / 512 MB Node web servisi + 1 GB kalıcı disk** tanımlar. Bu ücretli kaynakları oluşturur; dosyayı commit etmek tek başına ücret veya dağıtım başlatmaz. Render ekranındaki güncel fiyatı gözden geçirin. Otomatik dağıtım kapalıdır; yeni sürümü elle dağıtın.

1. Render → New → Blueprint → `HIZMALI/SunkaECommerce` public deposunu seçin. Dal `main`, dosya `render.yaml`.
2. 0.5 CPU / 512 MB servis, Frankfurt ve 1 GB diski inceleyip dağıtımı başlatın. Kurumsal canlı ticaret yerine ayrı bir **demo sandbox** kurulmaktadır.
3. Build: `npm ci --include=dev && npm run build`. Başlatma: `npm run start:hosted`. SQLite `/var/data/sunka-demo.db` içindedir; disk uygulama yeniden başlarken korunur.
4. `RENDER_EXTERNAL_URL` Render tarafından sağlanır. Yerel `APP_URL=http://127.0.0.1:3000` değerini hosted ortama taşımayın. Özel alan adı kullanılırsa HTTPS origin'i `APP_URL` olarak ayarlayın.
5. Yönetici: `admin@sunka.demo`. Şifre Render'ın oluşturduğu **DEMO_ADMIN_PASSWORD** secret'ıdır; yalnız sunumu yapan kişiyle özel olarak paylaşın. Müşteri hesabı rehberdeki ortak örnek hesaptır.
6. `/api/health` 200 dönmeli. `/demo-guide` açılmalı. Müşteri girişi → sipariş → RFQ → admin görünürlüğü doğrulanmalı. Servisi yeniden başlatıp kayıtların korunduğunu kontrol edin.

## Veritabanı ve hesap sınırları

Kalıcı disk build/pre-deploy aşamasına bağlı olmadığından migration ve idempotent seed **başlatma sırasında**, Next sunucusundan önce çalışır. Her boot veriyi sıfırlamaz; düzenlemeleri ve müşteri denemelerini korur. SQLite ile tek servis örneği kullanılır. Gerçek müşteri verisi saklanmaz.

Normal production seed'i demo hesap oluşturmaz. Hosted deneme bunun için üç açık opt-in kullanır: `APP_ENV=demo`, `DEMO_MODE=true`, `ALLOW_HOSTED_DEMO_SEED=true`. Bunlara ek olarak yerel şifreden farklı, en az 20 karakterli `DEMO_ADMIN_PASSWORD` zorunludur. Eksik/hatalı durumda seed kapanır. Yönetici secret'ı değişirse seed hash'i günceller ve mevcut yönetici oturumlarını iptal eder. Gerçek canlı ortamda bu bayraklar açılmaz.

HTTPS origin'de `Secure` cookie otomatik etkinleşir; sunucu Render'ın `PORT` değerini ve `0.0.0.0` bind adresini kullanır. DB dosyası ve `.env` git'e alınmaz. Sağlık endpoint'i veri veya kimlik bilgisi sızdırmaz. Demo `noindex` olarak kalır.

## İşletim

Yayınlanan demo paylaşımlıdır; kötüye kullanım için süreç içi rate limit vardır, üretim güvenlik sınırı değildir. Kritik demo öncesi disk yedeği alın. Render disk yedeğini, servis planını ve uygulamayı kapatma seçeneğini hesap sahibi yönetir. Gerçek ticaret için `production-roadmap.md` uygulanmalıdır.

Kaynaklar: [Render Next.js](https://render.com/docs/deploy-nextjs-app), [Blueprint alanları](https://render.com/docs/blueprint-spec), [Kalıcı diskler](https://render.com/docs/disks), [GitHub Pages kapsamı](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
