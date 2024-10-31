// src/store/slices/aiAdvisorSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiResponse, AdviceItem } from '../../types';
import api from '../../services/api';

// Async thunk to fetch AI-generated financial advice
export const fetchAIAdvice = createAsyncThunk<
  AdviceItem[],
  void,
  { rejectValue: string }
>('aiAdvisor/fetchAIAdvice', async (_, { rejectWithValue }) => {
  try {
    // Assume the endpoint returns an ApiResponse containing advice items
    const response = await api.get<ApiResponse<AdviceItem[]>>('/ai/advice');
    return response.data.data;
  } catch (error: any) {
    // Improved error handling for both client- and server-side errors
    const message =
      error.response?.data?.message || 'Failed to fetch AI advice';
    return rejectWithValue(message);
  }
});

// Define the slice's initial state
interface AIAdvisorState {
  advice: AdviceItem[];
  loading: boolean;
  error: string | null;
}

const initialState: AIAdvisorState = {
  advice: [],
  loading: false,
  error: null,
};

// Slice for AI Advisor
const aiAdvisorSlice = createSlice({
  name: 'aiAdvisor',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAIAdvice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAIAdvice.fulfilled,
        (state, action: PayloadAction<AdviceItem[]>) => {
          state.loading = false;
          state.advice = action.payload;
        }
      )
      .addCase(fetchAIAdvice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default aiAdvisorSlice.reducer;
