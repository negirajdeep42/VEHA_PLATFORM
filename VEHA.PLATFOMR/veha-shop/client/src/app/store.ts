import { configureStore } from '@reduxjs/toolkit';
import { api } from '../features/api/apiSlice';
import cartReducer, { STORAGE_KEY } from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

// Persist the cart to localStorage whenever it changes.
store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().cart.items));
  } catch {
    /* storage unavailable (e.g. private mode) -> ignore */
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
