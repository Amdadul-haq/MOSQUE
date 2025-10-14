// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useTabNavigation } from "../../src/hooks/useTabNavigation"; // ✅ IMPORT HOOK

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
    headerShown: false,
  };

  // ✅ TAB CONFIGURATION WITH LOADING KEYS
  const tabs = [
    {
      name: "index",
      title: "Home",
      icon: "home" as const,
      tabKey: "home" as const, // ✅ ADDED FOR LOADING
    },
    {
      name: "donations",
      title: "Donations",
      icon: "heart" as const,
      tabKey: "donations" as const, // ✅ ADDED FOR LOADING
    },
    {
      name: "mosque-info",
      title: "Mosque Info",
      icon: "mosque" as const,
      tabKey: "mosqueInfo" as const, // ✅ ADDED FOR LOADING
    },
    {
      name: "profile",
      title: "Profile",
      icon: "account" as const,
      tabKey: "profile" as const, // ✅ ADDED FOR LOADING
    },
  ];

  return (
    <Tabs
      screenOptions={screenOptions}
      // ✅ SWIPE ENABLED FOR EXPO ROUTER
      screenListeners={{
        // This enables swipe gestures
        state: (e) => {
          // Swipe detection - works with Expo Router
          console.log("Navigation state changed:", e.data);
        },
      }}
    >
      {tabs.map((tab) => {
        // ✅ USE LOADING HOOK FOR EACH TAB
        const { handleTabFocus } = useTabNavigation(tab.tabKey);

        return (
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
            listeners={{
              tabPress: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              },
              // ✅ HANDLE FOCUS FOR BOTH TAB PRESS AND SWIPE
              focus: () => {
                handleTabFocus();
              },
            }}
          />
        );
      })}
    </Tabs>
  );
}
