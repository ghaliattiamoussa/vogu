import Redis from "ioredis";

// ─── Client singleton ─────────────────────────────────────────
// نستخدم singleton لتجنب فتح اتصالات كثيرة في Next.js Dev Mode
const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect:          true,
    connectTimeout:       5000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

// ─── TTL Constants (بالثواني) ─────────────────────────────────
export const TTL = {
  PRODUCTS:       60 * 5,    // 5 دقائق
  PRODUCT_DETAIL: 60 * 10,   // 10 دقائق
  CATEGORIES:     60 * 60,   // ساعة
  CART:           60 * 30,   // 30 دقيقة
  USER_SESSION:   60 * 60,   // ساعة
} as const;

// ─── Helper: Get or Set ───────────────────────────────────────
// يجلب من الكاش، وإن لم يجد يُنفّذ الـ fetcher ويحفظ النتيجة
export async function getOrSet<T>(
  key:     string,
  fetcher: () => Promise<T>,
  ttl:     number = TTL.PRODUCTS
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    const fresh = await fetcher();
    await redis.setex(key, ttl, JSON.stringify(fresh));
    return fresh;
  } catch (err) {
    // إذا فشل Redis — نرجع البيانات مباشرة بدون كاش
    console.warn("[Redis] getOrSet failed, falling back:", err);
    return fetcher();
  }
}

// ─── Helper: Invalidate cache ─────────────────────────────────
export async function invalidate(...keys: string[]) {
  try {
    if (keys.length > 0) await redis.del(...keys);
  } catch (err) {
    console.warn("[Redis] invalidate failed:", err);
  }
}

// ─── Helper: Invalidate by pattern ───────────────────────────
// مثال: invalidatePattern("products:*") يحذف كل مفاتيح المنتجات
export async function invalidatePattern(pattern: string) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch (err) {
    console.warn("[Redis] invalidatePattern failed:", err);
  }
}

// ─── Cache Keys ───────────────────────────────────────────────
// مركزية لأسماء المفاتيح — تجنب الأخطاء الإملائية
export const CacheKey = {
  products:      (cat?: string, sort?: string, page?: number) =>
    `products:${cat ?? "all"}:${sort ?? "featured"}:${page ?? 1}`,

  product:       (id: string) => `product:${id}`,

  categories:    () => "categories:all",

  cart:          (userId: string) => `cart:${userId}`,

  userSession:   (userId: string) => `session:${userId}`,
} as const;