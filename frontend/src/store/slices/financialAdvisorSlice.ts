import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Advice {
  category: string;
  title: string;
  description: string;
  action: string;
}

interface FinancialAdvisorState {
  advice: Advice[];
  loading: boolean;
  error: string | null;
}

const initialState: FinancialAdvisorState = {
  advice: [],
  loading: false,
  error: null,
};

export const fetchFinancialAdvice = createAsyncThunk(
  'financialAdvisor/fetchFinancialAdvice',
  async () => {
    // In a real application, this would be an API call to a backend service
    // that generates personalized financial advice based on the user's data
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    return [
      {
        category: 'Budgeting',
        title: 'Create a Monthly Budget',
        description:
          'Track your income and expenses to gain better control over your finances.',
        action: 'Start Budgeting',
      },
      {
        category: 'Saving',
        title: 'Build an Emergency Fund',
        description:
          'Aim to save 3-6 months of living expenses for unexpected situations.',
        action: 'Set Savings Goal',
      },
      {
        category: 'Investing',
        title: 'Start Retirement Planning',
        description:
          'Consider opening an IRA or increasing your 401(k) contributions.',
        action: 'Explore Options',
      },
      {
        category: 'Debt Management',
        title: 'Pay Off High-Interest Debt',
        description:
          'Focus on paying off credit card balances to reduce interest payments.',
        action: 'Create Payoff Plan',
      },
      {
        category: 'Income',
        title: 'Explore Side Hustle Opportunities',
        description:
          'Look for ways to increase your income through part-time work or freelancing.',
        action: 'Find Opportunities',
      },
    ];
  }
);

const financialAdvisorSlice = createSlice({
  name: 'financialAdvisor',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFinancialAdvice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancialAdvice.fulfilled, (state, action) => {
        state.loading = false;
        state.advice = action.payload;
      })
      .addCase(fetchFinancialAdvice.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch financial advice';
      });
  },
});

export default financialAdvisorSlice.reducer;
