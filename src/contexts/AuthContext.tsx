// src/contexts/AuthContext.tsx - FIXED NAVIGATION
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "../types";

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  clearAllData: () => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const AUTH_TOKEN_KEY = "authToken";
const USER_PROFILE_KEY = "userProfile";

const createUserProfile = (userData: SignupData): UserProfile => ({
  id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: userData.name,
  email: userData.email,
  phone: userData.phone,
  joinDate: new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }),
  preferences: {
    notifications: true,
    prayerReminders: true,
    language: "en",
    theme: "auto",
    qiblaDirection: true,
    vibration: true,
  },
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    token: null,
  });

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      console.log("🔄 Loading auth state from storage...");

      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(USER_PROFILE_KEY),
      ]);

      console.log("📦 Storage data:", {
        token: token ? "YES" : "NO",
        userData: userData ? "YES" : "NO",
      });

      if (token && userData) {
        try {
          const userProfile = JSON.parse(userData);
          console.log("✅ User loaded from storage:", userProfile.name);

          setAuthState({
            isAuthenticated: true,
            user: userProfile,
            isLoading: false,
            token,
          });
        } catch (parseError) {
          console.error("❌ Error parsing user data:", parseError);
          await clearAuthDataOnly();
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } else {
        console.log("❌ No auth data found in storage");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("❌ Error loading auth state:", error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const clearAuthDataOnly = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      console.log("🔐 Auth token cleared (user data preserved)");
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  };

  // ✅ FIXED: Logout navigation - explicitly navigate to profile tab
  const logout = async (): Promise<void> => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      console.log("🚪 Logging out...");

      await new Promise((resolve) => setTimeout(resolve, 800));

      await clearAuthDataOnly();

      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        token: null,
      });

      console.log("✅ Logout successful - User data preserved in storage");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // ✅ FIXED: Explicitly navigate to profile tab
      router.replace("/(tabs)/profile");
    } catch (error) {
      console.error("❌ Logout error:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const clearAllData = async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_PROFILE_KEY]);
      console.log("🧹 All user data cleared from storage");
    } catch (error) {
      console.error("Error clearing all data:", error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("🔐 Attempting login for:", email);

      const existingUserData = await AsyncStorage.getItem(USER_PROFILE_KEY);

      if (!existingUserData) {
        console.log("❌ Login failed: No user account exists");
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return false;
      }

      const existingUser = JSON.parse(existingUserData);
      console.log("📧 Found user in storage:", existingUser.email);

      if (existingUser.email === email) {
        const demoToken = `demo_token_${Date.now()}`;

        console.log("✅ Email matches, generating token...");

        await AsyncStorage.setItem(AUTH_TOKEN_KEY, demoToken);

        setAuthState({
          isAuthenticated: true,
          user: existingUser,
          isLoading: false,
          token: demoToken,
        });

        console.log("🎉 Login successful:", existingUser.name);
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );

        // ✅ FIXED: Navigate to profile after successful login
        router.replace("/(tabs)/profile");
        return true;
      } else {
        console.log("❌ Login failed: Email does not match");
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return false;
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    } finally {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      console.log("👤 Creating new account for:", userData.email);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (
        userData.name &&
        userData.email &&
        userData.phone &&
        userData.password
      ) {
        const userProfile = createUserProfile(userData);
        const demoToken = `demo_token_${Date.now()}`;

        console.log("💾 Saving user to storage...");

        await Promise.all([
          AsyncStorage.setItem(AUTH_TOKEN_KEY, demoToken),
          AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile)),
        ]);

        const verifyToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        const verifyUser = await AsyncStorage.getItem(USER_PROFILE_KEY);

        if (verifyToken && verifyUser) {
          setAuthState({
            isAuthenticated: true,
            user: userProfile,
            isLoading: false,
            token: demoToken,
          });

          console.log("🎉 Signup successful:", userProfile.name);
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );

          // ✅ FIXED: Navigate to profile after successful signup
          router.replace("/(tabs)/profile");
          return true;
        } else {
          console.log("❌ Signup failed: Data not saved properly");
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error
          );
          return false;
        }
      }

      console.log("❌ Signup failed: Invalid form data");
      return false;
    } catch (error) {
      console.error("❌ Signup error:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    } finally {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const updateProfile = async (
    profile: Partial<UserProfile>
  ): Promise<void> => {
    if (!authState.user) return;

    try {
      const updatedUser = { ...authState.user, ...profile };

      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedUser));
      setAuthState((prev) => ({ ...prev, user: updatedUser }));

      console.log("✅ Profile updated:", updatedUser.name);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("❌ Profile update error:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    updateProfile,
    clearAllData,
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
