// ✅ UPDATED: src/contexts/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import { ThemeMode } from "../types";

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("auto");

  const isDark =
    themeMode === "dark" ||
    (themeMode === "auto" && systemColorScheme === "dark");

  // ✅ ADDED: Theme toggle function
  const toggleTheme = () => {
    setThemeMode((current) => {
      if (current === "auto") return "dark";
      if (current === "dark") return "light";
      return "auto";
    });
  };

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        // In real app, load from AsyncStorage
        // const savedTheme = await AsyncStorage.getItem('themeMode');
        // if (savedTheme) {
        //   setThemeMode(savedTheme as ThemeMode);
        // }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        // await AsyncStorage.setItem('themeMode', themeMode);
      } catch (error) {
        console.error("Error saving theme preference:", error);
      }
    };

    saveThemePreference();
  }, [themeMode]);

  const value = {
    themeMode,
    setThemeMode,
    isDark,
    toggleTheme, // ✅ ADDED
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeMode = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return context;
};
