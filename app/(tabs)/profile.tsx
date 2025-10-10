// app/(tabs)/profile.tsx
import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Alert, StatusBar } from "react-native";
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
  ProgressBar,
  ToggleButton,
  FAB,
} from "react-native-paper";
import { Header } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { StatsGrid } from "../../src/components/StatsGrid";
import { UserProfile, PrayerProgress, Achievement } from "../../src/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

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
    language: "en",
    theme: "auto",
    qiblaDirection: true,
    vibration: true,
  },
};

const prayerProgress: PrayerProgress[] = [
  { name: "Fajr", completed: true, time: "5:30 AM" },
  { name: "Dhuhr", completed: true, time: "12:30 PM" },
  { name: "Asr", completed: false, time: "4:15 PM" },
  { name: "Maghrib", completed: false, time: "6:45 PM" },
  { name: "Isha", completed: false, time: "8:00 PM" },
];

const achievements: Achievement[] = [
  {
    id: "1",
    title: "Prayer Warrior",
    description: "Complete 100 prayers",
    icon: "🕌",
    progress: 100,
    total: 100,
    unlocked: true,
    date: "2024-01-10",
  },
  {
    id: "2",
    title: "Regular Donor",
    description: "Donate for 3 consecutive months",
    icon: "💰",
    progress: 2,
    total: 3,
    unlocked: false,
    date: "",
  },
  {
    id: "3",
    title: "Quran Reader",
    description: "Read Quran for 30 days straight",
    icon: "📖",
    progress: 15,
    total: 30,
    unlocked: false,
    date: "",
  },
  {
    id: "4",
    title: "Community Helper",
    description: "Attend 10 community events",
    icon: "👥",
    progress: 7,
    total: 10,
    unlocked: false,
    date: "",
  },
];

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [activeTab, setActiveTab] = useState<
    "overview" | "achievements" | "settings"
  >("overview");
  const [editing, setEditing] = useState(false);

  const userStats = [
    {
      label: "Prayer Streak",
      value: profile.prayerStreak?.toString() || "0",
      icon: "🔥",
      color: theme.colors.primary,
      subtitle: "days",
    },
    {
      label: "Total Prayers",
      value: profile.totalPrayers?.toString() || "0",
      icon: "🕌",
      color: theme.colors.secondary,
      subtitle: "prayers",
    },
    {
      label: "Donations",
      value: "8",
      icon: "💰",
      color: "#8b5cf6",
      subtitle: "this month",
    },
  ];

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
  };

  const handleEditProfile = () => {
    setEditing(true);
    Alert.alert("Edit Profile", "Profile editing would open here");
  };

  const handleLogout = async() => {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        );
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning
          );
          Alert.alert("Logged Out", "You have been successfully logged out");
        },
      },
    ]);
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

  const completedPrayers = prayerProgress.filter((p) => p.completed).length;
  const progressPercentage = completedPrayers / prayerProgress.length;

  return (
    <Container padding={false}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <Header
        title="Profile"
        subtitle="Manage your account and preferences"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={styles.content}>
          {/* Profile Header */}
          <Section title="Profile">
            <Card style={styles.profileCard}>
              <Card.Content style={styles.profileContent}>
                <View style={styles.avatarSection}>
                  <View style={styles.avatarContainer}>
                    <Avatar.Text
                      size={80}
                      label={profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                      style={[
                        styles.avatar,
                        { backgroundColor: theme.colors.primary },
                      ]}
                      labelStyle={styles.avatarText}
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

          {/* Navigation Tabs */}
          <Section title="">
            <Card style={styles.tabsCard}>
              <Card.Content style={styles.tabsContent}>
                <ToggleButton.Row
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as any)}
                  style={styles.tabsContainer}
                >
                  <ToggleButton
                    icon="chart-box"
                    value="overview"
                    style={[
                      styles.tabButton,
                      activeTab === "overview" && {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                    iconColor={
                      activeTab === "overview"
                        ? "white"
                        : theme.colors.onSurface
                    }
                  />
                  <ToggleButton
                    icon="trophy"
                    value="achievements"
                    style={[
                      styles.tabButton,
                      activeTab === "achievements" && {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                    iconColor={
                      activeTab === "achievements"
                        ? "white"
                        : theme.colors.onSurface
                    }
                  />
                  <ToggleButton
                    icon="cog"
                    value="settings"
                    style={[
                      styles.tabButton,
                      activeTab === "settings" && {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                    iconColor={
                      activeTab === "settings"
                        ? "white"
                        : theme.colors.onSurface
                    }
                  />
                </ToggleButton.Row>
              </Card.Content>
            </Card>
          </Section>

          {activeTab === "overview" && (
            <>
              {/* Activity Stats */}
              <Section title="Your Activity">
                <StatsGrid stats={userStats} />
              </Section>

              {/* Today's Prayer Progress */}
              <Section
                title="Today's Prayers"
                subtitle={`${completedPrayers}/${prayerProgress.length} completed`}
              >
                <Card style={styles.prayerCard}>
                  <Card.Content>
                    <View style={styles.progressHeader}>
                      <Text
                        style={[
                          styles.progressTitle,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Prayer Progress
                      </Text>
                      <Text
                        style={[
                          styles.progressPercentage,
                          { color: theme.colors.primary },
                        ]}
                      >
                        {Math.round(progressPercentage * 100)}%
                      </Text>
                    </View>
                    <ProgressBar
                      progress={progressPercentage}
                      color={theme.colors.primary}
                      style={styles.progressBar}
                    />
                    <View style={styles.prayerList}>
                      {prayerProgress.map((prayer, index) => (
                        <View key={prayer.name} style={styles.prayerItem}>
                          <View style={styles.prayerInfo}>
                            <View
                              style={[
                                styles.prayerStatus,
                                {
                                  backgroundColor: prayer.completed
                                    ? theme.colors.primary
                                    : theme.colors.surfaceVariant,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.prayerStatusText,
                                  {
                                    color: prayer.completed
                                      ? "white"
                                      : theme.colors.onSurfaceVariant,
                                  },
                                ]}
                              >
                                {prayer.completed ? "✓" : "○"}
                              </Text>
                            </View>
                            <Text
                              style={[
                                styles.prayerName,
                                {
                                  color: prayer.completed
                                    ? theme.colors.onSurface
                                    : theme.colors.onSurfaceVariant,
                                  fontWeight: prayer.completed ? "600" : "400",
                                },
                              ]}
                            >
                              {prayer.name}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.prayerTime,
                              { color: theme.colors.onSurfaceVariant },
                            ]}
                          >
                            {prayer.time}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </Card.Content>
                </Card>
              </Section>
            </>
          )}

          {activeTab === "achievements" && (
            <Section title="Achievements">
              <Card style={styles.achievementsCard}>
                <Card.Content>
                  <View style={styles.achievementsGrid}>
                    {achievements.map((achievement) => (
                      <Card
                        key={achievement.id}
                        style={[
                          styles.achievementCard,
                          achievement.unlocked && {
                            backgroundColor: theme.colors.primaryContainer,
                          },
                        ]}
                        mode="elevated"
                      >
                        <Card.Content style={styles.achievementContent}>
                          <Text style={styles.achievementIcon}>
                            {achievement.icon}
                          </Text>
                          <View style={styles.achievementInfo}>
                            <Text
                              style={[
                                styles.achievementTitle,
                                { color: theme.colors.onSurface },
                              ]}
                            >
                              {achievement.title}
                            </Text>
                            <Text
                              style={[
                                styles.achievementDescription,
                                { color: theme.colors.onSurfaceVariant },
                              ]}
                            >
                              {achievement.description}
                            </Text>
                            {!achievement.unlocked && (
                              <View style={styles.progressContainer}>
                                <ProgressBar
                                  progress={
                                    achievement.progress / achievement.total
                                  }
                                  color={theme.colors.primary}
                                  style={styles.achievementProgress}
                                />
                                <Text
                                  style={[
                                    styles.progressText,
                                    { color: theme.colors.onSurfaceVariant },
                                  ]}
                                >
                                  {achievement.progress}/{achievement.total}
                                </Text>
                              </View>
                            )}
                            {achievement.unlocked && (
                              <View style={styles.unlockedBadge}>
                                <Text style={styles.unlockedText}>
                                  Unlocked
                                </Text>
                              </View>
                            )}
                          </View>
                        </Card.Content>
                      </Card>
                    ))}
                  </View>
                </Card.Content>
              </Card>
            </Section>
          )}

          {activeTab === "settings" && (
            <>
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
                      left={(props) => (
                        <List.Icon {...props} icon="identifier" />
                      )}
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
                    <List.Item
                      title="Language"
                      description="English"
                      left={(props) => (
                        <List.Icon {...props} icon="translate" />
                      )}
                      right={(props) => (
                        <List.Icon {...props} icon="chevron-right" />
                      )}
                      onPress={() =>
                        Alert.alert(
                          "Language",
                          "Language settings would open here"
                        )
                      }
                    />
                    <Divider />
                    <List.Item
                      title="Theme"
                      description="Automatic"
                      left={(props) => (
                        <List.Icon {...props} icon="theme-light-dark" />
                      )}
                      right={(props) => (
                        <List.Icon {...props} icon="chevron-right" />
                      )}
                      onPress={() =>
                        Alert.alert("Theme", "Theme settings would open here")
                      }
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
                        Alert.alert(
                          "Privacy",
                          "Privacy settings would open here"
                        )
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
            </>
          )}

          {/* Logout Button */}
          <Button
            mode="contained"
            buttonColor={theme.colors.error}
            onPress={handleLogout}
            icon="logout"
            style={styles.logoutButton}
            contentStyle={styles.logoutButtonContent}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
      <FAB
        icon="pencil"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push("/donation/type")} // Changed this line
        color="white"
        label="Edit"
      />
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
  avatar: {
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
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
  editButton: {
    borderRadius: 8,
  },
  tabsCard: {
    borderRadius: 16,
  },
  tabsContent: {
    paddingVertical: 8,
  },
  tabsContainer: {
    justifyContent: "center",
  },
  tabButton: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  prayerCard: {
    borderRadius: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 16,
  },
  prayerList: {
    gap: 12,
  },
  prayerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prayerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  prayerStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  prayerStatusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  prayerName: {
    fontSize: 16,
    flex: 1,
  },
  prayerTime: {
    fontSize: 14,
  },
  achievementsCard: {
    borderRadius: 16,
  },
  achievementsGrid: {
    gap: 12,
  },
  achievementCard: {
    borderRadius: 12,
  },
  achievementContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    marginBottom: 8,
  },
  progressContainer: {
    gap: 4,
  },
  achievementProgress: {
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
  },
  unlockedBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#16a34a",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  unlockedText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
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
});
