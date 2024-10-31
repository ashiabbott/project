// src/store/slices/apiSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import {
  User,
  Transaction,
  Category,
  Budget,
  Goal,
  Investment,
  Notification,
  Insight,
  AdviceItem,
} from '../../types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL, // Use Vite’s environment variables
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'User',
    'Transactions',
    'Categories',
    'Budgets',
    'Goals',
    'Investments',
    'Notifications',
    'Insights',
    'Advice',
  ],
  endpoints: builder => ({
    // User Endpoints
    getUser: builder.query<User, void>({
      query: () => '/auth/user',
      providesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    // Transactions Endpoints
    getTransactions: builder.query<Transaction[], void>({
      query: () => '/transactions',
      providesTags: result =>
        result
          ? result.map(({ id }) => ({ type: 'Transactions', id }))
          : [{ type: 'Transactions', id: 'LIST' }],
    }),
    addTransaction: builder.mutation<Transaction, Partial<Transaction>>({
      query: body => ({
        url: '/transactions',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Transactions', id: 'LIST' }],
    }),
    updateTransaction: builder.mutation<
      Transaction,
      Partial<Transaction> & Pick<Transaction, 'id'>
    >({
      query: ({ id, ...patch }) => ({
        url: `/transactions/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transactions', id },
      ],
    }),
    deleteTransaction: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query: id => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Transactions', id }],
    }),

    // Categories Endpoints
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: result =>
        result
          ? result.map(({ id }) => ({ type: 'Categories', id }))
          : [{ type: 'Categories', id: 'LIST' }],
    }),
    addCategory: builder.mutation<Category, Partial<Category>>({
      query: body => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),

    // Goal Endpoints
    getGoal: builder.query<Goal, string>({
      query: id => `/goals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Goals', id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetUserQuery,
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useGetGoalQuery,
} = apiSlice;
