// src/types/index.ts
export interface Donation {
  id: string;
  donor: string;
  type: 'zakat' | 'sadaqah' | 'construction' | 'other';
  amount: number;
  date: string;
  anonymous: boolean;
  description?: string;
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
  prayerTimes: Record<string, string>;
  services: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  role: 'member' | 'volunteer' | 'admin';
  preferences: {
    notifications: boolean;
    prayerReminders: boolean;
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface PrayerTime {
  name: string;
  time: string;
  isCurrent?: boolean;
  iqamah?: string;
}