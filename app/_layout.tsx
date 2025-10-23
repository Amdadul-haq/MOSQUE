// ✅ UPDATED: app/_layout.tsx - FIXED THEME SYSTEM
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "../src/hooks/useColorScheme";
import { PaperProvider } from "react-native-paper";
import { LightTheme, DarkTheme } from "../src/theme/paper-theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "./splash";
import { TabLoadingProvider } from "../src/contexts/TabLoadingContext";
import { ThemeProvider, useThemeMode } from "../src/contexts/ThemeContext";
import { AuthProvider } from "../src/contexts/AuthContext";
import { NotificationProvider } from "../src/contexts/NotificationContext";

// ✅ UPDATED: ThemedApp component that uses single theme source
function ThemedApp() {
  const { themeMode, isDark } = useThemeMode();

  // ✅ SINGLE SOURCE OF TRUTH: Use theme from ThemeContext
  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <NotificationProvider>
          <TabLoadingProvider>
            <StatusBar style={isDark ? "light" : "dark"} />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="financials"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="mosque/mosque-history"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="notifications"
                options={{ headerShown: false }}
              />
            </Stack>
          </TabLoadingProvider>
        </NotificationProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  if (!appIsReady) {
    return (
      <SafeAreaProvider>
        {/* ✅ Splash screen with proper theme */}
        <ThemeProvider>
          <PaperProvider
            theme={colorScheme === "dark" ? DarkTheme : LightTheme}
          >
            <SplashScreen />
          </PaperProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {/* ✅ Main app with proper theme */}
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
