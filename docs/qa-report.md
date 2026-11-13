# Verified delivery — Netlify migration, 13 November 2026

Workspace: D:\Projects\SunkaECommerce. Branch: main. Public demo: https://sunka-larton-wholesale.netlify.app. Customer guide: https://sunka-larton-wholesale.netlify.app/demo-guide?lang=tr.

The full Next.js application runs on Netlify Functions with persistent Netlify PostgreSQL. This is an independent deployment, with no redirect or reverse proxy to the previous host. Local Next.js / SQLite and the alternative Worker / D1 target remain available.

## Observed checks

| Check                              | Actual result                                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Lint and strict TypeScript         | Passed locally and in GitHub CI                                                                          |
| Vitest                             | 22 passed, 5 files                                                                                       |
| Native Next.js production build    | Passed                                                                                                   |
| Alternative Vinext / Worker build  | Passed in CI                                                                                             |
| Netlify Linux production build     | Passed; public HTTPS deployment ready                                                                    |
| Native SQLite / Next.js Playwright | 9 passed                                                                                                 |
| Local Worker Playwright            | 9 passed in final CI, including the new touch checkout scenario                                          |
| Public Netlify Playwright          | 9 passed in one final run, 1.8 minutes, fresh browser contexts                                           |
| GitHub CI                          | Passed: https://github.com/HIZMALI/SunkaECommerce/actions/runs/43464613638                               |
| Internal links                     | 53 checked, 0 failures on the public Netlify URL                                                         |
| Health, robots, sitemap            | HTTP 200; sitemap uses the new HTTPS origin; indexing disallowed                                         |
| Visual capture                     | 8 Netlify-specific captures; no page errors, image failures, overflow, old-host links or requests        |
| Persistence                        | Order DEMO-MWF2PYQ3-C0C0 survived the hosting transfer and later deploy; opened again in a fresh browser |
| npm audit                          | 0 vulnerabilities at dependency installation                                                             |

Final application/test source: b269f9def5520383a4814a5630650ddbbe5073d7. Verified Netlify deployment: 6af73cd3ea9c1060a57f9524. Later documentation/screenshot commits do not change the verified application behavior.

## Live browser coverage

- Homepage, real product images, mega menu, four-stage finder, URL filters/search, quick view and empty/reset states.
- Approved buyer login; linked formats, surface/color and pack variants; wholesale tiers; cart quantity and refresh persistence; real server-recorded demo order; account history, details and reorder.
- RFQ creation, account visibility, administrator response/status, product price edit/restore and persistence after refresh.
- Wholesale application, pending-price denial, administrator approval/rejection changing actual authorization and contact-message visibility.
- Anonymous admin denial, same-origin checks, MOQ/pack/capacity validation, quote-only separation, server repricing, idempotent order submission, secure HTTP-only session cookies and logout.
- Four viewport widths (360, 390, 768, 1440), 14 routes, English/Turkish navigation and no browser console/hydration errors.
- Twelve concurrent HTML requests returned complete pages.
- Touch-enabled 390×844 mobile purchase: Turkish validation, Black/100-piece pack selection, 200→300 quantity, refresh, checkout, success and server-rendered account detail showing $234.00.

## Data transfer and publication fixes

The previous fictional database was read without truncation and transferred in one PostgreSQL transaction: 5 categories, 21 products, 42 image records (45 distinct local official assets overall), 49 variants, 63 pricing tiers, 6 companies, 6 users, 8 orders/items, 6 RFQs, 5 wholesale applications and 2 contact messages. Subsequent tests add more fictional records. Existing roles, edits, IDs and history were preserved; sessions were not migrated. The hosted administrator password was renewed and is absent from the public repository and customer guide.

Netlify's CLI production-database write permission was enabled with the user's explicit approval only for migration, then disabled again. The temporary owner connection was removed from the local environment file. The application continues to write through Netlify's own database binding.

Windows Next.js builds succeeded, but Netlify's local packager required unavailable symlink privileges. Publication was moved to Netlify's Linux build service with a read-only GitHub deploy key. GitHub main push delivery returned HTTP 200 and triggered a successful subsequent publication.

One CI run failed while installing Chromium dependencies because the Ubuntu latest runner's external Microsoft apt repository was unavailable. The workflow was pinned to supported Ubuntu 24.04; the full final CI passed afterward.

Visual review found the platform badge overlapping the mobile purchase action. The Netlify layout now reserves space for the badge without hiding it. A regression assertion verifies both edges of the purchase button receive pointer input; the final live mobile purchase passed. Admin screenshot capture was also corrected to await the loaded dashboard rather than the temporary loading shell.

## Real screenshot evidence

All files below are under D:\Projects\SunkaECommerce\screenshots:

- netlify-home-desktop.png (1440×900), netlify-home-mobile.png (390×844), and corresponding full-page captures.
- netlify-catalog.png, netlify-product.png, netlify-cart.png, netlify-checkout.png, netlify-rfq.png, netlify-admin.png.
- netlify-guide-mobile.png, hosted-product-mobile-buyer.png, hosted-order-success-mobile.png.
- persistence-after-deploy.png.

Desktop/mobile home, catalogue, product and dashboard images were visually inspected. Source photos remain official Sun-Ka/Larton assets documented in asset-sources.md; prices, formats, stock/capacity and all identities remain fictional demonstration data. No payment, shipment, ERP call or email was performed.

## Limits

Netlify's free-plan quota and platform badge apply; no card or paid plan was enabled. Production deployments, requests, traffic and database usage consume the monthly quota. This demonstration has no production SLA. Real catalogue approval, prices/MOQ, payment/ERP, tax/shipping and legal/data-retention decisions remain phase-two prerequisites. Runtime rate limiting is process-local; production needs centralized controls, backups and account recovery/MFA.
