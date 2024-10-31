export interface Transaction {
  id: string;
  date: string; // ISO Date string, e.g., "2023-10-05T14:48:00.000Z"
  description: string;
  amount: number; // Positive for income, negative for expenses
  type: 'income' | 'expense';
}

export interface Investment {
  id: string;
  name: string;
  symbol?: string; // Optional, for stocks and cryptos
  amount: number; // Number of shares or units
  currentValue: number; // Latest calculated value
  type: 'stock' | 'bond' | 'real-estate' | 'crypto';
  date: string; // ISO Date string
}

export interface Budget {
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
}

export interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
}

export interface FinancialOverviewData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }[];
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  transactions: Transaction[];
  investments: Investment[];
  budget: Budget;
  goals: Goal[];
  financialOverview: FinancialOverviewData;
}
