import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OrderResult, CartItem } from '../../types';

const STORAGE_KEY = 'veha_auth_v1';

export interface UserProfile {
  id?: string;
  role?: 'customer' | 'admin';
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderHistoryItem extends OrderResult {
  date: string;
  items: CartItem[];
  customer: UserProfile;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  orders: OrderHistoryItem[];
}

function load(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        user: parsed.user ?? null,
        token: parsed.token ?? null,
        isAuthenticated: !!parsed.token,
        orders: parsed.orders ?? [],
      };
    }
  } catch {}
  return { user: null, token: null, isAuthenticated: false, orders: [] };
}

const initialState: AuthState = load();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: UserProfile; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            user: state.user,
            token: state.token,
            orders: state.orders,
          })
        );
      } catch (e) {
        console.error('Failed to save auth state to localStorage', e);
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.orders = [];
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Failed to clear auth state from localStorage', e);
      }
    },
    addOrderToHistory(state, action: PayloadAction<OrderHistoryItem>) {
      state.orders.unshift(action.payload);
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            user: state.user,
            token: state.token,
            orders: state.orders,
          })
        );
      } catch (e) {
        console.error('Failed to save order to localStorage', e);
      }
    },
    clearHistory(state) {
      state.orders = [];
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            user: state.user,
            token: state.token,
            orders: state.orders,
          })
        );
      } catch (e) {
        console.error('Failed to clear order history in localStorage', e);
      }
    },
  },
});

export const { login, logout, addOrderToHistory, clearHistory } = authSlice.actions;
export default authSlice.reducer;

// Selectors
import type { RootState } from '../../app/store';
export const selectCurrentUser = (s: RootState) => s.auth.user;
export const selectIsAuthenticated = (s: RootState) => s.auth.isAuthenticated;
export const selectOrderHistory = (s: RootState) => s.auth.orders;
export { STORAGE_KEY };
