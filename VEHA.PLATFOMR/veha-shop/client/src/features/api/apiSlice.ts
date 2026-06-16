import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, OrderResult } from '../../types';

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export interface ProductQuery {
  category?: string;
  metal?: string;
  sort?: string;
  search?: string;
}

export interface CreateOrderBody {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'upi' | 'card' | 'cod';
  promoCode?: string;
  items: { productId: string; variant?: string; qty: number }[];
}

// RTK Query: the typed "redux api" layer. Caching, loading + error states,
// and re-fetching are handled for us.
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Order', 'Promotion'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], ProductQuery | void>({
      query: (q) => {
        const params = new URLSearchParams();
        if (q?.category) params.set('category', q.category);
        if (q?.metal) params.set('metal', q.metal);
        if (q?.sort) params.set('sort', q.sort);
        if (q?.search) params.set('search', q.search);
        const qs = params.toString();
        return `/products${qs ? `?${qs}` : ''}`;
      },
      providesTags: ['Product'],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: ['Product'],
    }),
    createOrder: builder.mutation<OrderResult, CreateOrderBody>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Order', 'Product'],
    }),
    getOrders: builder.query<any[], void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
    createProduct: builder.mutation<Product, any>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    registerUser: builder.mutation<any, any>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    loginUser: builder.mutation<any, any>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    getAuthUser: builder.query<any, void>({
      query: () => '/auth/me',
    }),
    updateProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PUT',
        body,
      }),
    }),
    getUserOrders: builder.query<any[], void>({
      query: () => '/auth/orders',
      providesTags: ['Order'],
    }),
    getPromotions: builder.query<any[], void>({
      query: () => '/promotions',
      providesTags: ['Promotion'],
    }),
    createPromotion: builder.mutation<any, any>({
      query: (body) => ({
        url: '/promotions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Promotion'],
    }),
    updatePromotion: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/promotions/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Promotion'],
    }),
    deletePromotion: builder.mutation<any, string>({
      query: (id) => ({
        url: `/promotions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Promotion'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetAuthUserQuery,
  useUpdateProfileMutation,
  useGetUserOrdersQuery,
  useGetPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} = api;
