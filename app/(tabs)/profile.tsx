// app/(tabs)/profile.tsx - SIMPLIFIED VERSION (remove all type casting)
import React, { useState } from "react";
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
  Avatar,
  Chip,
  ToggleButton,
  FAB,
  ActivityIndicator,
  Menu,
  Dialog,
  Portal,
} from "react-native-paper";
import { SimpleHeader } from "../../src/components/SimpleHeader";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { UserProfile, ThemeMode, Language } from "../../src/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useTabNavigation } from "../../src/hooks/useTabNavigation";
import { useThemeMode } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";

// ✅ SIMPLIFIED: No type casting needed now
const initialProfile: UserProfile = {
  id: "1",
  name: "Md.Amdadul Haq Milon",
  email: "milon.s2k21@gmail.com",
  phone: "01575494393",
  joinDate: "January 2020",
  role: "member",
  membership: "Premium Member",
  prayerStreak: 12,
  totalPrayers: 156,
  preferences: {
    notifications: true,
    prayerReminders: true,
    darkMode: false,
    language: "en", // ✅ No casting needed
    theme: "auto", // ✅ No casting needed
    qiblaDirection: true,
    vibration: true,
  },
};

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { themeMode, setThemeMode, isDark } = useThemeMode();
  const { logout, isLoading: authLoading } = useAuth();
  const { isLoading, handleRefresh } = useTabNavigation("profile");

  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [editing, setEditing] = useState(false);
  const [themeMenuVisible, setThemeMenuVisible] = useState(false);
  const [languageMenuVisible, setLanguageMenuVisible] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  React.useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: themeMode,
      },
    }));
  }, [themeMode]);

  const handlePreferenceChange = (
    key: keyof UserProfile["preferences"],
    value: any
  ) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));

    if (key === "theme") {
      setThemeMode(value); // ✅ No casting needed
    }
  };

  const handleEditProfile = () => {
    setEditing(true);
    Alert.alert("Edit Profile", "Profile editing would open here");
  };

  const handleLogout = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setLogoutDialogVisible(true);
  };

  const confirmLogout = async () => {
    setLogoutDialogVisible(false);
    await logout();
    Alert.alert("Logged Out", "You have been successfully logged out", [
      {
        text: "OK",
        onPress: () => {
          console.log("Navigate to login screen");
        },
      },
    ]);
  };

  const cancelLogout = () => {
    setLogoutDialogVisible(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "#ef4444";
      case "volunteer":
        return "#f59e0b";
      case "premium":
        return "#8b5cf6";
      default:
        return "#16a34a";
    }
  };

  const getThemeDisplayName = (theme: ThemeMode) => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "auto":
        return "Auto (System)";
      default:
        return "Auto";
    }
  };

  const getLanguageDisplayName = (language: Language) => {
    switch (language) {
      case "en":
        return "English";
      case "bn":
        return "বাংলা";
      case "ar":
        return "العربية";
      default:
        return "English";
    }
  };

  const onRefresh = () => {
    handleRefresh();
  };

  const handleBackPress = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Container padding={false}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          translucent
          backgroundColor="transparent"
        />
        <SimpleHeader 
        title="Profile"
        showBackButton={true}
        onBackPress={handleBackPress}
      />
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

      <SimpleHeader
        title="Profile"
        showBackButton={true}
        onBackPress={handleBackPress}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
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
                    <Image
                      source={{
                        uri: "https://res.cloudinary.com/dx5b8xdgt/image/upload/v1760313945/new_pxkwiq.jpg",
                      }}
                      style={styles.avatarImage}
                    />
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    >
                      <Text style={styles.statusText}>✓</Text>
                    </View>
                  </View>
                  <View style={styles.profileInfo}>
                    <Text
                      style={[
                        styles.profileName,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {profile.name}
                    </Text>
                    <View style={styles.badgeContainer}>
                      <View
                        style={[
                          styles.roleBadge,
                          { backgroundColor: getRoleBadgeColor(profile.role) },
                        ]}
                      >
                        <Text style={styles.roleText}>
                          {profile.role.charAt(0).toUpperCase() +
                            profile.role.slice(1)}
                        </Text>
                      </View>
                      {profile.membership && (
                        <Chip
                          mode="flat"
                          style={[
                            styles.membershipChip,
                            { backgroundColor: theme.colors.surfaceVariant },
                          ]}
                          textStyle={[
                            styles.membershipText,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                        >
                          {profile.membership}
                        </Chip>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.joinDate,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      Member since {profile.joinDate}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </Section>

          {/* Profile Information */}
          <Section title="Profile Information">
            <Card style={styles.infoCard}>
              <Card.Content>
                <List.Item
                  title="Email"
                  description={profile.email}
                  left={(props) => <List.Icon {...props} icon="email" />}
                  right={(props) => (
                    <List.Icon {...props} icon="content-copy" />
                  )}
                  onPress={() =>
                    Alert.alert("Email", `Copied: ${profile.email}`)
                  }
                />
                <Divider />
                <List.Item
                  title="Phone"
                  description={profile.phone}
                  left={(props) => <List.Icon {...props} icon="phone" />}
                  right={(props) => (
                    <List.Icon {...props} icon="content-copy" />
                  )}
                  onPress={() =>
                    Alert.alert("Phone", `Copied: ${profile.phone}`)
                  }
                />
                <Divider />
                <List.Item
                  title="Member ID"
                  description={profile.id}
                  left={(props) => <List.Icon {...props} icon="identifier" />}
                  right={(props) => (
                    <List.Icon {...props} icon="content-copy" />
                  )}
                  onPress={() =>
                    Alert.alert("Member ID", `Copied: ${profile.id}`)
                  }
                />
              </Card.Content>
            </Card>
          </Section>

          {/* Preferences */}
          <Section title="Preferences">
            <Card style={styles.preferencesCard}>
              <Card.Content>
                <List.Item
                  title="Push Notifications"
                  description="Receive important updates and reminders"
                  left={(props) => <List.Icon {...props} icon="bell" />}
                  right={(props) => (
                    <Switch
                      value={profile.preferences.notifications}
                      onValueChange={(value) =>
                        handlePreferenceChange("notifications", value)
                      }
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
                      value={profile.preferences.prayerReminders}
                      onValueChange={(value) =>
                        handlePreferenceChange("prayerReminders", value)
                      }
                    />
                  )}
                />
                <Divider />
                <List.Item
                  title="Qibla Direction"
                  description="Show qibla compass in prayer screen"
                  left={(props) => <List.Icon {...props} icon="compass" />}
                  right={(props) => (
                    <Switch
                      value={profile.preferences.qiblaDirection}
                      onValueChange={(value) =>
                        handlePreferenceChange("qiblaDirection", value)
                      }
                    />
                  )}
                />
                <Divider />
                <List.Item
                  title="Haptic Feedback"
                  description="Vibration for notifications"
                  left={(props) => <List.Icon {...props} icon="vibrate" />}
                  right={(props) => (
                    <Switch
                      value={profile.preferences.vibration}
                      onValueChange={(value) =>
                        handlePreferenceChange("vibration", value)
                      }
                    />
                  )}
                />
                <Divider />
                {/* Language Menu */}
                <Menu
                  visible={languageMenuVisible}
                  onDismiss={() => setLanguageMenuVisible(false)}
                  anchor={
                    <List.Item
                      title="Language"
                      description={getLanguageDisplayName(
                        profile.preferences.language
                      )}
                      left={(props) => (
                        <List.Icon {...props} icon="translate" />
                      )}
                      right={(props) => (
                        <List.Icon {...props} icon="chevron-down" />
                      )}
                      onPress={() => setLanguageMenuVisible(true)}
                    />
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      handlePreferenceChange("language", "en"); // ✅ No casting
                      setLanguageMenuVisible(false);
                    }}
                    title="English"
                  />
                  <Menu.Item
                    onPress={() => {
                      handlePreferenceChange("language", "bn"); // ✅ No casting
                      setLanguageMenuVisible(false);
                    }}
                    title="বাংলা"
                  />
                  <Menu.Item
                    onPress={() => {
                      handlePreferenceChange("language", "ar"); // ✅ No casting
                      setLanguageMenuVisible(false);
                    }}
                    title="العربية"
                  />
                </Menu>
                <Divider />
                {/* Theme Toggle */}
                <List.Item
                  title="Dark Mode"
                  description="Toggle between light and dark themes"
                  left={(props) => (
                    <List.Icon {...props} icon="theme-light-dark" />
                  )}
                  right={(props) => (
                    <Switch
                      value={themeMode === "dark"}
                      onValueChange={(isDarkMode) => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        handlePreferenceChange(
                          "theme",
                          isDarkMode ? "dark" : "light"
                        );
                      }}
                    />
                  )}
                />
              </Card.Content>
            </Card>
          </Section>

          {/* Quick Actions */}
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
                      "Mosque Management System v2.0\n\nA modern app for mosque community management."
                    )
                  }
                  style={styles.actionButton}
                  contentStyle={styles.actionButtonContent}
                >
                  About App
                </Button>
                <Button
                  mode="outlined"
                  icon="shield-account"
                  onPress={() =>
                    Alert.alert("Privacy", "Privacy settings would open here")
                  }
                  style={styles.actionButton}
                  contentStyle={styles.actionButtonContent}
                >
                  Privacy & Security
                </Button>
                <Button
                  mode="outlined"
                  icon="export"
                  onPress={() =>
                    Alert.alert("Export Data", "Exporting your data...")
                  }
                  style={styles.actionButton}
                  contentStyle={styles.actionButtonContent}
                >
                  Export Data
                </Button>
              </Card.Content>
            </Card>
          </Section>

          {/* Logout Button */}
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
        </View>
      </ScrollView>

      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog visible={logoutDialogVisible} onDismiss={cancelLogout}>
          <Dialog.Icon icon="alert" size={40} />
          <Dialog.Title style={styles.dialogTitle}>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to logout? You'll need to login again to
              access your account.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={cancelLogout}>Cancel</Button>
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

      <FAB
        icon="pencil"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleEditProfile}
        color="white"
        label="Edit"
      />
    </Container>
  );
}

// Keep the same styles object...
const styles = StyleSheet.create({
  // ... (keep all the same styles from previous version)
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
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
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
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  roleText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  membershipChip: {
    marginBottom: 4,
  },
  membershipText: {
    fontSize: 11,
    fontWeight: "500",
  },
  joinDate: {
    fontSize: 14,
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  dialogTitle: {
    textAlign: "center",
    marginTop: 8,
  },
});
