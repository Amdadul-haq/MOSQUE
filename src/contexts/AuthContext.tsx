// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Start as authenticated for demo
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real app, you would call your authentication API
      // const response = await api.login(email, password);
      // if (response.success) {
      //   setIsAuthenticated(true);
      //   await AsyncStorage.setItem('authToken', response.token);
      //   return true;
      // }

      // For demo, always return true
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, you would call your logout API
      // await api.logout();
      // await AsyncStorage.removeItem('authToken');
      // await AsyncStorage.removeItem('userProfile');

      setIsAuthenticated(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate to login screen (you'll need to create this)
      // router.replace('/auth/login');

      // For now, just show alert since we don't have login screen
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
