// app/(tabs)/_layout.tsx - WORKING FIXED VERSION
import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useTabNavigation } from "../../src/hooks/useTabNavigation";

// ✅ CREATE CUSTOM HOOK FOR TAB FOCUS
const useTabConfig = (tabKey: any) => {
  const { handleTabFocus } = useTabNavigation(tabKey);

  const listeners = {
    tabPress: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    focus: () => {
      handleTabFocus();
    },
  };

  return { listeners };
};

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

  // ✅ USE HOOKS AT TOP LEVEL
  const { listeners: homeListeners } = useTabConfig("home");
  const { listeners: donationsListeners } = useTabConfig("donations");
  const { listeners: mosqueInfoListeners } = useTabConfig("mosqueInfo");
  const { listeners: profileListeners } = useTabConfig("profile");

  return (
    <Tabs
      screenOptions={screenOptions}
      screenListeners={{
        state: (e) => {
          console.log("Navigation state changed:", e.data);
        },
      }}
    >
      {/* ✅ DIRECT TABS.SCREEN WITH PROPER NAME */}
      <Tabs.Screen
        name="index" // ✅ This will show as "Home" tab
        options={{
          title: "Home", // ✅ This sets the tab label
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
        listeners={homeListeners}
      />

      <Tabs.Screen
        name="donations" // ✅ This will show as "Donations" tab
        options={{
          title: "Donations",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" size={size} color={color} />
          ),
        }}
        listeners={donationsListeners}
      />

      <Tabs.Screen
        name="mosque-info" // ✅ This will show as "Mosque Info" tab
        options={{
          title: "Mosque Info",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="mosque" size={size} color={color} />
          ),
        }}
        listeners={mosqueInfoListeners}
      />

      <Tabs.Screen
        name="profile" // ✅ This will show as "Profile" tab
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
        listeners={profileListeners}
      />
    </Tabs>
  );
}
