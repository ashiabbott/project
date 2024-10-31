import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchChallenges,
  fetchLeaderboardData,
  joinChallengeService,
  createChallengeService,
} from '../../services/socialFinanceService';

interface Challenge {
  id: string;
  name: string;
  description: string;
  participants: number;
  duration: string;
  reward: string;
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  rank: number;
}

interface SocialFinanceState {
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: SocialFinanceState = {
  challenges: [],
  leaderboard: [],
  loading: false,
  error: null,
};

export const fetchSocialData = createAsyncThunk(
  'socialFinance/fetchSocialData',
  async (_, { rejectWithValue }) => {
    try {
      const challenges = await fetchChallenges();
      return challenges;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'socialFinance/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const leaderboard = await fetchLeaderboardData();
      return leaderboard;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinChallenge = createAsyncThunk(
  'socialFinance/joinChallenge',
  async (challengeId: string, { rejectWithValue }) => {
    try {
      await joinChallengeService(challengeId);
      return challengeId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createChallenge = createAsyncThunk(
  'socialFinance/createChallenge',
  async (challengeData: Partial<Challenge>, { rejectWithValue }) => {
    try {
      const newChallenge = await createChallengeService(challengeData);
      return newChallenge;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const socialFinanceSlice = createSlice({
  name: 'socialFinance',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSocialData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialData.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = action.payload;
      })
      .addCase(fetchSocialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      })
      .addCase(joinChallenge.fulfilled, (state, action) => {
        const challenge = state.challenges.find(c => c.id === action.payload);
        if (challenge) {
          challenge.participants += 1;
        }
      })
      .addCase(createChallenge.fulfilled, (state, action) => {
        state.challenges.push(action.payload);
      });
  },
});

export default socialFinanceSlice.reducer;
