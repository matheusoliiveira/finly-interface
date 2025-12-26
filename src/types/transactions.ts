import type { Category, CategorySummary } from "./category";

// Substituindo enum por union type
export type TransactionType = "expense" | "income";

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  date: string | Date;
  categoryId: string;
  category: Category;
  type: TransactionType;
  updatedAt: string | Date;
  createdAt: string | Date;
}

export interface CreateTransactionDTO {
  description: string;
  amount: number;
  date: Date | string;
  categoryId: string;
  type: TransactionType;
}

export interface TransactionFilter {
  month: number;
  year: number;
  categoryId?: string;
  type?: TransactionType;
}

export interface TransactionSummary {
  totalExpenses: number;
  totalIncomes: number;
  balance: number;
  expensesByCategory: CategorySummary[];
}

export interface MonthlyItem {
  name: string;
  expenses: number;
  income: number;
}
