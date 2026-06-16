import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types';

const STORAGE_KEY = 'veha_wishlist_v1';

function load(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: load(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<Product>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    removeWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { toggleWishlist, removeWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

// Selectors
import type { RootState } from '../../app/store';
export const selectWishlistItems = (s: RootState) => s.wishlist.items;
export const selectIsWishlisted = (id: string) => (s: RootState) =>
  s.wishlist.items.some((i) => i.id === id);
export { STORAGE_KEY };
