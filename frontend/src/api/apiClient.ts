// src/api/apiClient.ts

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use Vite's environment variable syntax
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token if required
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;
