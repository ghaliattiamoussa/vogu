import algoliasearch from "algoliasearch";

// ─── Clients ──────────────────────────────────────────────────
// Admin client (server-side only — لا تستخدمه في المتصفح)
const adminClient = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!
);

// Search client (آمن للاستخدام في المتصفح)
export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

// ─── Index name ───────────────────────────────────────────────
export const INDEX_NAME =
  process.env.ALGOLIA_INDEX_NAME ?? "vogu_products";

// ─── Admin index (server-side) ────────────────────────────────
export const productIndex = adminClient.initIndex(INDEX_NAME);

// ─── Types ────────────────────────────────────────────────────
export interface AlgoliaProduct {
  objectID:   string;   // = product.id
  nameAr:     string;
  nameEn:     string;
  brand:      string;
  price:      number;
  origPrice:  number | null;
  category:   string;   // slug
  tags:       string[];
  isNew:      boolean;
  isBest:     boolean;
  isActive:   boolean;
  imageUrl:   string | null;
  colors:     string[];
  sizes:      string[];
  slug:       string;
}

// ─── Index a single product ───────────────────────────────────
export async function indexProduct(product: AlgoliaProduct) {
  try {
    await productIndex.saveObject(product);
  } catch (err) {
    console.error("[Algolia] indexProduct failed:", err);
  }
}

// ─── Index multiple products ──────────────────────────────────
export async function indexProducts(products: AlgoliaProduct[]) {
  try {
    await productIndex.saveObjects(products);
    console.log(`[Algolia] Indexed ${products.length} products`);
  } catch (err) {
    console.error("[Algolia] indexProducts failed:", err);
  }
}

// ─── Delete a product from index ─────────────────────────────
export async function deleteProduct(objectID: string) {
  try {
    await productIndex.deleteObject(objectID);
  } catch (err) {
    console.error("[Algolia] deleteProduct failed:", err);
  }
}

// ─── Search products (server-side) ───────────────────────────
export async function searchProducts(
  query: string,
  options?: {
    category?: string;
    page?: number;
    hitsPerPage?: number;
  }
) {
  try {
    const filters = [
      "isActive:true",
      options?.category ? `category:${options.category}` : null,
    ]
      .filter(Boolean)
      .join(" AND ");

    const results = await productIndex.search<AlgoliaProduct>(query, {
      filters,
      page:        (options?.page ?? 1) - 1, // Algolia is 0-indexed
      hitsPerPage: options?.hitsPerPage ?? 12,
      attributesToRetrieve: [
        "objectID", "nameAr", "nameEn", "brand",
        "price", "origPrice", "imageUrl", "slug",
        "colors", "sizes", "category",
      ],
    });

    return {
      hits:       results.hits,
      total:      results.nbHits,
      totalPages: results.nbPages,
      page:       results.page + 1,
    };
  } catch (err) {
    console.error("[Algolia] searchProducts failed:", err);
    return { hits: [], total: 0, totalPages: 0, page: 1 };
  }
}

// ─── Configure index settings (run once) ─────────────────────
export async function configureIndex() {
  try {
    await productIndex.setSettings({
      searchableAttributes: [
        "nameAr",
        "nameEn",
        "brand",
        "tags",
        "category",
      ],
      attributesForFaceting: [
        "filterOnly(isActive)",
        "filterOnly(category)",
        "price",
      ],
      customRanking: ["desc(isBest)", "desc(isNew)"],
      attributesToHighlight: ["nameAr", "nameEn", "brand"],
    });
    console.log("[Algolia] Index configured successfully");
  } catch (err) {
    console.error("[Algolia] configureIndex failed:", err);
  }
}