//app/(tabs)/profile.tsx
import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import {
  useTheme,
  Text,
  Card,
  Button,
  Switch,
  List,
  Divider,
  Avatar,
} from "react-native-paper";
import { Header } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { StatsGrid } from "../../src/components/StatsGrid";
import { UserProfile } from "../../src/types";

const initialProfile: UserProfile = {
  id: "1",
  name: "Ahmed Abdullah",
  email: "ahmed.abdullah@example.com",
  phone: "+1 (555) 123-4567",
  joinDate: "January 2024",
  role: "member",
  preferences: {
    notifications: true,
    prayerReminders: true,
    language: "en",
    theme: "auto",
  },
};

export default function ProfileScreen() {
  const theme = useTheme();
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [editing, setEditing] = useState(false);

  const userStats = [
    {
      label: "Prayers",
      value: "42",
      icon: "🕌",
      color: theme.colors.primary,
    },
    {
      label: "Donations",
      value: "8",
      icon: "💰",
      color: theme.colors.secondary,
    },
    {
      label: "Events",
      value: "12",
      icon: "🎪",
      color: "#8b5cf6",
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
    // In a real app, this would open an edit form
    Alert.alert("Edit Profile", "Profile editing would open here");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () =>
          Alert.alert("Logged Out", "You have been successfully logged out"),
      },
    ]);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "#ef4444";
      case "volunteer":
        return "#f59e0b";
      default:
        return "#16a34a";
    }
  };

  return (
    <Container>
      <Header
        title="Profile"
        subtitle="Manage your account and preferences"
        rightComponent={
          <Button mode="text" onPress={handleEditProfile} icon="pencil" compact>
            Edit
          </Button>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <Section>
          <Card style={styles.profileCard}>
            <Card.Content style={styles.profileContent}>
              <View style={styles.avatarSection}>
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
                <View style={styles.profileInfo}>
                  <Text
                    style={[
                      styles.profileName,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {profile.name}
                  </Text>
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

        {/* Activity Stats */}
        <Section title="Your Activity">
          <StatsGrid stats={userStats} />
        </Section>

        {/* Profile Information */}
        <Section title="Profile Information">
          <Card style={styles.infoCard}>
            <Card.Content>
              <List.Item
                title="Email"
                description={profile.email}
                left={(props) => <List.Icon {...props} icon="email" />}
                right={(props) => <List.Icon {...props} icon="content-copy" />}
                onPress={() => Alert.alert("Email", `Copied: ${profile.email}`)}
              />
              <Divider />
              <List.Item
                title="Phone"
                description={profile.phone}
                left={(props) => <List.Icon {...props} icon="phone" />}
                right={(props) => <List.Icon {...props} icon="content-copy" />}
                onPress={() => Alert.alert("Phone", `Copied: ${profile.phone}`)}
              />
              <Divider />
              <List.Item
                title="Member ID"
                description={profile.id}
                left={(props) => <List.Icon {...props} icon="identifier" />}
                right={(props) => <List.Icon {...props} icon="content-copy" />}
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
                title="Language"
                description="English"
                left={(props) => <List.Icon {...props} icon="translate" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() =>
                  Alert.alert("Language", "Language settings would open here")
                }
              />
              <Divider />
              <List.Item
                title="Theme"
                description="Automatic"
                left={(props) => (
                  <List.Icon {...props} icon="theme-light-dark" />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
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
              >
                Privacy & Security
              </Button>
            </Card.Content>
          </Card>
        </Section>

        {/* Logout Button */}
        <Button
          mode="contained"
          buttonColor={theme.colors.error}
          onPress={handleLogout}
          icon="logout"
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  profileCard: {
    borderRadius: 16,
  },
  profileContent: {
    paddingVertical: 8,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 4,
  },
  roleText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  joinDate: {
    fontSize: 14,
  },
  infoCard: {
    borderRadius: 12,
  },
  preferencesCard: {
    borderRadius: 12,
  },
  actionsCard: {
    borderRadius: 12,
  },
  actionButton: {
    marginBottom: 8,
    borderRadius: 8,
  },
  logoutButton: {
    borderRadius: 8,
    marginTop: 8,
  },
});
