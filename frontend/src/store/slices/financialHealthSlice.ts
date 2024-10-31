import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface FinancialHealthState {
  score: number;
  factors: string[];
  loading: boolean;
  error: string | null;
}

const initialState: FinancialHealthState = {
  score: 0,
  factors: [],
  loading: false,
  error: null,
};

export const fetchFinancialHealth = createAsyncThunk(
  'financialHealth/fetch',
  async () => {
    const response = await api.get('/financial-health');
    return response.data;
  }
);

const financialHealthSlice = createSlice({
  name: 'financialHealth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFinancialHealth.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancialHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.score = action.payload.score;
        state.factors = action.payload.factors;
      })
      .addCase(fetchFinancialHealth.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch financial health data';
      });
  },
});

export default financialHealthSlice.reducer;
