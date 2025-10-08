// src/hooks/useHomeData.ts
import { useState, useCallback, useMemo } from "react";
import { Alert } from "react-native";

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
}

export interface PrayerTime {
  name: string;
  time: string;
  isCurrent?: boolean;
}

export interface Stat {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  description: string;
  screen?: string;
}

export const useHomeData = () => {
  const [stats, setStats] = useState<Stat[]>([
    { label: "Prayers", value: "5", icon: "🕌", color: "#16a34a" },
    { label: "Attendees", value: "127", icon: "👥", color: "#f59e0b" },
    { label: "Donations", value: "$2.4k", icon: "💰", color: "#ef4444" },
  ]);

  const prayerTimes = useMemo<PrayerTime[]>(
    () => [
      { name: "Fajr", time: "5:30 AM", isCurrent: false },
      { name: "Dhuhr", time: "12:30 PM", isCurrent: true },
      { name: "Asr", time: "4:15 PM", isCurrent: false },
      { name: "Maghrib", time: "6:45 PM", isCurrent: false },
      { name: "Isha", time: "8:00 PM", isCurrent: false },
    ],
    []
  );

  const upcomingEvents = useMemo<Event[]>(
    () => [
      {
        id: "1",
        title: "Friday Jumuah Prayer",
        date: "Today",
        time: "1:00 PM",
        description: "Special Friday prayer with community gathering",
      },
      {
        id: "2",
        title: "Quran Study Circle",
        date: "Tomorrow",
        time: "6:00 PM",
        description: "Weekly Quran recitation and discussion",
      },
      {
        id: "3",
        title: "Community Iftar",
        date: "This Weekend",
        time: "6:30 PM",
        description: "Community iftar gathering",
      },
    ],
    []
  );

  const quickActions = useMemo<QuickAction[]>(
    () => [
      {
        id: "prayer-times",
        title: "Prayer Times",
        icon: "clock",
        description: "View daily prayer schedule",
        screen: "prayer-times",
      },
      {
        id: "events",
        title: "Events",
        icon: "calendar",
        description: "Upcoming mosque events",
        screen: "events",
      },
      {
        id: "donate",
        title: "Donate",
        icon: "heart",
        description: "Support the mosque",
        screen: "donations",
      },
      {
        id: "qibla",
        title: "Qibla",
        icon: "navigation",
        description: "Find prayer direction",
        screen: "qibla",
      },
    ],
    []
  );

  const handleQuickAction = useCallback(
    (actionId: string, eventId?: string) => {
      switch (actionId) {
        case "donation":
          Alert.alert("Make Donation", "Redirecting to donation screen...");
          break;
        case "event":
          const event = upcomingEvents.find((e) => e.id === eventId);
          Alert.alert(
            "Event Details",
            event ? `${event.title}\n\n${event.description}` : "Event details"
          );
          break;
        case "prayer-times":
          Alert.alert("Prayer Times", "Showing full prayer schedule...");
          break;
        case "events":
          Alert.alert("Events", "Showing all upcoming events...");
          break;
        case "donate":
          Alert.alert("Donate", "Opening donation form...");
          break;
        case "qibla":
          Alert.alert("Qibla Finder", "Finding prayer direction...");
          break;
        default:
          Alert.alert("Quick Action", `${actionId} action triggered!`);
      }
    },
    [upcomingEvents]
  );

  const refreshData = useCallback(async () => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setStats([
          { label: "Prayers", value: "5", icon: "🕌", color: "#16a34a" },
          { label: "Attendees", value: "135", icon: "👥", color: "#f59e0b" },
          { label: "Donations", value: "$2.6k", icon: "💰", color: "#ef4444" },
        ]);
        resolve();
      }, 1000);
    });
  }, []);

  return {
    stats,
    prayerTimes,
    upcomingEvents,
    quickActions,
    handleQuickAction,
    refreshData,
  };
};
