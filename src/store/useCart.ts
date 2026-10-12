import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

export interface CartItem {
  product: Product;
  variant?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, variant?: string, showToast?: (msg: string) => void) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string, showToast?: (msg: string) => void) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product, variant, showToast) => {
        set((state) => {
          const variantKey = variant || 'GENERAL';
          const stockMap = (product.variantStock as Record<string, number>) || { GENERAL: 5 };
          const maxStock = stockMap[variantKey] ?? 5;

          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.variant === variant
          );

          if (existingIndex > -1) {
            const currentQtyInCart = state.items[existingIndex].quantity;
            if (currentQtyInCart >= maxStock) {
              if (showToast) showToast(`⚠️ Solo hay ${maxStock} unidades disponibles en stock.`);
              return state;
            }

            const newItems = [...state.items];
            newItems[existingIndex].quantity += 1;
            return { items: newItems };
          }

          if (maxStock <= 0) {
            if (showToast) showToast(`❌ Producto agotado.`);
            return state;
          }

          return { items: [...state.items, { product, variant, quantity: 1 }] };
        });
      },

      removeFromCart: (productId, variant) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.variant === variant)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variant, showToast) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId && item.variant === variant) {
              const variantKey = variant || 'GENERAL';
              const stockMap = (item.product.variantStock as Record<string, number>) || { GENERAL: 5 };
              const maxStock = stockMap[variantKey] ?? 5;

              if (quantity > maxStock) {
                if (showToast) showToast(`⚠️ Stock máximo alcanzado (${maxStock} disp.)`);
                return { ...item, quantity: maxStock };
              }
              return { ...item, quantity: Math.max(1, quantity) };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },
    }),
    {
      name: 'nox-cart-storage',
    }
  )
);