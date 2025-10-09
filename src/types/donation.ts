// src/types/donation.ts
export interface DonationData {
  type: string;
  amount: number;
  month: string;
  isAnonymous: boolean;
  message?: string;
  paymentMethod: string;
  donorName?: string;
  donorEmail?: string;
}

export interface DonationType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  accountNumber?: string;
  instructions?: string;
}