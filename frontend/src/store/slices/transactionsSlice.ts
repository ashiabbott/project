// src/store/slices/transactionsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, TransactionsResponse } from '../../types';
import apiClient from '../../api/apiClient';

// Async Thunks

export const fetchTransactions = createAsyncThunk<
  Transaction[],
  void,
  { rejectValue: string }
>('transactions/fetchTransactions', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<TransactionsResponse>('/transactions');
    return response.data.transactions;
  } catch (error: any) {
    return rejectWithValue(
      error.response.data.message || 'Failed to fetch transactions'
    );
  }
});

export const addTransaction = createAsyncThunk<
  Transaction,
  Omit<Transaction, 'id'>,
  { rejectValue: string }
>(
  'transactions/addTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Transaction>(
        '/transactions',
        transactionData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || 'Failed to add transaction'
      );
    }
  }
);

export const updateTransaction = createAsyncThunk<
  Transaction,
  Transaction,
  { rejectValue: string }
>(
  'transactions/updateTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<Transaction>(
        `/transactions/${transactionData.id}`,
        transactionData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || 'Failed to update transaction'
      );
    }
  }
);

// Slice

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Synchronous reducers if needed
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        tx => tx.id !== action.payload
      );
    },
  },
  extraReducers: builder => {
    // Fetch Transactions
    builder.addCase(fetchTransactions.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchTransactions.fulfilled,
      (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.transactions = action.payload;
      }
    );
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Unable to fetch transactions';
    });

    // Add Transaction
    builder.addCase(addTransaction.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addTransaction.fulfilled,
      (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        state.transactions.push(action.payload);
      }
    );
    builder.addCase(addTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Unable to add transaction';
    });

    // Update Transaction
    builder.addCase(updateTransaction.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateTransaction.fulfilled,
      (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        const index = state.transactions.findIndex(
          tx => tx.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      }
    );
    builder.addCase(updateTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Unable to update transaction';
    });
  },
});

export const { deleteTransaction } = transactionsSlice.actions;

export default transactionsSlice.reducer;
