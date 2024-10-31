import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Import your reducers
import rootReducer from '../../store';

export function renderWithProviders(
  ui: ReactNode,
  {
    preloadedState = {},
    store = configureStore({ reducer: rootReducer, preloadedState }),
  } = {}
) {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
}

// Mocks for API calls can be added here using jest.mock
