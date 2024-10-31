import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
}

interface Budget {
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
  categories: BudgetCategory[];
}

interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  progress: number;
}

interface FinancialOverviewData {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  transactions: Transaction[];
  budget: Budget;
  goals: Goal[];
  financialOverview: FinancialOverviewData;
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<DashboardData>('/dashboard');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard data'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDashboardData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || 'Failed to fetch dashboard data';
      });
  },
});

export default dashboardSlice.reducer;
