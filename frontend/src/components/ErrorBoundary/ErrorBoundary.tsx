// src/components/ErrorBoundary/ErrorBoundary.tsx

import React, { ErrorInfo, ReactNode } from 'react';
import { connect } from 'react-redux';
import { addNotification } from '../../store/slices/notificationSlice';
import { AppDispatch } from '../../store';

interface ErrorBoundaryProps {
  children: ReactNode;
  addNotification: (payload: {
    message: string;
    type: 'error' | 'info' | 'success' | 'warning';
  }) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state to display fallback UI on the next render
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error details for debugging
    console.error('Uncaught error:', error, errorInfo);

    // Dispatch a notification to inform the user
    this.props.addNotification({
      message: 'An unexpected error occurred. Please try refreshing the page.',
      type: 'error',
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error is caught
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <h1 className="text-4xl font-bold mb-4">Something went wrong.</h1>
          <p className="mb-6">
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    // Render children components if no error is caught
    return this.props.children;
  }
}

// Map dispatch to props to provide the addNotification function
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addNotification: (payload: {
    message: string;
    type: 'error' | 'info' | 'success' | 'warning';
  }) => dispatch(addNotification(payload)),
});

// Connect the component to Redux
export default connect(null, mapDispatchToProps)(ErrorBoundary);
