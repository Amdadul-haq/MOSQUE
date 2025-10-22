// app/notifications/index.tsx
import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useTheme, Card, ActivityIndicator } from "react-native-paper";
import { Container } from "../../src/components/common/Container";
import { SimpleHeader } from "../../src/components/SimpleHeader";
import { useNotifications } from "../../src/contexts/NotificationContext";
import { useVisitedScreens } from "../../src/contexts/VisitedScreensContext";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Notification } from "../../src/types";
import { useLoading } from "../../src/hooks/useLoading";

export default function NotificationsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { notificationState, markAsRead, markAllAsRead } = useNotifications();

  // ✅ FIXED: Use persistent visited screens context
  const { hasVisitedScreen, markScreenAsVisited } = useVisitedScreens();
  const hasVisited = hasVisitedScreen("notifications");

  // ✅ Use loading hook - only load if not visited before
  const { isLoading, startLoading, stopLoading } = useLoading(!hasVisited);

  // ✅ Handle initial loading only on first visit
  useEffect(() => {
    if (!hasVisited) {
      // Mark as visited immediately but show loading for a bit
      markScreenAsVisited("notifications");

      // Simulate initial data loading
      const timer = setTimeout(() => {
        stopLoading();
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // If already visited, ensure loading is stopped
      if (isLoading) {
        stopLoading();
      }
    }
  }, [hasVisited, markScreenAsVisited, stopLoading, isLoading]);

  const onRefresh = () => {
    startLoading();
    // Simulate API refresh
    setTimeout(() => {
      stopLoading();
    }, 5000);
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    router.push({
      pathname: "/notifications/[id]",
      params: { id: notification.id },
    });
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "donation":
        return { name: "heart", color: "#ef4444" };
      case "prayer":
        return { name: "clock", color: "#16a34a" };
      case "event":
        return { name: "calendar", color: "#8b5cf6" };
      case "urgent":
        return { name: "alert", color: "#dc2626" };
      case "warning":
        return { name: "alert-circle", color: "#f59e0b" };
      default:
        return { name: "information", color: theme.colors.primary };
    }
  };

  const formatDate = (date: string, time: string) => {
    const notificationDate = new Date(`${date}T${time}`);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - notificationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays > 1) return `${diffDays} days ago`;

    return "Today";
  };

const handleBackPress = () => {
  router.back();
}

  // ✅ Loading State UI - Only shows on first visit
  if (isLoading && !hasVisited) {
    return (
      <Container padding={false}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <SimpleHeader
          title="Notifications"
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
            Loading Notifications...
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container padding={false}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <SimpleHeader
        title="Notifications"
        showBackButton={true}
        onBackPress={handleBackPress}
      />

      <View style={styles.container}>
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <Text style={[styles.unreadCount, { color: theme.colors.onSurface }]}>
            {notificationState.unreadCount} unread notifications
          </Text>

          {notificationState.unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={markAllAsRead}
            >
              <Text
                style={[styles.markAllText, { color: theme.colors.primary }]}
              >
                Mark all as read
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          {notificationState.notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="bell-off-outline"
                size={64}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                style={[styles.emptyTitle, { color: theme.colors.onSurface }]}
              >
                No notifications
              </Text>
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                You're all caught up! New notifications will appear here.
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {notificationState.notifications.map((notification) => {
                const icon = getNotificationIcon(notification.type);

                return (
                  <TouchableOpacity
                    key={notification.id}
                    onPress={() => handleNotificationPress(notification)}
                    activeOpacity={0.7}
                  >
                    <Card
                      style={[
                        styles.notificationCard,
                        !notification.isRead && {
                          backgroundColor: theme.colors.primaryContainer + "20",
                          borderLeftWidth: 4,
                          borderLeftColor: theme.colors.primary,
                        },
                      ]}
                    >
                      <Card.Content style={styles.notificationContent}>
                        <View style={styles.notificationIcon}>
                          <MaterialCommunityIcons
                            name={icon.name as any}
                            size={20}
                            color={icon.color}
                          />
                        </View>

                        <View style={styles.notificationText}>
                          <View style={styles.notificationHeader}>
                            <Text
                              style={[
                                styles.notificationTitle,
                                { color: theme.colors.onSurface },
                                !notification.isRead && styles.unreadTitle,
                              ]}
                            >
                              {notification.title}
                            </Text>
                            {!notification.isRead && (
                              <View style={styles.unreadDot} />
                            )}
                          </View>

                          <Text
                            style={[
                              styles.notificationMessage,
                              { color: theme.colors.onSurfaceVariant },
                            ]}
                            numberOfLines={2}
                          >
                            {notification.message}
                          </Text>

                          <Text
                            style={[
                              styles.notificationTime,
                              { color: theme.colors.onSurfaceVariant },
                            ]}
                          >
                            {formatDate(notification.date, notification.time)} •{" "}
                            {notification.time}
                          </Text>
                        </View>

                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={20}
                          color={theme.colors.onSurfaceVariant}
                        />
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  unreadCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  markAllButton: {
    padding: 4,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 40,
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    borderRadius: 12,
    elevation: 2,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
    marginRight: 8,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  unreadTitle: {
    fontWeight: "700",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
});
