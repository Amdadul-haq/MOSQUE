// app/_layout.tsx - UPDATE KORTE HOBE
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "../src/hooks/useColorScheme";
import { PaperProvider } from "react-native-paper";
import { LightTheme, DarkTheme } from "../src/theme/paper-theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "./splash";
import { TabLoadingProvider } from "../src/contexts/TabLoadingContext"; // ✅ NEW IMPORT

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : LightTheme;
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
        <PaperProvider theme={theme}>
          <SplashScreen />
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        {/* ✅ WRAP WITH TAB LOADING PROVIDER */}
        <TabLoadingProvider>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="financials" options={{ headerShown: false }} />
            <Stack.Screen
              name="mosque/mosque-history"
              options={{ headerShown: false }}
            />
          </Stack>
        </TabLoadingProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
