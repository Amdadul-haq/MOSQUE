// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

export default function TabLayout() {
  const theme = useTheme();

  const screenOptions: BottomTabNavigationOptions = {
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
    tabBarStyle: {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.outline,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerShown: false, // This hides the default header with tab names
  };

  const tabs = [
    {
      name: "index",
      title: "Home",
      icon: "home" as const,
    },
    {
      name: "donations",
      title: "Donations",
      icon: "heart" as const,
    },
    {
      name: "mosque-info",
      title: "Mosque Info",
      icon: "mosque" as const,
    },
    {
      name: "profile",
      title: "Profile",
      icon: "account" as const,
    },
  ];

  return (
    <Tabs screenOptions={screenOptions}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name={tab.icon}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
