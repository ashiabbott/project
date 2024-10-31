import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ReportsState {
  incomeVsExpenses: any[]; // Replace 'any' with a more specific type
  categoryBreakdown: any[];
  monthlyTrends: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  incomeVsExpenses: [],
  categoryBreakdown: [],
  monthlyTrends: [],
  loading: false,
  error: null,
};

export const fetchReportData = createAsyncThunk(
  'reports/fetchReportData',
  async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
    // Replace this with your actual API call
    const response = await fetch(
      `/api/reports?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
    const data = await response.json();
    return data;
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchReportData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportData.fulfilled, (state, action) => {
        state.loading = false;
        state.incomeVsExpenses = action.payload.incomeVsExpenses;
        state.categoryBreakdown = action.payload.categoryBreakdown;
        state.monthlyTrends = action.payload.monthlyTrends;
      })
      .addCase(fetchReportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch report data';
      });
  },
});

export default reportsSlice.reducer;
