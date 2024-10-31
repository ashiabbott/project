import axios from 'axios';

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the auth token in requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Goals API
export const fetchGoals = () => api.get('/goals');
export const addGoal = (goal: Omit<Goal, 'id'>) => api.post('/goals', goal);
export const updateGoal = (goal: Goal) => api.put(`/goals/${goal.id}`, goal);

// Dashboard API
export const fetchDashboardData = () => api.get('/dashboard');

// Add other API calls for transactions, budget, investments, etc.
