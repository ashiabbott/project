import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
}

interface BudgetState {
  categories: BudgetCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchBudget = createAsyncThunk('budget/fetchBudget', async () => {
  const response = await api.get<BudgetCategory[]>('/budget');
  return response.data;
});

export const updateBudgetCategory = createAsyncThunk(
  'budget/updateBudgetCategory',
  async (category: BudgetCategory) => {
    const response = await api.put<BudgetCategory>(
      `/budget/${category.id}`,
      category
    );
    return response.data;
  }
);

export const addBudgetCategory = createAsyncThunk(
  'budget/addBudgetCategory',
  async (category: Omit<BudgetCategory, 'id' | 'spent'>) => {
    const response = await api.post<BudgetCategory>('/budget', category);
    return response.data;
  }
);

export const deleteBudgetCategory = createAsyncThunk(
  'budget/deleteBudgetCategory',
  async (id: string) => {
    await api.delete(`/budget/${id}`);
    return id;
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    updateSpentAmount: (
      state,
      action: PayloadAction<{ categoryId: string; amount: number }>
    ) => {
      const category = state.categories.find(
        c => c.id === action.payload.categoryId
      );
      if (category) {
        category.spent += action.payload.amount;
      }
    },
    resetBudget: state => {
      state.categories.forEach(category => {
        category.spent = 0;
      });
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBudget.pending, state => {
        state.loading = true;
      })
      .addCase(
        fetchBudget.fulfilled,
        (state, action: PayloadAction<BudgetCategory[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(fetchBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch budget';
      })
      .addCase(
        updateBudgetCategory.fulfilled,
        (state, action: PayloadAction<BudgetCategory>) => {
          const index = state.categories.findIndex(
            cat => cat.id === action.payload.id
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
        }
      )
      .addCase(
        addBudgetCategory.fulfilled,
        (state, action: PayloadAction<BudgetCategory>) => {
          state.categories.push(action.payload);
        }
      )
      .addCase(
        deleteBudgetCategory.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.categories = state.categories.filter(
            cat => cat.id !== action.payload
          );
        }
      );
  },
});

export const { updateSpentAmount, resetBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
