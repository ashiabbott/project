// src/types/index.ts

// Enums for fixed categories, types, and impacts to ensure consistency
export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}

export enum InsightType {
  Info = 'info',
  Warning = 'warning',
  Success = 'success',
  Error = 'error',
}

export enum AdviceImpact {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

export enum NotificationType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

// Generic API Response Interface
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// API Error Interface
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Budget Category Interface
export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
}

// Budget Interface
export interface Budget {
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
  categories: BudgetCategory[];
}

// Insight Interface
export interface Insight {
  id: string;
  title: string;
  description: string;
  type: InsightType;
}

// Advice Item Interface
export interface AdviceItem {
  id: string;
  title: string;
  message: string;
  impact: AdviceImpact;
}

// Goal Interface
export interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  description?: string;
}

// Extended Goal Interface for detailed progress and milestones
export interface DetailedGoal extends Goal {
  progress: number; // Percentage completion
  milestones: Milestone[];
}

// Milestone Interface for Goals
export interface Milestone {
  id: string;
  name: string;
  targetAmount: number;
  achieved: boolean;
  achievedDate?: string; // ISO date string
}

// Transaction Interface
export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string; // ISO date string
  description?: string;
}

// Extended Transaction Interface for extra data, if needed
export interface DetailedTransaction extends Transaction {
  userId: string;
  tags: string[];
  metadata?: Record<string, any>;
}

// Investment Interface
export interface Investment {
  id: string;
  investmentType: string;
  amount: number;
  date: string; // ISO date string
  returns: number;
  notes?: string;
}

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Notification Interface
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string; // ISO date string
  read: boolean;
}
// Savings Challenge Interface
export interface SavingsChallenge {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  startDate: string;
  endDate: string;
}

export interface SavingsChallengeState {
  challenges: SavingsChallenge[];
  loading: boolean;
  error: string | null;
}

export interface ReportParams {
  startDate: string; // ISO date string
  endDate: string;
}

export interface ReportData {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  // Additional fields as needed
}

export type ExportFormat = 'pdf' | 'csv' | 'xlsx';
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}

// src/types.ts

// Transaction Types
export type TransactionType = 'income' | 'expense';

// User-related interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user' | 'guest'; // Optional user roles
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

// Transaction interface
export interface Transaction {
  id: string;
  type: TransactionType; // Uses TransactionType type alias
  category: string;
  amount: number;
  date: string; // ISO date string
  description?: string;
  currency?: 'USD' | 'EUR' | 'NGN' | 'GBP'; // Optional currency codes
  tags?: string[]; // Optional tags for categorization
}

// Category interface
export interface Category {
  id: string;
  name: string;
  parentCategoryId?: string; // Allows for nested categories
  icon?: string; // Icon name or URL for category representation
  color?: string; // Color code for category UI representation
}

// Budget interface
export interface Budget {
  id: string;
  name: string;
  amount: number;
  allocated?: number; // Total allocated for this budget
  spent?: number; // Total spent within this budget
  categories?: string[]; // Array of category IDs for budget allocation
  createdAt?: string; // ISO date string
}

// Goal interface
export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  status?: 'active' | 'completed' | 'pending'; // Optional status for goal tracking
}

// Investment interface
export interface Investment {
  id: string;
  name: string;
  amount: number;
  investmentType?: 'stocks' | 'bonds' | 'crypto' | 'real estate'; // Optional investment types
  returns?: number; // Returns percentage or amount
  startDate?: string; // ISO date string
  notes?: string; // Optional notes for additional context
}

// Notification interface
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  read?: boolean; // Indicates if notification has been read
  createdAt?: string; // ISO date string for when it was created
  url?: string; // Optional link associated with the notification
}

// Insight interface
export interface Insight {
  id: string;
  message: string;
  type?: 'analysis' | 'recommendation' | 'alert'; // Insight types
  createdAt?: string; // ISO date string
  importance?: 'high' | 'medium' | 'low'; // Indicates the priority of insight
}

// Advice Item interface
export interface AdviceItem {
  id: string;
  advice: string;
  category?: string; // Category for organizing advice items
  impact?: 'high' | 'medium' | 'low'; // Impact level of advice
  issuedAt?: string; // ISO date string for when advice was given
}
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}
