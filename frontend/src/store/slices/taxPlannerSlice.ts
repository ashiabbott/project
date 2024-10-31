import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Income {
  id: string;
  source: string;
  amount: number;
}

interface Deduction {
  id: string;
  category: string;
  amount: number;
}

interface TaxPlannerState {
  incomes: Income[];
  deductions: Deduction[];
  totalTaxableIncome: number;
  estimatedTax: number;
  loading: boolean;
  error: string | null;
}

const initialState: TaxPlannerState = {
  incomes: [],
  deductions: [],
  totalTaxableIncome: 0,
  estimatedTax: 0,
  loading: false,
  error: null,
};

const taxPlannerSlice = createSlice({
  name: 'taxPlanner',
  initialState,
  reducers: {
    addIncome(state, action: PayloadAction<Income>) {
      state.incomes.push(action.payload);
      state.totalTaxableIncome += action.payload.amount;
    },
    removeIncome(state, action: PayloadAction<string>) {
      const income = state.incomes.find(inc => inc.id === action.payload);
      if (income) {
        state.totalTaxableIncome -= income.amount;
        state.incomes = state.incomes.filter(inc => inc.id !== action.payload);
      }
    },
    addDeduction(state, action: PayloadAction<Deduction>) {
      state.deductions.push(action.payload);
      state.totalTaxableIncome -= action.payload.amount;
    },
    removeDeduction(state, action: PayloadAction<string>) {
      const deduction = state.deductions.find(ded => ded.id === action.payload);
      if (deduction) {
        state.totalTaxableIncome += deduction.amount;
        state.deductions = state.deductions.filter(
          ded => ded.id !== action.payload
        );
      }
    },
    calculateEstimatedTax(state) {
      // Simple progressive tax brackets example
      const income = state.totalTaxableIncome;
      if (income <= 9875) {
        state.estimatedTax = income * 0.1;
      } else if (income <= 40125) {
        state.estimatedTax = 987.5 + (income - 9875) * 0.12;
      } else if (income <= 85525) {
        state.estimatedTax = 4617.5 + (income - 40125) * 0.22;
      } else {
        state.estimatedTax = 14605.5 + (income - 85525) * 0.24;
      }
    },
    resetTaxPlanner(state) {
      state.incomes = [];
      state.deductions = [];
      state.totalTaxableIncome = 0;
      state.estimatedTax = 0;
      state.error = null;
    },
  },
});

export const {
  addIncome,
  removeIncome,
  addDeduction,
  removeDeduction,
  calculateEstimatedTax,
  resetTaxPlanner,
} = taxPlannerSlice.actions;

export default taxPlannerSlice.reducer;
