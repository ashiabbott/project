import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Insight {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface FinancialInsightsState {
  insights: Insight[];
  loading: boolean;
  error: string | null;
}

const initialState: FinancialInsightsState = {
  insights: [],
  loading: false,
  error: null,
};

export const fetchFinancialInsights = createAsyncThunk<
  Insight[],
  void,
  { rejectValue: string }
>(
  'financialInsights/fetchFinancialInsights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Insight[]>('/api/financial-insights');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch financial insights.'
      );
    }
  }
);

const financialInsightsSlice = createSlice({
  name: 'financialInsights',
  initialState,
  reducers: {
    fetchInsightsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchInsightsSuccess(state, action: PayloadAction<Insight[]>) {
      state.insights = action.payload;
      state.loading = false;
    },
    fetchInsightsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addInsight(state, action: PayloadAction<Insight>) {
      state.insights.push(action.payload);
    },
    updateInsight(state, action: PayloadAction<Insight>) {
      const index = state.insights.findIndex(
        insight => insight.id === action.payload.id
      );
      if (index !== -1) {
        state.insights[index] = action.payload;
      }
    },
    deleteInsight(state, action: PayloadAction<string>) {
      state.insights = state.insights.filter(
        insight => insight.id !== action.payload
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFinancialInsights.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancialInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload;
      })
      .addCase(fetchFinancialInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  fetchInsightsStart,
  fetchInsightsSuccess,
  fetchInsightsFailure,
  addInsight,
  updateInsight,
  deleteInsight,
} = financialInsightsSlice.actions;

export default financialInsightsSlice.reducer;
