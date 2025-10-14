// src/types/index.ts - UPDATED VERSION
export interface PrayerTime {
  name: string;
  time: string;
  isCurrent?: boolean;
}

export interface PrayerProgress {
  name: string;
  completed: boolean;
  time: string;
}

export interface Donation {
  id: string;
  donor: string;
  type: string;
  amount: number;
  date: string;
  anonymous: boolean;
}

export interface MosqueInfo {
  id: string;
  name: string;
  established: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  imam: {
    name: string;
    phone: string;
    bio: string;
    email: string;
  };
  services: string[];
  facilities?: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  imam: string;
  description?: string;
  location?: string;
}

// ✅ FIXED: Updated UserProfile to use ThemeMode and Language types
export type ThemeMode = 'light' | 'dark' | 'auto';
export type Language = 'en' | 'bn' | 'ar';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  role: string;
  membership?: string;
  prayerStreak?: number;
  totalPrayers?: number;
  preferences: {
    notifications: boolean;
    prayerReminders: boolean;
    darkMode: boolean;
    language: Language; // ✅ CHANGED: from string to Language
    theme: ThemeMode;   // ✅ CHANGED: from string to ThemeMode
    qiblaDirection: boolean;
    vibration: boolean;
  };
}

// src/types/index.ts - ADD THESE NOTIFICATION TYPES
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent' | 'donation' | 'prayer' | 'event';
  date: string;
  time: string;
  isRead: boolean;
  action?: {
    screen: string;
    params?: any;
  };
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: string;
  trend?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  description?: string;
  screen: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'urgent';
}

export interface FinancialData {
  currentMonth: MonthlyFinancials;
  lifetime: LifetimeFinancials;
  monthlyTrends: MonthlyTrend[];
}

export interface MonthlyFinancials {
  month: string;
  year: number;
  totalDonations: number;
  totalExpenses: number;
  balance: number;
  donationCount: number;
  expenseCount: number;
  categories: FinancialCategory[];
}

export interface LifetimeFinancials {
  totalDonations: number;
  totalExpenses: number;
  netBalance: number;
  totalDonationCount: number;
  totalExpenseCount: number;
  averageMonthlyDonations: number;
  averageMonthlyExpenses: number;
}

export interface FinancialCategory {
  name: string;
  amount: number;
  type: 'donation' | 'expense';
  percentage: number;
  icon: string;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  donations: number;
  expenses: number;
  balance: number;
}

export interface FinancialSummaryItem {
  label: string;
  value: string;
  amount: number;
  type: 'donation' | 'expense' | 'balance';
  trend?: string;
  icon: string;
  color: string;
}