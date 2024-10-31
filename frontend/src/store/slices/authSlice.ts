// src/store/slices/authSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User, ApiResponse } from '../../types';
import axiosInstance from '../../api/axiosConfig';
import { apiSlice } from './apiSlice';
import { addNotification } from './notificationSlice';

// Define the shape of the auth state
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk<
  ApiResponse<{ accessToken: string; refreshToken: string; user: User }>,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<
      ApiResponse<{ accessToken: string; refreshToken: string; user: User }>
    >('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

// Async thunk for registration
export const register = createAsyncThunk<
  ApiResponse<User>,
  { name: string; email: string; password: string },
  { rejectValue: string }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ApiResponse<User>>(
      '/auth/register',
      userData
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Registration failed'
    );
  }
});

// Async thunk for logout
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    clearCredentials: state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });

    builder
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });

    builder
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload || 'Logout failed';
      });

    // Auto update user state when getUser query is fulfilled
    builder.addMatcher(
      apiSlice.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
      }
    );
  },
});

// Export actions and reducer
export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager'; // Define roles as per your application
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Async actions for login, logout, etc.

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducers for handling authentication state
  },
  extraReducers: builder => {
    // Handle async actions
  },
});

export default authSlice.reducer;

// Existing imports...

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      await api.post('/auth/password-reset', { email });
      return 'Password reset link sent';
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || 'Failed to send password reset link'
      );
    }
  }
);
