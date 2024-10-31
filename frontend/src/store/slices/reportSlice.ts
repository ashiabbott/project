import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReportData, ReportParams } from '../../types/report';
import reportService from '../../services/reportService';

interface ReportState {
  report: ReportData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  report: null,
  loading: false,
  error: null,
};

export const generateReport = createAsyncThunk(
  'report/generateReport',
  async (params: ReportParams, { rejectWithValue }) => {
    try {
      const data = await reportService.generateReport(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(generateReport.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reportSlice.reducer;
