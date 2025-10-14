// app/notifications/[id].tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import { useTheme, Card } from "react-native-paper";
import { Container } from "../../src/components/common/Container";
import { SimpleHeader } from "../../src/components/Header";
import { useNotifications } from "../../src/contexts/NotificationContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function NotificationDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const { notificationState, markAsRead } = useNotifications();

  const notification = notificationState.notifications.find((n) => n.id === id);

  // Mark as read when viewing details
  React.useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notification.id);
    }
  }, [notification, markAsRead]);

  if (!notification) {
    return (
      <Container padding={false}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <SimpleHeader
          title="Notification Not Found"
          showBackButton={true}
          onBackPress={() => router.back()}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.onSurface }]}>
            Notification not found
          </Text>
        </View>
      </Container>
    );
  }

  const getNotificationIcon = (type: string) => {
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

  const formatFullDate = (date: string, time: string) => {
    const notificationDate = new Date(`${date}T${time}`);
    return notificationDate.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const icon = getNotificationIcon(notification.type);

  return (
    <Container padding={false}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <SimpleHeader
        title="Notification Details"
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.detailsCard}>
          <Card.Content>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={icon.name as any}
                  size={24}
                  color={icon.color}
                />
              </View>
              <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                  {notification.title}
                </Text>
                <Text
                  style={[
                    styles.date,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {formatFullDate(notification.date, notification.time)}
                </Text>
              </View>
            </View>

            {/* Type Badge */}
            <View style={styles.typeContainer}>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: icon.color + "20" },
                ]}
              >
                <Text style={[styles.typeText, { color: icon.color }]}>
                  {notification.type.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Message */}
            <View style={styles.messageContainer}>
              <Text
                style={[
                  styles.messageLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Message
              </Text>
              <Text style={[styles.message, { color: theme.colors.onSurface }]}>
                {notification.message}
              </Text>
            </View>

            {/* Status */}
            <View style={styles.statusContainer}>
              <Text
                style={[
                  styles.statusLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Status
              </Text>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: notification.isRead
                        ? theme.colors.primary + "20"
                        : "#f59e0b20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: notification.isRead
                          ? theme.colors.primary
                          : "#f59e0b",
                      },
                    ]}
                  >
                    {notification.isRead ? "READ" : "UNREAD"}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.statusTime,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {notification.isRead ? "Read" : "Unread"}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailsCard: {
    borderRadius: 16,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
  },
  typeContainer: {
    marginBottom: 20,
  },
  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  messageContainer: {
    marginBottom: 20,
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
  },
  statusContainer: {
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statusTime: {
    fontSize: 14,
  },
});
