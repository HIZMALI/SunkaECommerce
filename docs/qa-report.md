# Verified delivery · 13 November 2026

Actual workspace: `D:\Projects\SunkaECommerce`. Branch: `main`. Application served locally at `http://127.0.0.1:3000` using the optimized `npm start` build for final browser verification.

**Public customer demo:** https://sunka-wholesale-studio.morveteknofest.chatgpt.site — Sites publication **version 3**, source commit `28e6adb0245e6e8aa0e91058c5cb89f8163ee711`. The hosted runtime uses Vinext / Cloudflare Workers with persistent D1; the local Next.js / SQLite target remains available. No Render subscription or paid disk was created.

## Final checks

| Check                                     | Observed result                                                                                                                                      |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm install`                             | Passed; Prisma Client generated successfully                                                                                                         |
| `npm run db:setup`                        | Passed; existing migration applied, idempotent seed preserved records                                                                                |
| `node scripts/check-setup.mjs`            | Passed against two fresh disposable SQLite databases                                                                                                 |
| Fresh development seed                    | 21 products, 3 users, 2 orders, 3 RFQs, 2 applications                                                                                               |
| Fresh production seed with DEMO_MODE=true | 21 catalog presentations; **0 users, orders, RFQs or applications**                                                                                  |
| `npm run lint`                            | Passed; no errors or warnings                                                                                                                        |
| `npm run typecheck`                       | Passed                                                                                                                                               |
| `npm run test`                            | **22 passed**, 5 files; includes hosted origin, guarded sample identities and concurrent Worker request isolation                                    |
| `npm run build`                           | Passed for both optimized Next.js and deployable Vinext/Worker targets                                                                               |
| `npm run test:e2e`                        | **9 passed** on the optimized local Next.js server                                                                                                   |
| `npm run test:worker`                     | **8 passed locally**, final run 40.2 seconds                                                                                                         |
| Public HTTPS Playwright suite             | **8 passed**, 1.4 minutes, against the actual published version 3 in fresh browser contexts                                                          |
| GitHub Actions (Linux)                    | Passed: [run 43447608675](https://github.com/HIZMALI/SunkaECommerce/actions/runs/43447608675), including both runtime targets and all browser suites |
| Cross-deployment persistence              | An order created on version 1 remained accessible after versions 2 and 3 from a fresh browser; `scripts/check-deployment-persistence.mjs` passed     |
| Public health / robots / sitemap          | All returned 200; sitemap uses the public HTTPS origin and robots disallows indexing                                                                 |
| Final Worker log inspection               | No runtime exceptions returned after the version 3 publication; expected 400/403 validation rejections were recorded                                 |
| `node scripts/check-hosted.mjs`           | Passed against a disposable database: runtime migration/seed, separate admin secret, HTTP-only session, health/guide and restart persistence         |
| `node scripts/link-audit.mjs`             | **53 internal links checked; 0 failures**, including the customer guide                                                                              |
| `node scripts/final-visual-qa.mjs`        | Completed; no page/console errors or failed images in captured views                                                                                 |
| `npm audit --audit-level=moderate`        | **0 vulnerabilities**                                                                                                                                |

## Browser coverage

1. Homepage image load, product mega menu, Escape handling, four-step finder, matching catalogue filters, search, empty/reset states and quick-view dialog.
2. Approved buyer login, variant price adjustment, quantity discount threshold, invalid minimum prevention, separate variant cart lines, quantity update, refresh persistence, server-recorded order, success/account history and reorder.
3. Buyer RFQ recording; database verification; account visibility; administrator review/response saved across refresh; admin product price change reflected in the storefront and DB, then restored.
4. New wholesale application and pending account; price endpoint/admin authorization rejection; administrator approval unlocking prices; rejection removing access; contact message visible in administration.
5. Mobile menu/filter drawer; EN/TR links, forms and CTAs; 14 critical routes checked at **360, 390, 768 and 1440 px** with no horizontal overflow, image 404s, console errors or hydration errors.
6. **Touch-enabled 390 × 844 mobile buyer**: Turkish native validation messages independent of browser language, surface/pack selection, 100-piece pack multiples, persistent quantity update, complete demo checkout, saved USD-cent total and success page.
7. Anonymous admin/price rejection; cross-origin rejection; HTTP-only SameSite session; MOQ, pack, capacity, quote-only and mismatched variant rejection; duplicate-line prevention; server repricing of a tampered order; idempotent submission and logout.
8. Administrator order status persistence; independent shape/color/pack selection; company address save/refresh; all catalog images; Turkish SSR `html lang` and metadata; absence of password hashes in page output.
9. Public customer guide in EN/TR; one-click buyer activation, actual product ordering access and 390 px mobile layout.

The hosted suite also covers **12 concurrent page requests across three rounds**, secure HTTPS session cookies, administrator order and RFQ persistence, catalogue price edit/restore, a new wholesale application with approval/rejection, contact-message visibility, server repricing of a tampered order, idempotency and logout.

Tests add fictional local QA records. The seed minimum counts above describe a **fresh** installation; the working presentation database also retains records created during verification. This retention is intentional evidence of persistence and every admin metric is labelled demonstration data.

## Visual inspection and fixes

Official reference-site screenshots were captured and inspected in `docs/research/source-sunka.png`, `source-gamma.png` and `source-larton.png`. The official asset contact sheet was reviewed to correct photo-family/shape interpretations.

The initial desktop/mobile homepage captures were inspected. Final homepage, product, cart, checkout, RFQ and admin views were reviewed after correction. Changes included deterministic number/date localization to remove server/browser hydration differences; initialization states to preserve the first selection; a transition state to prevent rapid reset/search races; actual image loading before full-page captures; original logo proportions; larger mobile touch targets; and a **single-column, 16 px mobile form layout** after examining the initial two-column form.

Baseline screenshots remain in `screenshots/iterations/`. Final full-page home images contain the actual loaded photos rather than empty lazy-image areas. No screenshot is claimed from a mockup or image generator.

Real HTTPS testing exposed two issues that local emulation did not reliably expose: interactive controls could receive a click before hydration, and a globally cached in-flight seed/database promise could outlive a canceled Worker request. Every shared UI button now stays disabled until hydration; Worker Prisma instances are request-scoped through AsyncLocalStorage, seed initialization caches only a completed boolean, and speculative Link prefetch is disabled. The final public browser suite and bounded post-deployment Worker log inspection passed after these changes. Test navigation now explicitly waits for the destination before forcing a reload.

Vinext/Rolldown still emits non-blocking source-map and dynamic-import build warnings. They did not cause failures in the final checks; this is a customer demonstration, not a claim of a production SLA.

## Screenshot evidence

All paths below are under `D:\Projects\SunkaECommerce\screenshots\`:

- `home-desktop.png` — 1440 × 900; `home-mobile.png` — 390 × 844.
- `home-desktop-full.png`, `home-mobile-full.png` — fully loaded full-page captures.
- `catalog.png`, `catalog-mobile.png`, `collection.png`.
- `product.png`, `product-mobile.png`, `product-mobile-buyer.png`.
- `cart.png`, `cart-mobile.png`, `checkout.png`, `checkout-mobile.png`.
- `rfq.png`, `rfq-mobile.png`, `rfq-mobile-form.png`.
- `admin.png`, `admin-mobile.png`, `account.png`, `order-success-mobile.png`.
- `demo-guide-desktop.png`, `demo-guide-mobile.png` — the customer self-service walkthrough.
- `worker-product.png`, `worker-cart.png`, `worker-checkout.png`, `worker-rfq.png`, `worker-admin.png` — actual public HTTPS browser captures.
- `persistence-after-deploy.png` — an existing order opened after a new deployment from a fresh browser.

Playwright HTML report: `playwright-report/index.html`. Latest run status: `test-results/.last-run.json` (`passed`, no failed tests).

## Limits of verification

Chromium and Chromium touch emulation were used; Safari/WebKit, Firefox, real mobile hardware and external integrations were not tested. Accessibility behavior was exercised through semantic locators, keyboard Escape and Radix dialog behavior; this is not a formal WCAG certification. No production load test, live payment, real email, ERP, freight/tax calculation, attachment upload or real stock verification is included. See `production-roadmap.md` for the company decisions and engineering work required before live commerce.
