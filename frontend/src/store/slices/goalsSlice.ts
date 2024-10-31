import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

interface GoalsState {
  goals: Goal[];
  loading: boolean;
  error: string | null;
}

const initialState: GoalsState = {
  goals: [],
  loading: false,
  error: null,
};

export const fetchGoals = createAsyncThunk('goals/fetchGoals', async () => {
  const response = await api.get<Goal[]>('/goals');
  return response.data;
});

export const addGoal = createAsyncThunk(
  'goals/addGoal',
  async (goal: Omit<Goal, 'id'>) => {
    const response = await api.post<Goal>('/goals', goal);
    return response.data;
  }
);

export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async (goal: Goal) => {
    const response = await api.put<Goal>(`/goals/${goal.id}`, goal);
    return response.data;
  }
);

export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (id: string) => {
    await api.delete(`/goals/${id}`);
    return id;
  }
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    contributeToGoal: (
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) => {
      const goal = state.goals.find(g => g.id === action.payload.id);
      if (goal) {
        goal.currentAmount += action.payload.amount;
      }
    },
    sortGoalsByProgress: state => {
      state.goals.sort(
        (a, b) =>
          b.currentAmount / b.targetAmount - a.currentAmount / a.targetAmount
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGoals.pending, state => {
        state.loading = true;
      })
      .addCase(fetchGoals.fulfilled, (state, action: PayloadAction<Goal[]>) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch goals';
      })
      .addCase(addGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
        state.goals.push(action.payload);
      })
      .addCase(updateGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
        const index = state.goals.findIndex(g => g.id === action.payload.id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      .addCase(deleteGoal.fulfilled, (state, action: PayloadAction<string>) => {
        state.goals = state.goals.filter(g => g.id !== action.payload);
      });
  },
});

export const { contributeToGoal, sortGoalsByProgress } = goalsSlice.actions;
export default goalsSlice.reducer;
