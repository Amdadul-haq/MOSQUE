// src/contexts/NotificationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Notification, NotificationState } from "../types";

interface NotificationContextType {
  notificationState: NotificationState;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, "id" | "isRead">) => void;
  removeNotification: (notificationId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notificationState, setNotificationState] = useState<NotificationState>(
    {
      notifications: [
        {
          id: "1",
          title: "Friday Prayer Update",
          message:
            "Jumuah prayer will start at 12:30 PM this week. Please arrive early for parking.",
          type: "info",
          date: "2024-01-15",
          time: "09:30 AM",
          isRead: false,
        },
        {
          id: "2",
          title: "Donation Received",
          message:
            "Your donation of ₹2,500 has been successfully processed. JazakAllah Khair!",
          type: "donation",
          date: "2024-01-14",
          time: "02:15 PM",
          isRead: false,
        },
        {
          id: "3",
          title: "Community Event Reminder",
          message: "Quran Study Circle starts in 2 hours at the library.",
          type: "event",
          date: "2024-01-14",
          time: "04:00 PM",
          isRead: true,
        },
        {
          id: "4",
          title: "Urgent Maintenance",
          message:
            "Main prayer hall will be closed for cleaning tomorrow from 2-4 PM.",
          type: "urgent",
          date: "2024-01-13",
          time: "11:00 AM",
          isRead: false,
        },
        {
          id: "5",
          title: "Fajr Time Adjustment",
          message: "Fajr prayer time adjusted to 5:25 AM starting next week.",
          type: "prayer",
          date: "2024-01-12",
          time: "03:45 PM",
          isRead: true,
        },
      ],
      unreadCount: 3,
    }
  );

  const markAsRead = (notificationId: string) => {
    setNotificationState((prev) => {
      const updatedNotifications = prev.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      );

      const unreadCount = updatedNotifications.filter((n) => !n.isRead).length;

      return {
        notifications: updatedNotifications,
        unreadCount,
      };
    });
  };

  const markAllAsRead = () => {
    setNotificationState((prev) => {
      const updatedNotifications = prev.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));

      return {
        notifications: updatedNotifications,
        unreadCount: 0,
      };
    });
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "isRead">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      isRead: false,
    };

    setNotificationState((prev) => ({
      notifications: [newNotification, ...prev.notifications],
      unreadCount: prev.unreadCount + 1,
    }));
  };

  const removeNotification = (notificationId: string) => {
    setNotificationState((prev) => {
      const notificationToRemove = prev.notifications.find(
        (n) => n.id === notificationId
      );
      const updatedNotifications = prev.notifications.filter(
        (n) => n.id !== notificationId
      );

      const unreadCount =
        notificationToRemove && !notificationToRemove.isRead
          ? prev.unreadCount - 1
          : prev.unreadCount;

      return {
        notifications: updatedNotifications,
        unreadCount: Math.max(0, unreadCount),
      };
    });
  };

  const value: NotificationContextType = {
    notificationState,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
