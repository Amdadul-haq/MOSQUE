// src/hooks/useDonationManager.ts
import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { Donation } from '../types';

export const useDonationManager = () => {
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: '1',
      donor: 'Ahmed Khan',
      type: 'sadaqah',
      amount: 100,
      date: '2024-01-15',
      anonymous: false,
    },
    {
      id: '2',
      donor: 'Fatima Ali',
      type: 'zakat',
      amount: 250,
      date: '2024-01-14',
      anonymous: false,
    },
    {
      id: '3',
      donor: 'Anonymous',
      type: 'construction',
      amount: 500,
      date: '2024-01-10',
      anonymous: true,
    },
  ]);

  const addDonation = useCallback((donation: Omit<Donation, 'id' | 'date'>) => {
    const newDonation: Donation = {
      ...donation,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
    };

    setDonations(prev => [newDonation, ...prev]);
    
    Alert.alert(
      'Thank You! 🎉',
      `Your ${donation.type} donation of $${donation.amount} has been recorded. May Allah accept it from you.`,
      [{ text: 'Alhamdulillah' }]
    );
  }, []);

  const getMonthlyTotal = useCallback(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return donations
      .filter(donation => {
        const donationDate = new Date(donation.date);
        return donationDate.getMonth() === currentMonth && 
               donationDate.getFullYear() === currentYear;
      })
      .reduce((total, donation) => total + donation.amount, 0);
  }, [donations]);

  const monthlyDonationCount = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return donations.filter(donation => {
      const donationDate = new Date(donation.date);
      return donationDate.getMonth() === currentMonth && 
             donationDate.getFullYear() === currentYear;
    }).length;
  }, [donations]);

  const totalDonations = donations.length;

  return {
    donations,
    addDonation,
    getMonthlyTotal,
    totalDonations,
    monthlyDonationCount,
  };
};