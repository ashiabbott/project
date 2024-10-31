import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface SettingsState {
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    twoFactorAuth: boolean;
    currency: string;
    language: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: {
    emailNotifications: true,
    pushNotifications: true,
    twoFactorAuth: false,
    currency: 'USD',
    language: 'en',
  },
  loading: false,
  error: null,
};

export const fetchUserSettings = createAsyncThunk(
  'settings/fetchUserSettings',
  async () => {
    // Replace this with your actual API call
    const response = await fetch('/api/user-settings');
    const data = await response.json();
    return data;
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (newSettings: SettingsState['settings']) => {
    // Replace this with your actual API call
    const response = await fetch('/api/user-settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSettings),
    });
    const data = await response.json();
    return data;
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserSettings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchUserSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user settings';
      })
      .addCase(updateSettings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update settings';
      });
  },
});

export default settingsSlice.reducer;
