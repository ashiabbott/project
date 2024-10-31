// src/api/axiosConfig.ts

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { store } from '../store';
import {
  logout,
  refreshToken as refreshTokenAction,
} from '../store/slices/authSlice';
import { addNotification } from '../store/slices/notificationSlice';

// Create an Axios instance with default configurations
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Flag to prevent multiple token refreshes
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: AxiosResponse<any>) => void;
  reject: (error: any) => void;
}> = [];

// Function to process the failed request queue
const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as any);
    }
  });
  failedQueue = [];
};

// Request interceptor to attach the auth token
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor for global error handling and token refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    // Handle network errors
    if (!error.response) {
      store.dispatch(
        addNotification({
          message: 'Network error. Please check your connection.',
          type: 'error',
        })
      );
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err: any) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      try {
        const response = await axiosInstance.post('/auth/refresh-token', {
          token: refreshToken,
        });
        const newToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        localStorage.setItem('authToken', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        return axiosInstance(originalRequest);
      } catch (err: any) {
        processQueue(err, null);
        store.dispatch(logout());
        store.dispatch(
          addNotification({
            message: 'Session expired. Please log in again.',
            type: 'error',
          })
        );
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error responses
    const statusMessageMap: { [key: number]: string } = {
      403: 'You do not have permission to perform this action.',
      404: 'Resource not found.',
    };

    const message =
      statusMessageMap[error.response.status] ||
      'An unexpected error occurred.';
    store.dispatch(addNotification({ message, type: 'error' }));

    return Promise.reject(error);
  }
);

// Retry logic for transient errors (e.g., 502 Bad Gateway, 503 Service Unavailable)
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // in milliseconds

axiosInstance.interceptors.response.use(null, async (error: AxiosError) => {
  const originalRequest = error.config as AxiosRequestConfig & {
    _retryCount?: number;
  };

  if (
    [502, 503, 504].includes(error.response?.status || 0) &&
    originalRequest
  ) {
    originalRequest._retryCount = originalRequest._retryCount ?? 0;

    if (originalRequest._retryCount < MAX_RETRIES) {
      originalRequest._retryCount += 1;
      await new Promise(res =>
        setTimeout(res, RETRY_DELAY * originalRequest._retryCount)
      );
      return axiosInstance(originalRequest);
    }
  }

  return Promise.reject(error);
});

export default axiosInstance;
