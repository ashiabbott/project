// src/services/api.ts

import axios from 'axios';

// Configure base URL with environment support
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to each request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      error.response.data.message === 'Token expired'
    ) {
      originalRequest._retry = true;
      // Refresh token logic here
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/auth/refresh`,
          {
            refreshToken,
          }
        );
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] =
          `Bearer ${res.data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
