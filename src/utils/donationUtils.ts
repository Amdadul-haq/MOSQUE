import { MD3Theme } from "react-native-paper";

// ✅ FIXED: Using MD3Theme type instead of Theme
export const getDonationTypeColor = (type: string, theme: MD3Theme) => {
  const typeColors: { [key: string]: string } = {
    zakat: theme.colors.primary, // ✅ Green from theme
    sadaqah: theme.colors.secondary, // ✅ Amber/Orange from theme
    construction: theme.colors.error, // ✅ Red from theme
    education: theme.colors.tertiary, // ✅ Emerald from theme
  };
  return typeColors[type] || theme.colors.primary;
};

export const getPaymentMethodName = (method: string) => {
  const methodNames: { [key: string]: string } = {
    bkash: "bKash",
    nagad: "Nagad",
    rocket: "Rocket",
    cash: "Cash",
  };
  return methodNames[method] || method;
};

export const formatDonationType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// ✅ Payment method colors using theme
export const getPaymentMethodColor = (method: string, theme: MD3Theme) => {
  const methodColors: { [key: string]: string } = {
    bkash: theme.colors.primary, // Use primary for consistency
    nagad: theme.colors.secondary, // Use secondary
    rocket: theme.colors.tertiary, // Use tertiary
    cash: theme.colors.primary, // Use primary
  };
  return methodColors[method] || theme.colors.primary;
};
