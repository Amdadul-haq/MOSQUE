// app/(tabs)/index.tsx
import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useTheme, Card, Button, ActivityIndicator } from "react-native-paper";
import { Header, HomeHeader } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { PrayerTimes } from "../../src/components/PrayerTimes";
import { StatsGrid } from "../../src/components/StatsGrid";
import { QuickActions } from "../../src/components/QuickActions";
import { useHomeData } from "../../src/hooks/useHomeData";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTabNavigation } from "../../src/hooks/useTabNavigation"; // ✅ NEW IMPORT

import {
  PrayerTime,
  StatItem,
  QuickAction,
  Event,
  Announcement,
} from "../../src/types";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {
    stats,
    upcomingEvents,
    prayerTimes,
    quickActions,
    handleQuickAction,
    announcements,
  } = useHomeData();

  // ✅ NEW: Loading state management for home tab
  const { isLoading, handleRefresh } = useTabNavigation("home");

  const handleProfilePress = () => {
    handleQuickAction("profile");
  };

  const handleNotificationPress = () => {
    handleQuickAction("notifications");
  };

  const handleViewFinancials = () => {
    router.push("/financials/financials");
  };

  // ✅ NEW: Pull-to-refresh handler
  const onRefresh = () => {
    handleRefresh();
  };

  // ✅ Loading State UI
  if (isLoading) {
    return (
      <Container padding={false}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <View style={styles.container}>
          <HomeHeader
            onProfilePress={handleProfilePress}
            onNotificationPress={handleNotificationPress}
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
              style={styles.loadingSpinner}
            />
            <Text
              style={[styles.loadingText, { color: theme.colors.onSurface }]}
            >
              Loading Home Data...
            </Text>
          </View>
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

      <View style={styles.container}>
        <HomeHeader
          onProfilePress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          style={styles.scrollView}
          // ✅ NEW: Pull-to-refresh functionality
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
            {/* Welcome Card with Announcements */}
            <Card style={styles.welcomeCard}>
              <Card.Content>
                <View style={styles.welcomeHeader}>
                  <View style={styles.welcomeTextContainer}>
                    <Text
                      style={[
                        styles.welcomeTitle,
                        { color: theme.colors.primary },
                      ]}
                    >
                      Assalamu Alaikum 👋
                    </Text>
                    <Text
                      style={[
                        styles.welcomeSubtitle,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      Welcome back to your mosque community
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.dateBadge,
                      { backgroundColor: theme.colors.primaryContainer },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        { color: theme.colors.onPrimaryContainer },
                      ]}
                    >
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.welcomeText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Manage your spiritual journey, donations, and community events
                  in one place.
                </Text>

                {/* Quick Announcements */}
                {announcements.length > 0 && (
                  <Card
                    style={[
                      styles.announcementCard,
                      { backgroundColor: theme.colors.surfaceVariant },
                    ]}
                    mode="contained"
                  >
                    <Card.Content>
                      <Text
                        style={[
                          styles.announcementTitle,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        📢 {announcements[0].title}
                      </Text>
                      <Text
                        style={[
                          styles.announcementText,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {announcements[0].message}
                      </Text>
                    </Card.Content>
                  </Card>
                )}

                <Button
                  mode="contained"
                  onPress={() => router.push("/donation/type")}
                  style={styles.donateButton}
                  icon="heart"
                  contentStyle={styles.donateButtonContent}
                >
                  Make a Donation
                </Button>
              </Card.Content>
            </Card>

            {/* Prayer Times */}
            <Section
              title="Today's Prayer Times"
              subtitle="Next: Dhuhr in 2h 15m"
            >
              <PrayerTimes times={prayerTimes} />
            </Section>

            {/* Quick Actions */}
            <Section title="Quick Actions">
              <QuickActions
                actions={quickActions.map((action) => ({
                  ...action,
                  description: action.description ?? "",
                }))}
                onAction={handleQuickAction}
              />
            </Section>

            {/* View Financials Button */}
            <Section title="Mosque Financials">
              <Card style={styles.financialsCard}>
                <Card.Content style={styles.financialsContent}>
                  <View style={styles.financialsTextContainer}>
                    <Text
                      style={[
                        styles.financialsTitle,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      Financial Overview
                    </Text>
                    <Text
                      style={[
                        styles.financialsSubtitle,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      View detailed financial reports and analytics
                    </Text>
                  </View>
                  <Button
                    mode="outlined"
                    onPress={handleViewFinancials}
                    style={styles.financialsButton}
                    contentStyle={styles.financialsButtonContent}
                    icon="chart-box"
                  >
                    View Full Financials
                  </Button>
                </Card.Content>
              </Card>
            </Section>

            {/* Stats */}
            <Section title="Today's Summary">
              <StatsGrid stats={stats} />
            </Section>

            {/* Upcoming Events */}
            <Section
              title="Upcoming Events"
              action={
                <Button
                  mode="text"
                  compact
                  onPress={() => handleQuickAction("events")}
                  textColor={theme.colors.primary}
                >
                  View All
                </Button>
              }
            >
              <View style={styles.eventsContainer}>
                {upcomingEvents.slice(0, 3).map((event: Event) => (
                  <Card
                    key={event.id}
                    style={styles.eventCard}
                    mode="contained"
                  >
                    <Card.Content>
                      <View style={styles.eventHeader}>
                        <View style={styles.eventInfo}>
                          <View style={styles.eventTypeBadge}>
                            <Text
                              style={[
                                styles.eventType,
                                { color: theme.colors.primary },
                              ]}
                            >
                              {event.type.toUpperCase()}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.eventTitle,
                              { color: theme.colors.onSurface },
                            ]}
                          >
                            {event.title}
                          </Text>
                          <Text
                            style={[
                              styles.eventDate,
                              { color: theme.colors.onSurfaceVariant },
                            ]}
                          >
                            {event.date} • {event.time} • {event.location}
                          </Text>
                          {event.description && (
                            <Text
                              style={[
                                styles.eventDescription,
                                { color: theme.colors.onSurfaceVariant },
                              ]}
                            >
                              {event.description}
                            </Text>
                          )}
                        </View>
                        <Button
                          mode="outlined"
                          compact
                          onPress={() => handleQuickAction("event", event.id)}
                          style={styles.eventButton}
                        >
                          Details
                        </Button>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            </Section>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  // ✅ NEW: Loading styles
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
  welcomeCard: {
    marginBottom: 24,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  welcomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  dateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
  },
  welcomeText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  announcementCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  announcementText: {
    fontSize: 12,
    lineHeight: 16,
  },
  donateButton: {
    borderRadius: 12,
  },
  donateButtonContent: {
    paddingVertical: 6,
  },
  financialsCard: {
    borderRadius: 16,
    marginBottom: 8,
  },
  financialsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  financialsTextContainer: {
    flex: 1,
  },
  financialsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  financialsSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  financialsButton: {
    borderRadius: 8,
    marginLeft: 12,
  },
  financialsButtonContent: {
    paddingVertical: 4,
  },
  eventsContainer: {
    gap: 12,
  },
  eventCard: {
    borderRadius: 16,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eventInfo: {
    flex: 1,
    marginRight: 12,
  },
  eventTypeBadge: {
    marginBottom: 8,
  },
  eventType: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  eventButton: {
    borderRadius: 8,
  },
});
