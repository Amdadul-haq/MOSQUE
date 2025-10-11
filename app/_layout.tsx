// app/_layout.tsx - Stack.Screen add korbo
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "../src/hooks/useColorScheme";
import { PaperProvider } from "react-native-paper";
import { LightTheme, DarkTheme } from "../src/theme/paper-theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "./splash";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : LightTheme;
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Simulate app loading process
    const prepareApp = async () => {
      try {
        // Wait for 2.5 seconds (splash screen duration)
        await new Promise((resolve) => setTimeout(resolve, 2500));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
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
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="financials"
            options={{ headerShown: false }}
          />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
