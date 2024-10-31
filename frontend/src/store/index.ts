// src/store/index.ts

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import transactionsReducer from './slices/transactionsSlice';
import budgetReducer from './slices/budgetSlice';
import goalsReducer from './slices/goalsSlice';
import investmentsReducer from './slices/investmentsSlice';
import authReducer from './slices/authSlice';
import aiAdvisorReducer from './slices/aiAdvisorSlice';
import notificationReducer from './slices/notificationSlice';
import categoriesReducer from './slices/categoriesSlice';
import financialInsightsReducer from './slices/financialInsightsSlice'; // Import financialInsightsReducer
import savingsChallengeReducer from './slices/savingsChallengeSlice'; // Import savingsChallengeReducer

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage (localStorage for web)
import logger from 'redux-logger';

// Root reducer combining all slices
const rootReducer = combineReducers({
  theme: themeReducer,
  transactions: transactionsReducer,
  budget: budgetReducer,
  goals: goalsReducer,
  investments: investmentsReducer,
  auth: authReducer,
  aiAdvisor: aiAdvisorReducer,
  notifications: notificationReducer,
  categories: categoriesReducer,
  financialInsights: financialInsightsReducer, // Include financialInsightsReducer
  savingsChallenge: savingsChallengeReducer, // Include savingsChallengeReducer
  // Add other reducers here...
});

// Persistence configuration for specific slices
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'], // Only persist auth and theme slices
};

// Applying persistence to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });

    // Add logger middleware in development mode
    if (process.env.NODE_ENV === 'development') {
      middlewares.push(logger);
    }

    return middlewares;
  },
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

// Persistor setup for redux-persist
export const persistor = persistStore(store);

// TypeScript types for the store's state and dispatch
export type RootState = ReturnType<typeof store.getState>; // The root state type
export type AppDispatch = typeof store.dispatch; // The dispatch type
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import searchReducer from './slices/searchSlice';
import reportReducer from './slices/reportSlice';
import exportReducer from './slices/exportSlice';
import backupReducer from './slices/backupSlice';
import notificationReducer from './slices/notificationSlice';
import analyticsReducer from './slices/analyticsSlice';
// Import other reducers as needed

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    search: searchReducer,
    report: reportReducer,
    export: exportReducer,
    backup: backupReducer,
    notification: notificationReducer,
    analytics: analyticsReducer,
    // Add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
