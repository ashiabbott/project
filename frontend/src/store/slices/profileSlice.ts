import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { User, Preferences, Notifications } from '../../types/profile';

interface ProfileState {
  user: User | null;
  preferences: Preferences;
  notifications: Notifications;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  preferences: {
    theme: 'light',
    language: 'en',
  },
  notifications: {
    email: true,
    sms: false,
  },
  loading: false,
  error: null,
};

// Async actions
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile', profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'profile/updatePreferences',
  async (preferences: Preferences, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile/preferences', preferences);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update preferences'
      );
    }
  }
);

export const updateNotifications = createAsyncThunk(
  'profile/updateNotifications',
  async (notifications: Notifications, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile/notifications', notifications);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update notifications'
      );
    }
  }
);

// Reducer
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Synchronous actions if any
  },
  extraReducers: builder => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.preferences = action.payload.preferences;
        state.notifications = action.payload.notifications;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
      // Update Preferences
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })
      // Update Notifications
      .addCase(updateNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      });
  },
});

export default profileSlice.reducer;
