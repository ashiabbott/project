import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ExportFormat } from '../../types/export';
import exportService from '../../services/exportService';

interface ExportState {
  exporting: boolean;
  error: string | null;
}

const initialState: ExportState = {
  exporting: false,
  error: null,
};

export const exportData = createAsyncThunk(
  'export/exportData',
  async (format: ExportFormat, { rejectWithValue }) => {
    try {
      const response = await exportService.exportData(format);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const exportSlice = createSlice({
  name: 'export',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(exportData.pending, state => {
        state.exporting = true;
        state.error = null;
      })
      .addCase(exportData.fulfilled, state => {
        state.exporting = false;
      })
      .addCase(exportData.rejected, (state, action) => {
        state.exporting = false;
        state.error = action.payload as string;
      });
  },
});

export default exportSlice.reducer;
