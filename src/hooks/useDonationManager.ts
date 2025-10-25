// src/hooks/useDonationManager.ts
import { useState, useCallback } from 'react';
import { Donation } from '../types';

export const useDonationManager = () => {
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: "1",
      donor: "Ahmed Khan",
      type: "zakat",
      amount: 1000,
      date: "2024-01-15",
      anonymous: false,
    },
    {
      id: "2",
      donor: "Anonymous",
      type: "sadaqah",
      amount: 500,
      date: "2024-01-14",
      anonymous: true,
    },
    {
      id: "3",
      donor: "Fatima Ali",
      type: "construction",
      amount: 2000,
      date: "2024-01-13",
      anonymous: false,
    },
    {
      id: "4",
      donor: "Mohammed Hassan",
      type: "zakat",
      amount: 1500,
      date: "2024-01-12",
      anonymous: false,
    },
    {
      id: "5",
      donor: "Anonymous",
      type: "sadaqah",
      amount: 300,
      date: "2024-01-11",
      anonymous: true,
    },
  ]);

const addDonation = useCallback(
  (donationData: Omit<Donation, "id" | "date">) => {
    const newDonation: Donation = {
      ...donationData,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      // donor name is already passed from donationData
    };
    setDonations((prev) => [newDonation, ...prev]);
  },
  []
);

  const getMonthlyTotal = useCallback(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return donations
      .filter(donation => {
        const donationDate = new Date(donation.date);
        return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
      })
      .reduce((total, donation) => total + donation.amount, 0);
  }, [donations]);

  const getWeeklyTotal = useCallback(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return donations
      .filter(donation => new Date(donation.date) >= oneWeekAgo)
      .reduce((total, donation) => total + donation.amount, 0);
  }, [donations]);

  const getTodayTotal = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return donations
      .filter(donation => donation.date === today)
      .reduce((total, donation) => total + donation.amount, 0);
  }, [donations]);

  const totalDonations = donations.length;
  const monthlyDonationCount = donations.filter(donation => {
    const donationDate = new Date(donation.date);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
  }).length;

  const donationStats = {
    totalAmount: donations.reduce((total, donation) => total + donation.amount, 0),
    monthlyAmount: getMonthlyTotal(),
    weeklyAmount: getWeeklyTotal(),
    todayAmount: getTodayTotal(),
  };

  return {
    donations,
    addDonation,
    getMonthlyTotal,
    getWeeklyTotal,
    getTodayTotal,
    totalDonations,
    monthlyDonationCount,
    donationStats,
  };
};