# Demo assumptions and implementation blueprint

The actual open workspace is `D:\Projects\SunkaECommerce`; the singular `D:\Project` spelling in the brief is treated as a typo. The application is built directly in the open workspace, without a nested checkout. Work stays on `main`.

## Information architecture and visual direction
An editorial material-led storefront connects five product families, a four-step board finder, filtered catalog, configurable product details, persistent cart, and purchase-order demo checkout. RFQ and wholesale applications share the same customer account and administration records. English is default; Turkish is available with shareable `?lang=tr` URLs and a preference cookie. Stone, dark ink, and verified brand accents support official photography. No competitor assets are used.

## Data and business rules
Prisma + SQLite represent Category → Product → ProductImage / ProductVariant / PricingTier, Company → User → Session / Order / QuoteRequest / WholesaleApplication, and ContactSubmission. Cart lines are persisted in browser storage and repriced against the database on the server before display and checkout. Orders retain immutable product/variant/price snapshots. Prices use integer USD cents; discounts use integer basis points. MOQ, pack multiples, capacity, visibility, role and sale mode are checked server-side. Sessions contain only opaque random tokens; database stores their SHA-256 digests. Passwords use salted scrypt.

## What is representative
Official product families and photographs are real source material. All SKU codes, configurations, sample sizes, thicknesses, pack sizes, capacity limits, minimum order quantities, tier discounts, prices, sample company identities and operational statuses are fictional demonstration data. Product photography depicts its official family and is not evidence of the selected sample configuration. No exact food-contact certificates, load ratings, guaranteed lead times, tax rates or shipping rates are asserted.

21 product presentations are implemented: die-cut round / mixed finishes, flower-cut, salmon, mono portion round / rectangular, seven cornerboard types, six cardboard types and two reel types. The photo audit corrected the black mono portion presentation to rectangular. A square die-cut configuration remains an explicitly labelled sample variant; the official family photo does not verify that exact sample shape. Standard-order versus quote-only assignments are demo merchandising choices. Quantity is in pieces, package quantities are explicit; reels remain quotation-only. Discount thresholds 100 / 500 / 1000 pieces are illustrative and editable.

The final art direction uses the verified navy `#003761`, green `#6f983f`, charcoal and warm stone palette. Fonts are locally bundled Manrope (OFL) and Instrument Serif (OFL). The homepage material photograph, gallery/detail, product stages, sectors and RFQ each use relevant official images. Motion is limited to CSS hover, drawer and loading transitions and respects reduced-motion preferences.

No real payment, email, ERP, shipping, file-upload or stock integration exists. Submitted requests are recorded locally. Demo checkout is restricted to approved buyers and admins. Pending buyers cannot retrieve prices through the UI or catalog APIs. File attachment is intentionally omitted; dimensions and notes are persisted instead.

## Production inputs needed
Approved and versioned product specifications, family-specific units and tolerances, food-contact declarations where applicable, MOQ/pack rules, real price lists and currencies, customer approval rules, stock/ERP mapping, lead-time policy, freight/tax calculation, payment terms, returns, privacy/retention and publication rights for source imagery.
