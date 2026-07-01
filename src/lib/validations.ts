import { z } from 'zod'

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
      .max(50, 'الاسم طويل جداً'),
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    password: z
      .string()
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      .regex(/[A-Z]/, 'يجب أن تحتوي على حرف إنجليزي كبير واحد على الأقل')
      .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      .regex(/[A-Z]/, 'يجب أن تحتوي على حرف إنجليزي كبير')
      .regex(/[0-9]/, 'يجب أن تحتوي على رقم'),
    confirmPassword: z.string(),
    token: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  })

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE & ADDRESS
// ─────────────────────────────────────────────────────────────────────────────

export const profileSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب').max(50),
  phone: z
    .string()
    .regex(/^[+]?[0-9]{9,15}$/, 'رقم الهاتف غير صحيح')
    .optional()
    .or(z.literal('')),
  avatar: z.string().url('رابط الصورة غير صحيح').optional().or(z.literal('')),
})

export const addressSchema = z.object({
  fullName:   z.string().min(2, 'الاسم الكامل مطلوب'),
  phone:      z.string().regex(/^[+]?[0-9]{9,15}$/, 'رقم الهاتف غير صحيح'),
  street:     z.string().min(5, 'العنوان التفصيلي مطلوب'),
  city:       z.string().min(2, 'المدينة مطلوبة'),
  state:      z.string().optional().or(z.literal('')),
  postalCode: z.string().min(3, 'الرمز البريدي مطلوب'),
  country:    z.string().min(2, 'الدولة مطلوبة').default('SA'),
  isDefault:  z.boolean().default(false),
})

// ─────────────────────────────────────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────────────────────────────────────

export const addToCartSchema = z.object({
  productId: z.string().cuid('معرّف المنتج غير صحيح'),
  quantity:  z.number().int().positive('الكمية يجب أن تكون أكبر من صفر').max(99),
  size:      z.string().optional(),
  color:     z.string().optional(),
})

export const updateCartItemSchema = z.object({
  cartItemId: z.string().cuid(),
  quantity:   z.number().int().min(0).max(99), // 0 = remove item
})

export const removeCartItemSchema = z.object({
  cartItemId: z.string().cuid(),
})

// ─────────────────────────────────────────────────────────────────────────────
// CHECKOUT
// ─────────────────────────────────────────────────────────────────────────────

export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  shippingMethod:  z.enum(['standard', 'express', 'overnight'], {
    errorMap: () => ({ message: 'اختر طريقة شحن صحيحة' }),
  }),
  couponCode:   z.string().max(20).optional().or(z.literal('')),
  saveAddress:  z.boolean().default(false),
  paymentIntentId: z.string().optional(),
})

export const applyCouponSchema = z.object({
  code:       z.string().min(1, 'أدخل كود الخصم').toUpperCase(),
  orderTotal: z.number().positive(),
})

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW
// ─────────────────────────────────────────────────────────────────────────────

export const reviewSchema = z.object({
  productId: z.string().cuid('معرّف المنتج غير صحيح'),
  rating:    z.number().int().min(1, 'الحد الأدنى نجمة واحدة').max(5, 'الحد الأقصى 5 نجوم'),
  title:     z.string().min(3, 'العنوان مطلوب').max(100, 'العنوان طويل جداً'),
  body:      z.string().min(10, 'اكتب تقييماً أكثر تفصيلاً').max(1000, 'التقييم طويل جداً'),
})

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT  (Admin)
// ─────────────────────────────────────────────────────────────────────────────

export const productSchema = z
  .object({
    name:        z.string().min(2, 'اسم المنتج مطلوب').max(200),
    description: z.string().min(10, 'الوصف مطلوب').max(5000),
    price:       z.number().positive('السعر يجب أن يكون أكبر من صفر'),
    salePrice:   z.number().positive().optional().nullable(),
    stock:       z.number().int().min(0, 'المخزون لا يمكن أن يكون سالباً'),
    sku:         z.string().min(2, 'رمز SKU مطلوب').max(50),
    categoryId:  z.string().cuid('التصنيف مطلوب'),
    brandId:     z.string().cuid().optional().nullable(),
    sizes:       z.array(z.string()).min(1, 'اختر مقاساً على الأقل'),
    colors:      z.array(z.string()).default([]),
    images:      z.array(z.string().url('رابط صورة غير صحيح')).min(1, 'أضف صورة على الأقل'),
    tags:        z.array(z.string()).default([]),
    isFeatured:  z.boolean().default(false),
    isNew:       z.boolean().default(true),
    isPublished: z.boolean().default(false),
  })
  .refine(
    (data) => !data.salePrice || data.salePrice < data.price,
    {
      message: 'سعر الخصم يجب أن يكون أقل من السعر الأصلي',
      path: ['salePrice'],
    },
  )

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY  (Admin)
// ─────────────────────────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name:        z.string().min(2, 'اسم التصنيف مطلوب').max(50),
  slug:        z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'الـ slug يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط'),
  description: z.string().max(500).optional().or(z.literal('')),
  image:       z.string().url().optional().or(z.literal('')),
  parentId:    z.string().cuid().optional().nullable(),
})

// ─────────────────────────────────────────────────────────────────────────────
// COUPON  (Admin)
// ─────────────────────────────────────────────────────────────────────────────

export const couponSchema = z
  .object({
    code:           z
      .string()
      .min(3, 'الكود يجب أن يكون 3 أحرف على الأقل')
      .max(20)
      .regex(/^[A-Z0-9_-]+$/, 'الكود يجب أن يحتوي على أحرف كبيرة وأرقام فقط'),
    type:           z.enum(['PERCENTAGE', 'FIXED']),
    discount:       z.number().positive('قيمة الخصم يجب أن تكون أكبر من صفر'),
    expiresAt:      z.coerce.date().optional().nullable(),
    usageLimit:     z.number().int().positive().optional().nullable(),
    minOrderAmount: z.number().positive().optional().nullable(),
  })
  .refine(
    (data) => data.type !== 'PERCENTAGE' || data.discount <= 100,
    { message: 'نسبة الخصم يجب أن تكون بين 1 و 100', path: ['discount'] },
  )

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH / FILTER
// ─────────────────────────────────────────────────────────────────────────────

export const searchSchema = z
  .object({
    q:        z.string().max(200).optional(),
    category: z.string().optional(),
    brand:    z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    size:     z.string().optional(),
    color:    z.string().optional(),
    sort:     z
      .enum(['newest', 'price-asc', 'price-desc', 'popular', 'sale'])
      .default('newest'),
    page:  z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(48).default(12),
  })
  .refine(
    (data) =>
      !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice,
    {
      message: 'الحد الأدنى للسعر يجب أن يكون أقل من الحد الأقصى',
      path: ['minPrice'],
    },
  )

// ─────────────────────────────────────────────────────────────────────────────
// WISHLIST
// ─────────────────────────────────────────────────────────────────────────────

export const wishlistSchema = z.object({
  productId: z.string().cuid('معرّف المنتج غير صحيح'),
})

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name:    z.string().min(2, 'الاسم مطلوب'),
  email:   z.string().email('البريد الإلكتروني غير صحيح'),
  subject: z.string().min(5, 'الموضوع مطلوب').max(200),
  message: z.string().min(20, 'اكتب رسالتك بتفصيل أكثر').max(2000),
})

// ─────────────────────────────────────────────────────────────────────────────
// INFERRED TYPESCRIPT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type LoginInput           = z.infer<typeof loginSchema>
export type RegisterInput        = z.infer<typeof registerSchema>
export type ForgotPasswordInput  = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput   = z.infer<typeof resetPasswordSchema>
export type ProfileInput         = z.infer<typeof profileSchema>
export type AddressInput         = z.infer<typeof addressSchema>
export type AddToCartInput       = z.infer<typeof addToCartSchema>
export type UpdateCartItemInput  = z.infer<typeof updateCartItemSchema>
export type RemoveCartItemInput  = z.infer<typeof removeCartItemSchema>
export type CheckoutInput        = z.infer<typeof checkoutSchema>
export type ApplyCouponInput     = z.infer<typeof applyCouponSchema>
export type ReviewInput          = z.infer<typeof reviewSchema>
export type ProductInput         = z.infer<typeof productSchema>
export type CategoryInput        = z.infer<typeof categorySchema>
export type CouponInput          = z.infer<typeof couponSchema>
export type SearchInput          = z.infer<typeof searchSchema>
export type WishlistInput        = z.infer<typeof wishlistSchema>
export type ContactInput         = z.infer<typeof contactSchema>
