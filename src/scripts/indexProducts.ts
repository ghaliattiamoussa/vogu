/**
 * سكريبت فهرسة المنتجات في Algolia
 * تشغيل: npx tsx src/scripts/indexProducts.ts
 */

import { PrismaClient } from "@prisma/client";
import algoliasearch from "algoliasearch";
import * as dotenv from "dotenv";
import path from "path";

// ─── Load env variables ───────────────────────────────────────
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!
);

const INDEX_NAME = process.env.ALGOLIA_INDEX_NAME ?? "vogu_products";
const index      = client.initIndex(INDEX_NAME);

async function main() {
  console.log("🔍  Starting Algolia indexing...\n");

  // ─── 1. Configure index settings ──────────────────────────
  await index.setSettings({
    searchableAttributes: ["nameAr", "nameEn", "brand", "tags", "unordered(category)"],
    attributesForFaceting: ["filterOnly(isActive)", "filterOnly(category)", "price"],
    customRanking:         ["desc(isBest)", "desc(isNew)"],
    attributesToHighlight: ["nameAr", "nameEn", "brand"],
  });
  console.log("✅  Index settings configured");

  // ─── 2. Fetch all products from DB ────────────────────────
  const products = await prisma.product.findMany({
    include: {
      category: { select: { slug: true, nameAr: true } },
      images:   { where: { isPrimary: true }, take: 1 },
      variants: {
        select: { color: true, colorHex: true, size: true, stock: true },
      },
    },
  });

  console.log(`📦  Found ${products.length} products in database`);

  // ─── 3. Format for Algolia ────────────────────────────────
  const records = products.map((p) => ({
    objectID:  p.id,
    nameAr:    p.nameAr,
    nameEn:    p.nameEn,
    brand:     p.brand,
    price:     p.price,
    origPrice: p.origPrice,
    category:  p.category.slug,
    tags:      p.tags,
    isNew:     p.isNew,
    isBest:    p.isBest,
    isActive:  p.isActive,
    imageUrl:  p.images[0]?.url ?? null,
    colors:    [...new Set(p.variants.map((v) => v.color))],
    colorHexes:[...new Set(p.variants.map((v) => v.colorHex))],
    sizes:     [...new Set(p.variants.map((v) => v.size))],
    totalStock: p.variants.reduce((s, v) => s + v.stock, 0),
    slug:      p.slug,
  }));

  // ─── 4. Push to Algolia ───────────────────────────────────
  const { objectIDs } = await index.saveObjects(records);

  console.log(`✅  Indexed ${objectIDs.length} products successfully`);
  console.log(`🎉  Done! Index: "${INDEX_NAME}"\n`);

  // ─── 5. Summary ───────────────────────────────────────────
  const active   = records.filter((r) => r.isActive).length;
  const inactive = records.filter((r) => !r.isActive).length;
  console.log(`   Active:   ${active}`);
  console.log(`   Inactive: ${inactive}`);
}

main()
  .catch((e) => {
    console.error("❌  Indexing failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });