import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id:       number | string  // ← مهم
  nameAr:   string
  nameEn:   string
  brand:    string
  price:    number
  grad:     string 
  image?: string  // placeholder للصورة حتى نضيف Cloudinary
  size:     string
  color:    string
  colorHex: string
  quantity: number
  designData?: any[];
  productType?: string;
  baseColor?: string;
  isCustom?: boolean
  customDesignImage?: string
}

interface CartStore {
  items:    CartItem[]
  isOpen:   boolean
  addItem:        (item: CartItem) => void
  removeItem:     (id: number, size: string, color: string) => void
  updateQuantity: (id: number, size: string, color: string, qty: number) => void
  clearCart:  () => void
  openCart:   () => void
  closeCart:  () => void
  total:      () => number
  itemCount:  () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,

      addItem: (item) => set((state) => {
        const exists = state.items.find(
          (i) => i.id === item.id && i.size === item.size && i.color === item.color
        )
        if (exists) {
          return {
            isOpen: true,
            items: state.items.map((i) =>
              i.id === item.id && i.size === item.size && i.color === item.color
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          }
        }
        return { items: [...state.items, item], isOpen: true }
      }),

      removeItem: (id, size, color) => set((state) => ({
        items: state.items.filter(
          (i) => !(i.id === id && i.size === size && i.color === color)
        ),
      })),

      updateQuantity: (id, size, color, qty) => set((state) => {
        if (qty < 1) {
          return {
            items: state.items.filter(
              (i) => !(i.id === id && i.size === size && i.color === color)
            ),
          }
        }
        return {
          items: state.items.map((i) =>
            i.id === id && i.size === size && i.color === color
              ? { ...i, quantity: qty }
              : i
          ),
        }
      }),

      clearCart:  () => set({ items: [] }),
      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),
      total:      () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      itemCount:  () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'vogu-cart' }
  )
)