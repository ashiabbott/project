import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Investment {
  id: string;
  name: string;
  type: 'stock' | 'bond' | 'crypto' | 'real estate' | 'other';
  amount: number;
  purchaseDate: Date;
  currentValue: number;
  performanceHistory: { date: Date; value: number }[];
}

interface InvestmentState {
  investments: Investment[];
  loading: boolean;
  error: string | null;
}

const initialState: InvestmentState = {
  investments: [],
  loading: false,
  error: null,
};

export const fetchInvestments = createAsyncThunk(
  'investments/fetchInvestments',
  async () => {
    // Replace this with your actual API call
    const response = await fetch('/api/investments');
    const data = await response.json();
    return data;
  }
);

export const addInvestment = createAsyncThunk(
  'investments/addInvestment',
  async (
    investment: Omit<Investment, 'id' | 'currentValue' | 'performanceHistory'>
  ) => {
    // Replace this with your actual API call
    const response = await fetch('/api/investments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(investment),
    });
    const data = await response.json();
    return data;
  }
);

export const updateInvestment = createAsyncThunk(
  'investments/updateInvestment',
  async (investment: Investment) => {
    // Replace this with your actual API call
    const response = await fetch(`/api/investments/${investment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(investment),
    });
    const data = await response.json();
    return data;
  }
);

export const deleteInvestment = createAsyncThunk(
  'investments/deleteInvestment',
  async (id: string) => {
    // Replace this with your actual API call
    await fetch(`/api/investments/${id}`, { method: 'DELETE' });
    return id;
  }
);

const investmentSlice = createSlice({
  name: 'investments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchInvestments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.loading = false;
        state.investments = action.payload;
      })
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch investments';
      })
      .addCase(addInvestment.fulfilled, (state, action) => {
        state.investments.push(action.payload);
      })
      .addCase(updateInvestment.fulfilled, (state, action) => {
        const index = state.investments.findIndex(
          i => i.id === action.payload.id
        );
        if (index !== -1) {
          state.investments[index] = action.payload;
        }
      })
      .addCase(deleteInvestment.fulfilled, (state, action) => {
        state.investments = state.investments.filter(
          i => i.id !== action.payload
        );
      });
  },
});

export default investmentSlice.reducer;
