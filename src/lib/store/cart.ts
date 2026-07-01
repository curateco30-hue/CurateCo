import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  productId: string;
  storeProductId: string;
  name: string;
  image: string | null;
  price: number;
  size: string;
  color: string;
  quantity: number;
  curatorCommissionPct: number;
}

interface CartState {
  storeSlug: string | null;
  items: CartItem[];
  isOpen: boolean;
  addItem: (storeSlug: string, item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      storeSlug: null,
      items: [],
      isOpen: false,
      addItem: (storeSlug, item) => {
        const current = get();
        if (current.storeSlug && current.storeSlug !== storeSlug) {
          set({ storeSlug, items: [item], isOpen: true });
          return;
        }
        const existingIndex = current.items.findIndex(
          (i) => i.productId === item.productId && i.size === item.size && i.color === item.color,
        );
        if (existingIndex >= 0) {
          const items = [...current.items];
          items[existingIndex] = {
            ...items[existingIndex],
            quantity: items[existingIndex].quantity + item.quantity,
          };
          set({ storeSlug, items, isOpen: true });
        } else {
          set({ storeSlug, items: [...current.items, item], isOpen: true });
        }
      },
      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color),
          ),
        })),
      updateQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity: Math.max(1, quantity) }
              : i,
          ),
        })),
      clear: () => set({ items: [], storeSlug: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    { name: "curateco-cart" },
  ),
);

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export type { CartItem };
