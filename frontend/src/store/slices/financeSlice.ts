// src/store/slices/financeSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface MonthlyFinanceData {
  month: string;
  income: number;
  expenses: number;
}

interface Transaction {
  id: string;
  source: string;
  target: string;
  value: number;
}

interface FinanceState {
  monthlyData: MonthlyFinanceData[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: FinanceState = {
  monthlyData: [],
  transactions: [],
  loading: false,
  error: null,
};

// Async thunk to fetch finance data
export const fetchFinanceData = createAsyncThunk(
  'finance/fetchFinanceData',
  async () => {
    const response = await api.get('/finance'); // Replace with actual API endpoint
    return response.data;
  }
);

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFinanceData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFinanceData.fulfilled,
        (state, action: PayloadAction<FinanceState>) => {
          state.loading = false;
          state.monthlyData = action.payload.monthlyData;
          state.transactions = action.payload.transactions;
        }
      )
      .addCase(fetchFinanceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch finance data';
      });
  },
});

export default financeSlice.reducer;
