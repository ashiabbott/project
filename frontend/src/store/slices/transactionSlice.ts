import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';

export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async (_, { rejectWithValue }) => {
    // Your code here
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transactionData, { rejectWithValue }) => {
    // Your code here
  }
);
