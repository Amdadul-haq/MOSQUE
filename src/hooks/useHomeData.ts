// src/hooks/useHomeData.ts
import { useState, useCallback } from 'react';
import { PrayerTime, StatItem, QuickAction, Event, Announcement } from '../types';
import { router } from 'expo-router';

export const useHomeData = () => {
  const [stats, setStats] = useState<StatItem[]>([
    {
      label: "Prayers",
      value: "5/5",
      icon: "🕌",
      color: "#16a34a", // ✅ Primary - Green
    },
    {
      label: "Donations",
      value: "₹2,500",
      icon: "💰",
      color: "#f59e0b", // ✅ Secondary - Amber
    },
    {
      label: "Quran",
      value: "15min",
      icon: "📖",
      color: "#10b981", // ✅ Tertiary - Emerald (CHANGED from #8b5cf6)
    },
  ]);

const [quickActions, setQuickActions] = useState<QuickAction[]>([
  {
    id: "donation",
    title: "Donate",
    icon: "heart",
    color: "#f59e0b", // ✅ Amber
    screen: "donations",
    description: "Make a donation to support the mosque", // ✅ ADD description
  },
  {
    id: "prayer",
    title: "Prayer Times",
    icon: "clock",
    color: "#16a34a", // ✅ Green
    screen: "mosque-info",
    description: "View today's prayer schedule",
  },
  {
    id: "events",
    title: "Events",
    icon: "calendar",
    color: "#10b981", // ✅ Emerald
    screen: "mosque-info",
    description: "Check upcoming community events",
  },
  {
    id: "quran",
    title: "Quran",
    icon: "book-open",
    color: "#f59e0b", // ✅ Amber
    screen: "quran",
    description: "Read and listen to Quran",
  },
]);

    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([
      {
        id: "1",
        title: "Friday Jumuah Prayer",
        date: "Today",
        time: "12:30 PM",
        type: "prayer",
        imam: "Imam Omar",
        location: "Main Hall",
      },
      {
        id: "2",
        title: "Quran Study Circle",
        date: "Tomorrow",
        time: "6:00 PM",
        type: "education",
        imam: "Shaykh Ahmed",
        location: "Library",
        description: "Weekly Quran recitation and discussion",
      },
      {
        id: "3",
        title: "Community Dinner",
        date: "Saturday",
        time: "7:30 PM",
        type: "social",
        imam: "All Imams",
        location: "Community Hall",
      },
    ]);

    const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([
      { name: "Fajr", time: "5:30 AM", isCurrent: false },
      { name: "Sunrise", time: "6:45 AM", isCurrent: false },
      { name: "Dhuhr", time: "12:30 PM", isCurrent: true },
      { name: "Asr", time: "4:15 PM", isCurrent: false },
      { name: "Maghrib", time: "6:45 PM", isCurrent: false },
      { name: "Isha", time: "8:00 PM", isCurrent: false },
    ]);


  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Friday Prayer Update",
      message: "Jumuah prayer will start at 12:30 PM this week",
      date: "2025-10-10",
      type: "info",
    },
  ]);

  const handleQuickAction = useCallback(
    (actionId: string, data?: any) => {
      console.log("Quick action:", actionId, data);
      // Handle different quick actions
      switch (actionId) {
        case "donation":
          router.push("/donation/type");
          break;
        case "profile":
          router.push("/profile");
          break;
        default:
          break;
      }
    },
    [router]
  );

  return {
    stats,
    upcomingEvents,
    prayerTimes,
    quickActions,
    announcements,
    handleQuickAction,
  };
};