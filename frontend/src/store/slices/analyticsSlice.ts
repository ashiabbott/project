import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface AnalyticsState {
  spendingTrends: any[]; // Replace 'any' with a more specific type
  incomeVsExpenses: any[];
  categoryBreakdown: any[];
  financialHealth: { name: string; value: string; description: string }[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  spendingTrends: [],
  incomeVsExpenses: [],
  categoryBreakdown: [],
  financialHealth: [],
  loading: false,
  error: null,
};

export const fetchAnalyticsData = createAsyncThunk(
  'analytics/fetchData',
  async () => {
    // Replace this with your actual API call
    const response = await fetch('/api/analytics');
    const data = await response.json();
    return data;
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAnalyticsData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.loading = false;
        state.spendingTrends = action.payload.spendingTrends;
        state.incomeVsExpenses = action.payload.incomeVsExpenses;
        state.categoryBreakdown = action.payload.categoryBreakdown;
        state.financialHealth = action.payload.financialHealth;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch analytics data';
      });
  },
});

export default analyticsSlice.reducer;
