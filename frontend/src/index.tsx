// src/index.tsx

import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoadingSpinner from './components/Loading/LoadingSpinner'; // A loading component
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'; // Custom Error Boundary Component
import ThemeProvider from './components/contexts/ThemeContext'; // Custom Theme Provider
import './index.css'; // Global Styles

// Lazy load the App component for code splitting
const App = lazy(() => import('./App'));

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <ThemeProvider>
          <Router>
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <App />
              </Suspense>
            </ErrorBoundary>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// Service Worker Registration is handled by vite-plugin-pwa
// Additional custom Service Worker logic can be added here if necessary
