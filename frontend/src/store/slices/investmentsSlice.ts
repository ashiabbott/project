// src/store/slices/investmentsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Investment } from '../../types';

// Define the shape of the investments state
interface InvestmentsState {
  investments: Investment[];
  loading: boolean;
  error: string | null;
}

// Initialize the state
const initialState: InvestmentsState = {
  investments: [],
  loading: false,
  error: null,
};

// Async Thunks

/**
 * Fetch all investments for the authenticated user.
 */
export const fetchInvestments = createAsyncThunk(
  'investments/fetchInvestments',
  async () => {
    const response = await api.get<Investment[]>('/investments');
    return response.data;
  }
);

/**
 * Add a new investment.
 * @param investment - The investment data without the 'id' field.
 */
export const addInvestment = createAsyncThunk(
  'investments/addInvestment',
  async (investment: Omit<Investment, 'id'>) => {
    const response = await api.post<Investment>('/investments', investment);
    return response.data;
  }
);

/**
 * Update an existing investment.
 * @param investment - The complete investment data, including the 'id'.
 */
export const updateInvestmentThunk = createAsyncThunk(
  // Renamed to avoid conflict
  'investments/updateInvestment',
  async (investment: Investment) => {
    const response = await api.put<Investment>(
      `/investments/${investment.id}`,
      investment
    );
    return response.data;
  }
);

/**
 * Delete an investment by its ID.
 * @param id - The ID of the investment to delete.
 */
export const deleteInvestment = createAsyncThunk(
  'investments/deleteInvestment',
  async (id: string) => {
    await api.delete(`/investments/${id}`);
    return id;
  }
);

// Create the investments slice
const investmentsSlice = createSlice({
  name: 'investments',
  initialState,
  reducers: {
    /**
     * Set the entire investment object.
     * Renamed from 'updateInvestment' to 'setInvestment' to avoid naming conflict.
     */
    setInvestment: (state, action: PayloadAction<Investment>) => {
      const index = state.investments.findIndex(
        inv => inv.id === action.payload.id
      );
      if (index !== -1) {
        state.investments[index] = action.payload;
      }
    },

    /**
     * Update the current value of an investment.
     * @param action.payload - An object containing the investment 'id' and the 'newValue'.
     */
    updateInvestmentValue: (
      state,
      action: PayloadAction<{ id: string; newValue: number }>
    ) => {
      const investment = state.investments.find(
        i => i.id === action.payload.id
      );
      if (investment) {
        investment.currentValue = action.payload.newValue;
      }
    },

    /**
     * Sort investments based on their performance.
     * Investments are sorted in descending order of performance.
     */
    sortInvestmentsByPerformance: state => {
      state.investments.sort((a, b) => {
        const performanceA = (a.currentValue - a.amount) / a.amount;
        const performanceB = (b.currentValue - b.amount) / b.amount;
        return performanceB - performanceA;
      });
    },
  },
  extraReducers: builder => {
    builder
      // Handle fetchInvestments
      .addCase(fetchInvestments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchInvestments.fulfilled,
        (state, action: PayloadAction<Investment[]>) => {
          state.loading = false;
          state.investments = action.payload;
        }
      )
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch investments';
      })

      // Handle addInvestment
      .addCase(
        addInvestment.fulfilled,
        (state, action: PayloadAction<Investment>) => {
          state.investments.push(action.payload);
        }
      )

      // Handle updateInvestmentThunk
      .addCase(
        updateInvestmentThunk.fulfilled,
        (state, action: PayloadAction<Investment>) => {
          const index = state.investments.findIndex(
            i => i.id === action.payload.id
          );
          if (index !== -1) {
            state.investments[index] = action.payload;
          }
        }
      )

      // Handle deleteInvestment
      .addCase(
        deleteInvestment.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.investments = state.investments.filter(
            i => i.id !== action.payload
          );
        }
      );
  },
});

// Export Actions with Unique Names
export const {
  setInvestment, // Renamed from 'updateInvestment'
  updateInvestmentValue,
  sortInvestmentsByPerformance,
} = investmentsSlice.actions;

// Export the reducer
export default investmentsSlice.reducer;
