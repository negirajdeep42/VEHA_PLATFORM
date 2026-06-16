import { configureStore } from '@reduxjs/toolkit';
import { api } from '../features/api/apiSlice';
import cartReducer, { STORAGE_KEY as CART_KEY } from '../features/cart/cartSlice';
import wishlistReducer, { STORAGE_KEY as WISHLIST_KEY } from '../features/wishlist/wishlistSlice';
import authReducer, { STORAGE_KEY as AUTH_KEY } from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

// Persist the cart, wishlist, and auth to localStorage whenever they change.
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem(CART_KEY, JSON.stringify(state.cart.items));
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.wishlist.items));
    localStorage.setItem(AUTH_KEY, JSON.stringify(state.auth));
  } catch {
    /* storage unavailable (e.g. private mode) -> ignore */
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
