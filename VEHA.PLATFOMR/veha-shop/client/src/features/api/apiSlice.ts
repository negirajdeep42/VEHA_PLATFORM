import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, OrderResult } from '../../types';

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export interface ProductQuery {
  category?: string;
  metal?: string;
  sort?: string;
}

export interface CreateOrderBody {
  customer: {
    name: string; email: string; phone: string;
    address: string; city: string; state: string; pincode: string;
  };
  paymentMethod: 'upi' | 'card' | 'cod';
  promoCode?: string;
  items: { productId: string; variant?: string; qty: number }[];
}

// RTK Query: the typed "redux api" layer. Caching, loading + error states,
// and re-fetching are handled for us.
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], ProductQuery | void>({
      query: (q) => {
        const params = new URLSearchParams();
        if (q?.category) params.set('category', q.category);
        if (q?.metal) params.set('metal', q.metal);
        if (q?.sort) params.set('sort', q.sort);
        const qs = params.toString();
        return `/products${qs ? `?${qs}` : ''}`;
      },
      providesTags: ['Product'],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
    }),
    createOrder: builder.mutation<OrderResult, CreateOrderBody>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery, useCreateOrderMutation } = api;
