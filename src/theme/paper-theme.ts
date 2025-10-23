// ✅ UPDATED: src/theme/paper-theme.ts
import {
  DefaultTheme as PaperDefaultTheme,
  MD3DarkTheme as PaperDarkTheme,
} from "react-native-paper";

export const LightTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    // ✅ PRIMARY: Green (Main brand color)
    primary: "#16a34a",

    // ✅ SECONDARY: Amber/Orange (For donations, actions)
    secondary: "#f59e0b",

    // ✅ TERTIARY: Emerald (For success, prayers)
    tertiary: "#10b981",

    // ✅ ERROR: Red (Only for errors, destructive actions)
    error: "#ef4444",

    // ✅ ADDED: Outline color for borders
    outline: "#e5e7eb", // Light gray for light mode

    // Background and surface colors
    background: "#f9fafb",
    surface: "#ffffff",
    onSurface: "#1f2937",
    onSurfaceVariant: "#6b7280",

    // Legacy mapping
    text: "#1f2937",
  },
};

export const DarkTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    // ✅ SAME COLOR SCHEME FOR DARK MODE
    primary: "#16a34a",
    secondary: "#f59e0b",
    tertiary: "#10b981",
    error: "#ef4444",

    // ✅ ADDED: Outline color for dark mode
    outline: "#374151", // Dark gray for dark mode

    // Dark mode backgrounds
    background: "#111111",
    surface: "#1f1f1f",
    onSurface: "#ffffff",
    onSurfaceVariant: "#9ca3af",

    text: "#ffffff",
  },
};
