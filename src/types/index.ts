// ============================================================
// VOGU Store — Central TypeScript Types
// ============================================================

export type Role = "USER" | "ADMIN";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type CouponType = "PERCENTAGE" | "FIXED";

// ── User ─────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  image: string | null;
  createdAt: Date;
}

// ── Product ───────────────────────────────────────────────────
export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
}

export interface ProductVariant {
  id: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  stock: number;
  price: number | null;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  image: string | null;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string | null;
  descriptionAr: string | null;
  price: number;
  originalPrice: number | null;
  category: Category;
  categoryId: string;
  brand: string;
  stock: number;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews?: Review[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  badge: string | null;
  gradient: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── Cart ─────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  product: Product;
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

export interface LocalCartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

// ── Wishlist ──────────────────────────────────────────────────
export interface WishlistItem {
  id: string;
  product: Product;
  productId: string;
}

// ── Order ─────────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  product: Product;
  productId: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  user: User;
  userId: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shippingCost: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentIntentId: string | null;
  couponCode: string | null;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ── Review ────────────────────────────────────────────────────
export interface Review {
  id: string;
  user: User;
  userId: string;
  productId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: Date;
}

// ── Coupon ────────────────────────────────────────────────────
export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: CouponType;
  minAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: Date | null;
}

// ── Admin Stats ───────────────────────────────────────────────
export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  revenueByDay: { date: string; revenue: number }[];
  topProducts: { product: Product; sales: number }[];
  ordersByStatus: { status: OrderStatus; count: number }[];
}

// ── Filters ───────────────────────────────────────────────────
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock?: boolean;
  search?: string;
  sort?: "featured" | "price_asc" | "price_desc" | "rating" | "newest";
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// NextAuth type extensions
declare module "next-auth" {
  interface User { role: Role; }
  interface Session {
    user: {
      id: string;
      role: Role;
      email: string;
      name: string | null;
      image: string | null;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT { role: Role; id: string; }
}