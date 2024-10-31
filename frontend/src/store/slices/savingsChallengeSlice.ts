import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../index';

// Define the Challenge interface
export interface Challenge {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  startDate: string;
  endDate: string;
}

// Define the state interface
interface SavingsChallengeState {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
}

const initialState: SavingsChallengeState = {
  challenges: [],
  loading: false,
  error: null,
};

// Async thunk to fetch challenges from the API
export const fetchChallenges = createAsyncThunk<
  Challenge[],
  void,
  { rejectValue: string }
>('savingsChallenge/fetchChallenges', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/challenges');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch challenges.'
    );
  }
});

// Async thunk to create a new challenge
export const createSavingsChallenge = createAsyncThunk<
  Challenge,
  Omit<Challenge, 'id' | 'savedAmount' | 'startDate' | 'endDate'>,
  { rejectValue: string }
>(
  'savingsChallenge/createSavingsChallenge',
  async (newChallengeData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/challenges', newChallengeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create challenge.'
      );
    }
  }
);

// Async thunk to update a challenge's saved amount
export const updateChallengeSavedAmount = createAsyncThunk<
  Challenge,
  { id: string; amount: number },
  { rejectValue: string; state: RootState }
>(
  'savingsChallenge/updateChallengeSavedAmount',
  async ({ id, amount }, { rejectWithValue, getState, dispatch }) => {
    // Optimistically update the UI
    const challenge = getState().savingsChallenge.challenges.find(
      c => c.id === id
    );
    if (challenge) {
      dispatch(
        updateSavedAmountLocally({
          id,
          amount,
        })
      );
    }
    try {
      const response = await axios.patch(`/api/challenges/${id}`, { amount });
      return response.data;
    } catch (error: any) {
      // Revert the optimistic update if the request fails
      if (challenge) {
        dispatch(
          updateSavedAmountLocally({
            id,
            amount: -amount,
          })
        );
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update challenge.'
      );
    }
  }
);

// Async thunk to delete a challenge
export const deleteChallenge = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('savingsChallenge/deleteChallenge', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/challenges/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to delete challenge.'
    );
  }
});

// The slice
const savingsChallengeSlice = createSlice({
  name: 'savingsChallenge',
  initialState,
  reducers: {
    // Add the local reducer for optimistic updates
    updateSavedAmountLocally(
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) {
      const challenge = state.challenges.find(c => c.id === action.payload.id);
      if (challenge) {
        challenge.savedAmount += action.payload.amount;
      }
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Challenges
      .addCase(fetchChallenges.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = action.payload;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch challenges.';
      })

      // Create Challenge
      .addCase(createSavingsChallenge.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSavingsChallenge.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges.push(action.payload);
      })
      .addCase(createSavingsChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create challenge.';
      })

      // Update Challenge Saved Amount
      .addCase(updateChallengeSavedAmount.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChallengeSavedAmount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.challenges.findIndex(
          challenge => challenge.id === action.payload.id
        );
        if (index !== -1) {
          state.challenges[index] = action.payload;
        }
      })
      .addCase(updateChallengeSavedAmount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update challenge.';
      })

      // Delete Challenge
      .addCase(deleteChallenge.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChallenge.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = state.challenges.filter(
          challenge => challenge.id !== action.payload
        );
      })
      .addCase(deleteChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete challenge.';
      });
  },
});

export const { updateSavedAmountLocally } = savingsChallengeSlice.actions;

export default savingsChallengeSlice.reducer;
