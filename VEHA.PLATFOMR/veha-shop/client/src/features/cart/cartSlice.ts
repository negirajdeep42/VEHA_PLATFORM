import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types';

const STORAGE_KEY = 'veha_cart_v1';

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discountRate: number;
}
const initialState: CartState = {
  items: load(),
  promoCode: null,
  discountRate: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const found = state.items.find((i) => i.id === action.payload.id);
      if (found) found.qty += action.payload.qty;
      else state.items.push(action.payload);
    },
    setQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const it = state.items.find((i) => i.id === action.payload.id);
      if (it) it.qty = Math.max(1, action.payload.qty);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    applyPromoCode(state, action: PayloadAction<{ code: string; rate: number }>) {
      state.promoCode = action.payload.code;
      state.discountRate = action.payload.rate;
    },
    removePromoCode(state) {
      state.promoCode = null;
      state.discountRate = 0;
    },
    clearCart(state) {
      state.items = [];
      state.promoCode = null;
      state.discountRate = 0;
    },
  },
});

export const { addItem, setQty, removeItem, applyPromoCode, removePromoCode, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
import type { RootState } from '../../app/store';
export const selectCartItems = (s: RootState) => s.cart.items;
export const selectCartCount = (s: RootState) =>
  s.cart.items.reduce((n, i) => n + i.qty, 0);
export const selectSubtotal = (s: RootState) =>
  s.cart.items.reduce((n, i) => n + i.price * i.qty, 0);
export const selectPromoCode = (s: RootState) => s.cart.promoCode;
export const selectDiscountRate = (s: RootState) => s.cart.discountRate;
export { STORAGE_KEY };
