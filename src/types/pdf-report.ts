// src/types/pdf-report.ts
export interface PDFReportData {
  mosqueName: string;
  reportPeriod: string;
  generatedDate: string;
  financialSummary: FinancialSummary;
  donationBreakdown: CategoryBreakdown[];
  expenseBreakdown: CategoryBreakdown[];
  monthlyTrends: MonthlyTrendData[];
  notes?: string;
}

export interface FinancialSummary {
  totalDonations: number;
  totalExpenses: number;
  netBalance: number;
  donationCount: number;
  expenseCount: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  type: 'donation' | 'expense';
}

export interface MonthlyTrendData {
  month: string;
  donations: number;
  expenses: number;
  balance: number;
}

export interface PDFExportConfig {
  includeCharts: boolean;
  includeDetails: boolean;
  passwordProtected: boolean;
  format: 'A4' | 'Letter';
}