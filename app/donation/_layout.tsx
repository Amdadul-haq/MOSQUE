// app/donation/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "../../src/hooks/useColorScheme";

export default function DonationLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="type" options={{ title: "Donation Type" }} />
        <Stack.Screen name="amount" options={{ title: "Donation Amount" }} />
        <Stack.Screen name="payment" options={{ title: "Payment Method" }} />
        <Stack.Screen name="review" options={{ title: "Review Donation" }} />
        <Stack.Screen name="success" options={{ title: "Donation Success" }} />
      </Stack>
    </>
  );
}
