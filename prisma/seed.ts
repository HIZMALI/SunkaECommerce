import "dotenv/config";
import { createDatabaseClient } from "../src/lib/database-client";
import { hashPassword, verifyPassword } from "../src/lib/auth";
import { demoSeedPolicy } from "../src/lib/seed-policy";
const db = createDatabaseClient();
const categories = [
  [
    "cake-salmon-boards",
    "Cake & Salmon Boards",
    "Pasta ve Somon Altlıkları",
    "Presentation starts with the right foundation. Explore die-cut, flower-cut and salmon boards.",
    "Doğru sunum, doğru altlıkla başlar. Kesimli pasta ve somon altlıklarını keşfedin.",
    "cake-die-cut",
  ],
  [
    "presentation-boards",
    "Specialty Presentation Boards",
    "Özel Sunum Altlıkları",
    "Small formats. Considered details. Boards for individual portions and retail presentation.",
    "Tek porsiyon ve perakende sunumları için özenle tasarlanmış küçük formatlar.",
    "mono-portion",
  ],
  [
    "cornerboards",
    "Cornerboards",
    "Karton Köşebentler",
    "Paper-based edge protection in profiles adapted to your packaging process.",
    "Ambalaj sürecinize uyarlanabilen, kâğıt bazlı kenar koruma profilleri.",
    "corner-kraft",
  ],
  [
    "cardboard",
    "Cardboard",
    "Mukavva",
    "From natural grey to bright metallic finishes: a versatile material platform.",
    "Doğal gri tonlardan parlak metalize yüzeylere, çok yönlü mukavva çözümleri.",
    "card-metalised",
  ],
  [
    "grey-board-reels",
    "Grey Board Reels",
    "Gri Karton Bobinler",
    "Grey board coils and slit reels for converting and industrial applications.",
    "Dönüştürme ve endüstriyel uygulamalar için gri karton ve dilimlenmiş bobinler.",
    "reel-coil",
  ],
];
// Product families are official; sample formats, SKUs and prices below are fictional demo configurations.
const rows = [
  [
    "die-cut-round-boards",
    "Die Cut Round Boards",
    "Yuvarlak Kesimli Pasta Altlığı",
    0,
    "Die Cut Boards",
    "cake-die-cut",
    "Round",
    "Gold",
    "Metalised",
    68,
    "STANDARD_ORDER",
  ],
  [
    "die-cut-mixed-finish-boards",
    "Die Cut Boards — Mixed Finishes",
    "Kesimli Pasta Altlığı — Farklı Yüzeyler",
    0,
    "Die Cut Boards",
    "cake-gold",
    "Round",
    "Silver",
    "Metalised",
    74,
    "STANDARD_ORDER",
  ],
  [
    "flower-cut-board",
    "Flower Cut Board",
    "Çiçek Kesim Pasta Altlığı",
    0,
    "Flower Cut Board",
    "cake-flower",
    "Flower",
    "Gold",
    "Metalised",
    82,
    "STANDARD_ORDER",
  ],
  [
    "salmon-board",
    "Salmon Board",
    "Somon Altlığı",
    0,
    "Salmon Board",
    "salmon",
    "Rectangle",
    "Gold",
    "Metalised",
    92,
    "STANDARD_ORDER",
  ],
  [
    "mono-portion-round-boards",
    "Round Mono Portion Boards",
    "Yuvarlak Tek Porsiyon Altlık",
    1,
    "Single-Serve Mono Portion Boards",
    "mono-portion",
    "Round",
    "Gold",
    "Bright finish",
    29,
    "STANDARD_ORDER",
  ],
  [
    "mono-portion-rectangular-boards",
    "Rectangular Mono Portion Boards",
    "Dikdörtgen Tek Porsiyon Altlık",
    1,
    "Single-Serve Mono Portion Boards",
    "mono-square",
    "Rectangle",
    "Black",
    "Matte",
    32,
    "STANDARD_ORDER",
  ],
  [
    "white-moisture-resistant-cornerboard",
    "White Moisture Resistant Cornerboard",
    "Beyaz Neme Dayanıklı Köşebent",
    2,
    "Cornerboard",
    "corner-white",
    "L profile",
    "White",
    "Moisture resistant",
    120,
    "QUOTE_ONLY",
  ],
  [
    "kraft-cornerboard",
    "Kraft (Paper) Cornerboard",
    "Kraft Karton Köşebent",
    2,
    "Cornerboard",
    "corner-kraft",
    "L profile",
    "Kraft",
    "Natural",
    110,
    "QUOTE_ONLY",
  ],
  [
    "oval-cornerboard",
    "Oval Cornerboard",
    "Oval Köşebent",
    2,
    "Cornerboard",
    "corner-oval",
    "Oval",
    "Kraft",
    "Natural",
    130,
    "QUOTE_ONLY",
  ],
  [
    "u-profile-cornerboard",
    "U Profile Cornerboard",
    "U Profil Köşebent",
    2,
    "Cornerboard",
    "corner-u",
    "U profile",
    "Kraft",
    "Natural",
    140,
    "QUOTE_ONLY",
  ],
  [
    "notched-cornerboard",
    "Notched Cornerboard",
    "Çentikli Köşebent",
    2,
    "Cornerboard",
    "corner-notched",
    "Notched",
    "Kraft",
    "Natural",
    145,
    "QUOTE_ONLY",
  ],
  [
    "locked-cornerboard",
    "Locked Cornerboard",
    "Kilitli Köşebent",
    2,
    "Cornerboard",
    "corner-locked",
    "Locked",
    "Kraft",
    "Natural",
    150,
    "QUOTE_ONLY",
  ],
  [
    "self-adhesive-cornerboard",
    "Self-Adhesive Cornerboard",
    "Kendinden Yapışkanlı Köşebent",
    2,
    "Cornerboard",
    "corner-adhesive",
    "L profile",
    "Kraft",
    "Self-adhesive",
    155,
    "QUOTE_ONLY",
  ],
  [
    "metalised-cardboard",
    "Metalised / Bright-Finish Cardboard",
    "Metalize / Parlak Mukavva",
    3,
    "Cardboard",
    "card-metalised",
    "Sheet",
    "Gold",
    "Bright finish",
    180,
    "STANDARD_ORDER",
  ],
  [
    "grey-cardboard",
    "Grey Cardboard",
    "Gri Mukavva",
    3,
    "Cardboard",
    "card-grey",
    "Sheet",
    "Grey",
    "Natural",
    110,
    "STANDARD_ORDER",
  ],
  [
    "white-cardboard",
    "White Cardboard",
    "Beyaz Mukavva",
    3,
    "Cardboard",
    "card-white",
    "Sheet",
    "White",
    "Matte",
    130,
    "STANDARD_ORDER",
  ],
  [
    "black-cardboard",
    "Black Cardboard",
    "Siyah Mukavva",
    3,
    "Cardboard",
    "card-black",
    "Sheet",
    "Black",
    "Matte",
    140,
    "STANDARD_ORDER",
  ],
  [
    "testliner-kraftliner-cardboard",
    "Testliner & Kraftliner Cardboard",
    "Testliner ve Kraftliner Mukavva",
    3,
    "Cardboard",
    "card-kraft",
    "Sheet",
    "Kraft",
    "Natural",
    120,
    "QUOTE_ONLY",
  ],
  [
    "colored-cardboard",
    "Colored Cardboard",
    "Renkli Mukavva",
    3,
    "Cardboard",
    "card-colored",
    "Sheet",
    "Colored",
    "Matte",
    150,
    "QUOTE_ONLY",
  ],
  [
    "grey-board-coil",
    "Grey Board Coil",
    "Gri Karton Bobin",
    4,
    "Grey Board Reel",
    "reel-coil",
    "Coil",
    "Grey",
    "Natural",
    0,
    "QUOTE_ONLY",
  ],
  [
    "slitting-grey-board-reel",
    "Slitting Grey Board Reel",
    "Dilimlenmiş Gri Karton Bobin",
    4,
    "Grey Board Reel",
    "reel-slitting",
    "Slit reel",
    "Grey",
    "Natural",
    0,
    "QUOTE_ONLY",
  ],
] as const;
async function main() {
  const policy = demoSeedPolicy(process.env);
  for (const c of categories)
    await db.category.upsert({
      where: { id: c[0] },
      update: {},
      create: {
        id: c[0],
        title: c[1],
        titleTr: c[2],
        description: c[3],
        descriptionTr: c[4],
        image: `/images/${c[5]}.webp`,
      },
    });
  for (const [index, r] of rows.entries()) {
    const [
      slug,
      title,
      titleTr,
      cat,
      subcategory,
      img,
      shape,
      color,
      finish,
      baseCents,
      saleMode,
    ] = r;
    const id = `p${String(index + 1).padStart(2, "0")}`;
    if (await db.product.findUnique({ where: { id } })) continue;
    const sku = `SK-SAMPLE-${String(index + 1).padStart(3, "0")}`;
    const food = cat <= 1;
    const size =
      cat === 2
        ? "50 × 50 × 1000 mm"
        : cat === 3
          ? "700 × 1000 mm"
          : cat === 4
            ? "500 mm width"
            : "250 mm";
    const description = food
      ? `${title} for bakery, food and retail presentation. Explore the sample configuration or request a format tailored to your application.`
      : cat === 2
        ? `${title} for packaging and logistics. Discuss profile dimensions and application requirements with the team before specifying a production order.`
        : cat === 3
          ? `${title} for packaging, converting and presentation. Select a sample sheet format or discuss a made-to-order specification.`
          : `${title} for converting and manufacturing. Width, thickness and winding requirements are confirmed through a custom quotation.`;
    const descriptionTr = food
      ? `${titleTr}; pastane, gıda ve perakende sunumları için. Örnek yapılandırmayı inceleyin veya kullanımınıza özel bir format talep edin.`
      : cat === 2
        ? `${titleTr}; ambalaj ve lojistik süreçleri için. Üretim siparişinden önce profil ölçülerini ve uygulama gereksinimlerini ekiple netleştirin.`
        : cat === 3
          ? `${titleTr}; ambalaj, dönüştürme ve sunum uygulamaları için. Örnek levha formatını seçin veya özel üretim talep edin.`
          : `${titleTr}; dönüştürme ve üretim için. En, kalınlık ve sarım gereksinimleri özel teklifle netleştirilir.`;
    const second =
      slug === "die-cut-round-boards"
        ? "cake-round"
        : slug === "flower-cut-board"
          ? "cake-flower-detail"
          : slug === "salmon-board"
            ? "salmon-detail"
            : cat === 1
              ? "mono-detail"
              : slug === "kraft-cornerboard"
                ? "corner-kraft-detail"
                : slug === "metalised-cardboard"
                  ? "card-metalised-detail"
                  : img;
    await db.product.create({
      data: {
        id,
        slug,
        sku,
        title,
        titleTr,
        description,
        descriptionTr,
        categoryId: categories[cat][0],
        subcategory,
        industry: food
          ? "Food & Retail"
          : cat === 2
            ? "Packaging & Logistics"
            : "Manufacturing & Furniture",
        saleMode,
        baseCents,
        moq: 100,
        packMultiple: 50,
        specs: JSON.stringify({
          material: "Paperboard / Mukavva",
          configuration: "Sample only / Yalnızca örnek",
          origin: "Official Sun-Ka product family / Resmi Sun-Ka ürün ailesi",
        }),
        sourceUrl: "https://www.sunkapaper.com/",
        images: {
          create: [
            {
              src: `/images/${img}.webp`,
              alt: `Official Sun-Ka ${title} product photograph`,
              position: 0,
            },
            {
              src: `/images/${second}.webp`,
              alt: `Sun-Ka ${title} family detail`,
              position: 1,
            },
          ],
        },
        variants: {
          create: [
            {
              id: `${id}-v1`,
              sku: `${sku}-A`,
              shape,
              size,
              finish,
              color,
              thickness: food ? "2 mm" : cat === 4 ? "1.5 mm" : "3 mm",
              pack: 50,
              adjustmentCents: 0,
            },
            {
              id: `${id}-v2`,
              sku: `${sku}-B`,
              shape,
              size: food
                ? "300 mm"
                : cat === 2
                  ? "60 × 60 × 1200 mm"
                  : cat === 3
                    ? "800 × 1200 mm"
                    : "600 mm width",
              finish,
              color,
              thickness: food ? "3 mm" : "4 mm",
              pack: 50,
              adjustmentCents: food ? 18 : 30,
            },
            ...(food
              ? [
                  {
                    id: `${id}-v3`,
                    sku: `${sku}-C`,
                    shape,
                    size: "250 mm",
                    finish: "Matte",
                    color: "Black",
                    thickness: "2 mm",
                    pack: 100,
                    adjustmentCents: 10,
                  },
                ]
              : []),
          ],
        },
        tiers: {
          create: [
            { minQty: 100, discountBps: 0 },
            { minQty: 500, discountBps: 800 },
            { minQty: 1000, discountBps: 1500 },
          ],
        },
      },
    });
  }
  await db.productVariant.upsert({
    where: { id: "p01-v4" },
    update: {},
    create: {
      id: "p01-v4",
      productId: "p01",
      sku: "SK-SAMPLE-001-D",
      shape: "Square",
      size: "250 × 250 mm",
      finish: "Metalised",
      color: "Gold",
      thickness: "2 mm",
      pack: 50,
      adjustmentCents: 22,
    },
  });
  // Upgrade only the untouched initial presentation labels to reflect the observed official photo shapes.
  await db.product.updateMany({
    where: { id: "p02", title: "Die Cut Square Boards" },
    data: {
      slug: "die-cut-mixed-finish-boards",
      title: "Die Cut Boards — Mixed Finishes",
      titleTr: "Kesimli Pasta Altlığı — Farklı Yüzeyler",
    },
  });
  await db.productVariant.updateMany({
    where: { productId: "p02", shape: "Square" },
    data: { shape: "Round" },
  });
  await db.product.updateMany({
    where: { id: "p06", title: "Square Mono Portion Boards" },
    data: {
      slug: "mono-portion-rectangular-boards",
      title: "Rectangular Mono Portion Boards",
      titleTr: "Dikdörtgen Tek Porsiyon Altlık",
    },
  });
  await db.productVariant.updateMany({
    where: { productId: "p06", shape: "Square" },
    data: { shape: "Rectangle" },
  });
  if (!policy.enabled) {
    console.log("Catalog ready. Demo identities were not seeded.");
    return;
  }
  const people = [
    [
      "admin@sunka.demo",
      policy.adminPassword ?? "SunkaDemo!2026",
      "Demo Administrator",
      "ADMIN",
      "Sun-Ka Demo Team",
    ],
    [
      "buyer@sunka.demo",
      "BuyerDemo!2026",
      "Alex Morgan",
      "APPROVED_BUYER",
      "Studio Bakery · Sample Company",
    ],
    [
      "pending@sunka.demo",
      "PendingDemo!2026",
      "Deniz Kaya",
      "PENDING_BUYER",
      "Paper & Co. · Sample Company",
    ],
  ] as const;
  for (const [email, password, name, role, company] of people) {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      if (
        policy.hosted &&
        role === "ADMIN" &&
        !verifyPassword(password!, existing.passwordHash)
      ) {
        await db.$transaction([
          db.user.update({
            where: { id: existing.id },
            data: { passwordHash: hashPassword(password!) },
          }),
          db.session.deleteMany({ where: { userId: existing.id } }),
        ]);
      }
      continue;
    }
    await db.user.create({
      data: {
        email,
        name,
        role,
        passwordHash: hashPassword(password),
        company: {
          create: {
            name: company,
            country: "United States",
            address: "100 Sample Avenue, Demo City (fictional)",
            phone: "+1 555 010 2026",
          },
        },
      },
    });
  }
  const buyer = await db.user.findUniqueOrThrow({
    where: { email: "buyer@sunka.demo" },
  });
  const pending = await db.user.findUniqueOrThrow({
    where: { email: "pending@sunka.demo" },
  });
  for (let n = 1; n <= 2; n++) {
    const id = `DEMO-2026-000${n}`;
    await db.order.upsert({
      where: { id },
      update: {},
      create: {
        id,
        userId: buyer.id,
        company: "Studio Bakery · Sample Company",
        name: buyer.name,
        email: buyer.email,
        phone: "+1 555 010 2026",
        country: "United States",
        shippingAddress: "100 Sample Avenue, Demo City (fictional)",
        billingAddress: "100 Sample Avenue, Demo City (fictional)",
        notes: "Seed sample — no production or delivery.",
        status: n === 1 ? "RECORDED" : "IN_REVIEW",
        totalCents: 34000,
        idempotencyKey: `seed-${n}`,
        items: {
          create: {
            productId: "p01",
            variantId: "p01-v1",
            title: "Die Cut Round Boards",
            titleTr: "Yuvarlak Kesimli Pasta Altlığı",
            variantLabel:
              "Round · 250 mm · Metalised · 2 mm · 50 pcs/pack (sample)",
            image: "/images/cake-die-cut.webp",
            quantity: 500,
            unitCents: 68,
            totalCents: 34000,
          },
        },
      },
    });
  }
  for (let n = 1; n <= 3; n++)
    await db.quoteRequest.upsert({
      where: { id: `RFQ-SAMPLE-00${n}` },
      update: {},
      create: {
        id: `RFQ-SAMPLE-00${n}`,
        userId: buyer.id,
        family: categories[n + 1][1],
        application: "Packaging sample project",
        shape: n === 1 ? "L profile" : "Sheet",
        dimensions: "Custom sample dimensions",
        thickness: "To be discussed",
        finish: "Natural",
        quantity: 2000,
        country: "United States",
        company: "Studio Bakery · Sample Company",
        name: buyer.name,
        email: buyer.email,
        phone: "+1 555 010 2026",
        notes: "Seed sample enquiry. No email was sent.",
        status: ["NEW", "IN_REVIEW", "RESPONDED"][n - 1],
        response:
          n === 3
            ? "Demo response: specification discussion recorded. No commercial offer has been issued."
            : "",
      },
    });
  if (!(await db.wholesaleApplication.count()))
    await db.wholesaleApplication.createMany({
      data: [
        {
          userId: pending.id,
          company: "Paper & Co. · Sample Company",
          name: pending.name,
          email: pending.email,
          phone: "+1 555 010 2027",
          country: "Türkiye",
          businessType: "Distributor",
          monthlyVolume: "1000–5000 pcs",
          interests: "Cornerboards",
          notes: "Seed application",
          status: "PENDING",
        },
        {
          userId: buyer.id,
          company: "Studio Bakery · Sample Company",
          name: buyer.name,
          email: buyer.email,
          phone: "+1 555 010 2026",
          country: "United States",
          businessType: "Bakery",
          monthlyVolume: "1000–5000 pcs",
          interests: "Cake boards",
          notes: "Seed application",
          status: "APPROVED",
        },
      ],
    });
  console.log(
    "Ready: 21 product presentations, 3 demo accounts, 2 orders, 3 RFQs, 2 applications. Existing edits preserved.",
  );
}
main().finally(() => db.$disconnect());
