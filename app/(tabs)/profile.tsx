// app/(tabs)/profile.tsx
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  StatusBar,
  Image,
  RefreshControl,
} from "react-native";
import {
  useTheme,
  Text,
  Card,
  Button,
  Switch,
  List,
  Divider,
  ActivityIndicator,
  Dialog,
  Portal,
  FAB,
} from "react-native-paper";
import { SimpleHeader } from "../../src/components/SimpleHeader";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { UserProfile, ThemeMode } from "../../src/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useTabNavigation } from "../../src/hooks/useTabNavigation";
import { useThemeMode } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; // ✅ ADDED

const USER_AVATAR_KEY = "userAvatar";

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { themeMode, setThemeMode, isDark } = useThemeMode();
  const { user, logout, isLoading: authLoading, isAuthenticated } = useAuth();

  const { isLoading, handleRefresh } = useTabNavigation("profile");

  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // ✅ FIXED: Load avatar every time screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadAvatar = async () => {
        if (isAuthenticated) {
          try {
            console.log("🔄 Loading avatar from storage...");
            const savedAvatar = await AsyncStorage.getItem(USER_AVATAR_KEY);
            console.log("📸 Saved avatar found:", !!savedAvatar);
            
            if (savedAvatar) {
              setAvatarUri(savedAvatar);
            } else {
              // Fallback to default
              setAvatarUri("https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313945/new_pxkwiq.jpg");
            }
          } catch (error) {
            console.log("❌ Error loading avatar:", error);
            setAvatarUri("https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313945/new_pxkwiq.jpg");
          }
        }
      };

      loadAvatar();
    }, [isAuthenticated]) // ✅ Re-run when authentication changes
  );

  // ✅ FIXED: Guest profile with proper avatar
  const guestProfile: UserProfile = {
    id: "guest",
    name: "Guest User",
    email: "Login to view profile",
    phone: "Not available",
    joinDate: "Not available",
    preferences: {
      notifications: true,
      prayerReminders: true,
      language: "en",
      theme: "auto",
      qiblaDirection: true,
      vibration: true,
    },
  };

  const currentProfile = isAuthenticated ? user : guestProfile;

  // ✅ UPDATED: Navigate to real auth screens
  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  const handleSignup = () => {
    router.push("/(auth)/signup");
  };

  const handleEditProfile = () => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please login to edit your profile");
      handleLogin();
      return;
    }
    router.push("/profile/edit");
  };

  const handleLogout = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setLogoutDialogVisible(true);
  };

  const confirmLogout = async () => {
    setLogoutDialogVisible(false);
    await logout();
  };

  const onRefresh = () => {
    handleRefresh();
  };

  // ✅ GET AVATAR SOURCE - FIXED with proper fallbacks
  const getAvatarSource = () => {
    if (!isAuthenticated) {
      return "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1761436552/profile_o1gfxf.png";
    }
    
    // Return saved avatar or default
    return avatarUri || "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313945/new_pxkwiq.jpg";
  };

  if (isLoading) {
    return (
      <Container padding={false}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          translucent
          backgroundColor="transparent"
        />
        <SimpleHeader title="Profile" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.loadingSpinner}
          />
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            Loading Profile...
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container padding={false}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <SimpleHeader title="Profile" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.content}>
          {/* Profile Header */}
          <Section title="Profile">
            <Card style={styles.profileCard}>
              <Card.Content style={styles.profileContent}>
                <View style={styles.avatarSection}>
                  <View style={styles.avatarContainer}>
                    {/* ✅ UPDATED: Dynamic avatar source with key for force re-render */}
                    <Image
                      key={avatarUri} // ✅ Force re-render when avatar changes
                      source={{
                        uri: getAvatarSource(),
                      }}
                      style={styles.avatarImage}
                      onError={(e) => {
                        console.log("❌ Image load error:", e.nativeEvent.error);
                        // Fallback to default
                        setAvatarUri("https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313945/new_pxkwiq.jpg");
                      }}
                    />
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: isAuthenticated
                            ? theme.colors.primary
                            : theme.colors.onSurfaceVariant,
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {isAuthenticated ? "✓" : "?"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.profileInfo}>
                    <Text
                      style={[
                        styles.profileName,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {currentProfile?.name}
                    </Text>
                    <Text
                      style={[
                        styles.joinDate,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {isAuthenticated
                        ? `Member since ${currentProfile?.joinDate}`
                        : "Please login to access your profile"}
                    </Text>
                  </View>
                </View>

                {/* ✅ UPDATED: Real auth navigation buttons */}
                {!isAuthenticated && (
                  <View style={styles.authButtons}>
                    <Button
                      mode="contained"
                      onPress={handleLogin}
                      style={styles.authButton}
                      contentStyle={styles.authButtonContent}
                      icon="login"
                    >
                      Sign In
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={handleSignup}
                      style={styles.authButton}
                      contentStyle={styles.authButtonContent}
                      icon="account-plus"
                    >
                      Create Account
                    </Button>
                  </View>
                )}
              </Card.Content>
            </Card>
          </Section>

          {/* Profile Information - Only show when authenticated */}
          {isAuthenticated && (
            <Section title="Profile Information">
              <Card style={styles.infoCard}>
                <Card.Content>
                  <List.Item
                    title="Email"
                    description={currentProfile?.email}
                    left={(props) => <List.Icon {...props} icon="email" />}
                  />
                  <Divider />
                  <List.Item
                    title="Phone"
                    description={currentProfile?.phone}
                    left={(props) => <List.Icon {...props} icon="phone" />}
                  />
                  <Divider />
                  {/* <List.Item
                    title="Member ID"
                    description={currentProfile?.id}
                    left={(props) => <List.Icon {...props} icon="identifier" />}
                  /> */}
                </Card.Content>
              </Card>
            </Section>
          )}

          {/* Preferences - Only show when authenticated */}
          {isAuthenticated && (
            <Section title="Preferences">
              <Card style={styles.preferencesCard}>
                <Card.Content>
                  <List.Item
                    title="Push Notifications"
                    description="Receive important updates and reminders"
                    left={(props) => <List.Icon {...props} icon="bell" />}
                    right={(props) => (
                      <Switch
                        value={
                          currentProfile?.preferences.notifications || false
                        }
                        onValueChange={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                      />
                    )}
                  />
                  <Divider />
                  <List.Item
                    title="Prayer Reminders"
                    description="Get notified for prayer times"
                    left={(props) => <List.Icon {...props} icon="clock" />}
                    right={(props) => (
                      <Switch
                        value={
                          currentProfile?.preferences.prayerReminders || false
                        }
                        onValueChange={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                      />
                    )}
                  />
                  <Divider />
                  <List.Item
                    title="Dark Mode"
                    description="Toggle between light and dark themes"
                    left={(props) => (
                      <List.Icon {...props} icon="theme-light-dark" />
                    )}
                    right={(props) => (
                      <Switch
                        value={isDark}
                        onValueChange={(isDarkMode) => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setThemeMode(isDarkMode ? "dark" : "light");
                        }}
                      />
                    )}
                  />
                </Card.Content>
              </Card>
            </Section>
          )}

          {/* Quick Actions - Show for both authenticated and guest */}
          <Section title="Quick Actions">
            <Card style={styles.actionsCard}>
              <Card.Content>
                <Button
                  mode="outlined"
                  icon="help-circle"
                  onPress={() =>
                    Alert.alert("Help & Support", "Contacting support...")
                  }
                  style={styles.actionButton}
                  contentStyle={styles.actionButtonContent}
                >
                  Help & Support
                </Button>
                <Button
                  mode="outlined"
                  icon="information"
                  onPress={() =>
                    Alert.alert(
                      "About",
                      "Khiarpara Jame Masjid App\n\nA modern app for mosque community."
                    )
                  }
                  style={styles.actionButton}
                  contentStyle={styles.actionButtonContent}
                >
                  About App
                </Button>
              </Card.Content>
            </Card>
          </Section>

          {/* Logout Button - Only show when authenticated */}
          {isAuthenticated && (
            <Button
              mode="contained"
              buttonColor={theme.colors.error}
              onPress={handleLogout}
              icon={authLoading ? "loading" : "logout"}
              style={styles.logoutButton}
              contentStyle={styles.logoutButtonContent}
              disabled={authLoading}
            >
              {authLoading ? "Logging Out..." : "Logout"}
            </Button>
          )}
        </View>
      </ScrollView>

      {/* ✅ FIXED: FAB Button for Edit Profile */}
      {isAuthenticated && (
        <FAB
          icon="pencil"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={handleEditProfile}
          color="white"
          label="Edit Profile"
        />
      )}

      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={logoutDialogVisible}
          onDismiss={() => setLogoutDialogVisible(false)}
        >
          <Dialog.Icon icon="alert" size={40} />
          <Dialog.Title style={styles.dialogTitle}>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to logout? You'll need to login again to
              access your account.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              onPress={confirmLogout}
              mode="contained"
              buttonColor={theme.colors.error}
            >
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Container>
  );
}


const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  profileCard: {
    borderRadius: 20,
  },
  profileContent: {
    paddingVertical: 8,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  statusBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
  },
  // ✅ UPDATED: Auth buttons styles
  authButtons: {
    gap: 12,
  },
  authButton: {
    borderRadius: 12,
  },
  authButtonContent: {
    paddingVertical: 8,
  },
  infoCard: {
    borderRadius: 16,
  },
  preferencesCard: {
    borderRadius: 16,
  },
  actionsCard: {
    borderRadius: 16,
  },
  actionButton: {
    marginBottom: 8,
    borderRadius: 8,
  },
  actionButtonContent: {
    paddingVertical: 6,
  },
  logoutButton: {
    borderRadius: 12,
    marginTop: 8,
  },
  logoutButtonContent: {
    paddingVertical: 6,
  },
  // ✅ REMOVED: Old edit button styles

  // ✅ ADDED: FAB styles (like donations screen)
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    zIndex: 1000,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  dialogTitle: {
    textAlign: "center",
    marginTop: 8,
  },
});
