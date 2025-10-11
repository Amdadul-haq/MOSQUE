// src/data/mockFinancialData.ts
import { FinancialData, MonthlyFinancials, LifetimeFinancials, MonthlyTrend, FinancialCategory } from '../types';

export const mockFinancialData: FinancialData = {
  currentMonth: {
    month: 'December',
    year: 2024,
    totalDonations: 125750,
    totalExpenses: 98750,
    balance: 27000,
    donationCount: 48,
    expenseCount: 23,
    categories: [
      {
        name: 'Zakat',
        amount: 45000,
        type: 'donation',
        percentage: 36,
        icon: 'scale-balance',
        color: '#16a34a'
      },
      {
        name: 'Sadaqah',
        amount: 35000,
        type: 'donation',
        percentage: 28,
        icon: 'heart',
        color: '#f59e0b'
      },
      {
        name: 'Construction',
        amount: 25750,
        type: 'donation',
        percentage: 20,
        icon: 'home',
        color: '#ef4444'
      },
      {
        name: 'Education',
        amount: 15000,
        type: 'donation',
        percentage: 12,
        icon: 'school',
        color: '#8b5cf6'
      },
      {
        name: 'Utilities',
        amount: 35000,
        type: 'expense',
        percentage: 35,
        icon: 'flash',
        color: '#ef4444'
      },
      {
        name: 'Maintenance',
        amount: 25000,
        type: 'expense',
        percentage: 25,
        icon: 'tools',
        color: '#f59e0b'
      },
      {
        name: 'Staff Salaries',
        amount: 22000,
        type: 'expense',
        percentage: 22,
        icon: 'account-group',
        color: '#8b5cf6'
      },
      {
        name: 'Community Events',
        amount: 16750,
        type: 'expense',
        percentage: 17,
        icon: 'calendar',
        color: '#16a34a'
      }
    ]
  },
  lifetime: {
    totalDonations: 2850000,
    totalExpenses: 2345000,
    netBalance: 505000,
    totalDonationCount: 1250,
    totalExpenseCount: 680,
    averageMonthlyDonations: 125000,
    averageMonthlyExpenses: 102000
  },
  monthlyTrends: [
    { month: 'Jan 24', donations: 98000, expenses: 85000, balance: 13000 },
    { month: 'Feb 24', donations: 105000, expenses: 92000, balance: 13000 },
    { month: 'Mar 24', donations: 112000, expenses: 95000, balance: 17000 },
    { month: 'Apr 24', donations: 108000, expenses: 88000, balance: 20000 },
    { month: 'May 24', donations: 115000, expenses: 92000, balance: 23000 },
    { month: 'Jun 24', donations: 120000, expenses: 98000, balance: 22000 },
    { month: 'Jul 24', donations: 118000, expenses: 95000, balance: 23000 },
    { month: 'Aug 24', donations: 122000, expenses: 101000, balance: 21000 },
    { month: 'Sep 24', donations: 128000, expenses: 105000, balance: 23000 },
    { month: 'Oct 24', donations: 132000, expenses: 108000, balance: 24000 },
    { month: 'Nov 24', donations: 120000, expenses: 97000, balance: 23000 },
    { month: 'Dec 24', donations: 125750, expenses: 98750, balance: 27000 }
  ]
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return `৳${amount.toLocaleString('en-BD')}`;
};

// Helper function to get current month name in Bangladesh timezone
export const getCurrentMonth = (): string => {
  const date = new Date();
  return date.toLocaleString('en-US', { 
    month: 'long',
    timeZone: 'Asia/Dhaka'
  });
};