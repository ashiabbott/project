// src/store/slices/notificationSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../store';

// Define the shape of a Notification
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  read: boolean;
}

// Define the state for notifications
interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

// Async thunk to fetch notifications from the API
export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>('notifications/fetchNotifications', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/notifications');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: Notification[] = await response.json();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch notifications');
  }
});

// Async thunk to mark a notification as read
export const markAsRead = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>('notifications/markAsRead', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
    const data = await response.json();
    return { id: data.id };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to mark as read');
  }
});

// Async thunk to delete a notification
export const deleteNotification = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('notifications/deleteNotification', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/notifications/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete notification');
  }
});

// Create the notification slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Synchronous action to add a notification manually
    addNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
      }>
    ) => {
      const newNotification: Notification = {
        id: uuidv4(),
        message: action.payload.message,
        type: action.payload.type,
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(newNotification);
    },
    // Synchronous action to remove a notification by ID
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
  },
  extraReducers: builder => {
    // Handle fetchNotifications
    builder
      .addCase(fetchNotifications.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch notifications';
      });

    // Handle markAsRead
    builder
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          n => n.id === action.payload.id
        );
        if (notification) {
          notification.read = true;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload || 'Failed to mark notification as read';
      });

    // Handle deleteNotification
    builder
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          n => n.id !== action.payload
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete notification';
      });
  },
});

// Export actions and reducer
export const { addNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;

// Selector to get notifications
export const selectNotifications = (state: RootState) =>
  state.notifications.notifications;
export const selectNotificationsLoading = (state: RootState) =>
  state.notifications.loading;
export const selectNotificationsError = (state: RootState) =>
  state.notifications.error;
