// src/components/Header.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showProfile?: boolean;
  onProfilePress?: () => void;
  showNotifications?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightComponent,
  showBackButton = false,
  onBackPress,
  showProfile = true,
  onProfilePress,
  showNotifications = true,
  notificationCount = 0,
  onNotificationPress,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={["#16a34a", "#0d8a3a", "#0a722e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientHeader}
      >
        {/* Header Content */}
        <View style={styles.headerContent}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {showBackButton ? (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onBackPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.logoContainer}>
                <MaterialCommunityIcons name="mosque" size={28} color="white" />
              </View>
            )}

            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            {rightComponent ? (
              rightComponent
            ) : (
              <>
                {/* Notification Bell */}
                {showNotifications && (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={onNotificationPress}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialCommunityIcons
                      name="bell-outline"
                      size={22}
                      color="white"
                    />
                    {notificationCount > 0 && (
                      <View style={styles.notificationBadge}>
                        <Text style={styles.badgeText}>
                          {notificationCount > 9 ? "9+" : notificationCount}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )}

                {/* Profile Icon */}
                {showProfile && (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={onProfilePress}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialCommunityIcons
                      name="account-circle"
                      size={28}
                      color="white"
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>

        {/* Bottom Curve Decoration */}
        <View style={styles.headerCurve} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    // This container handles the safe area
  },
  gradientHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    // Shadow for Android
    elevation: 8,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 56,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
    fontWeight: "500",
    includeFontPadding: false,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#ef4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    includeFontPadding: false,
  },
  headerCurve: {
    position: "absolute",
    bottom: -15,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});

// Export the same components as before
export const HomeHeader: React.FC<{
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
}> = ({ onProfilePress, onNotificationPress, notificationCount = 0 }) => {
  return (
    <Header
      title="Khiarpara Jame Mosque"
      subtitle="Welcome to your spiritual hub"
      showProfile={true}
      showNotifications={true}
      onProfilePress={onProfilePress}
      onNotificationPress={onNotificationPress}
      notificationCount={notificationCount}
    />
  );
};

export const SimpleHeader: React.FC<{
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}> = ({ title, showBackButton, onBackPress }) => {
  return (
    <Header
      title={title}
      showBackButton={showBackButton}
      onBackPress={onBackPress}
      showProfile={false}
      showNotifications={false}
    />
  );
};
