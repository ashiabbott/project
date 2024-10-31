import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import backupService from '../../services/backupService';

interface BackupState {
  loading: boolean;
  error: string | null;
}

const initialState: BackupState = {
  loading: false,
  error: null,
};

export const backupData = createAsyncThunk(
  'backup/backupData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await backupService.backup();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to backup data'
      );
    }
  }
);

export const restoreData = createAsyncThunk(
  'backup/restoreData',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await backupService.restore(formData);
      return 'Data restored successfully';
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to restore data'
      );
    }
  }
);

const backupSlice = createSlice({
  name: 'backup',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(backupData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(backupData.fulfilled, state => {
        state.loading = false;
      })
      .addCase(backupData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(restoreData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreData.fulfilled, state => {
        state.loading = false;
      })
      .addCase(restoreData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default backupSlice.reducer;
