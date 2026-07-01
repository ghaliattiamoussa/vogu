import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  ids:        string[]
  toggle:     (id: string) => void
  isInList:   (id: string) => boolean
  count:      () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        // ١) تحديث فوري في الواجهة (القلب يتلوّن لحظياً)
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((i) => i !== id) : [...s.ids, id],
        }));

        // ٢) مزامنة مع قاعدة البيانات في الخلفية — نفس الـ endpoint
        // المستخدم في صفحة /wishlist (POST بيعمل toggle لوحده على السيرفر)
        fetch('/api/wishlist', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ productId: id }),
        }).catch(() => {
          // لو المستخدم مش مسجّل دخول أو فيه مشكلة شبكة مؤقتة، نسيب
          // التحديث المحلي زي ما هو من غير ما نكسر تجربة المستخدم
        });
      },
      isInList: (id) => get().ids.includes(id),
      count:    () => get().ids.length,
    }),
    { name: 'vogu-wishlist' }
  )
)