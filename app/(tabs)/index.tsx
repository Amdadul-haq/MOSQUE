// app/(tabs)/index.tsx - FULL UPDATED WITH THEME-AWARE DIALOG
import React from "react";
import {
  ScrollView,
  View,
  Text as RNText,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from "react-native";
import {
  useTheme,
  Card,
  Button,
  ActivityIndicator,
  Dialog,
  Portal,
  Text,
} from "react-native-paper";
import { HomeHeader } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { PrayerTimes } from "../../src/components/PrayerTimes";
import { QuickActions } from "../../src/components/QuickActions";
import { useHomeData } from "../../src/hooks/useHomeData";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTabNavigation } from "../../src/hooks/useTabNavigation";
import { useNotifications } from "../../src/contexts/NotificationContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { Event } from "../../src/types";
import * as Haptics from "expo-haptics";
import { useThemeMode } from "../../src/contexts/ThemeContext"; // ✅ ADDED

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useThemeMode(); // ✅ ADDED

  const {
    stats,
    upcomingEvents,
    prayerTimes,
    quickActions,
    handleQuickAction,
    announcements,
  } = useHomeData();

  const { notificationState } = useNotifications();

  // ✅ ADDED: Guest donation dialog state
  const [guestDialogVisible, setGuestDialogVisible] = React.useState(false);

  // Loading state management for home tab
  const { isLoading, handleRefresh } = useTabNavigation("home");

  // ✅ ADDED: Theme-aware dialog styles
  const dialogStyles = {
    dialog: {
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      elevation: 4,
    },
    dialogTitle: {
      textAlign: "center" as const,
      fontSize: 20,
      fontWeight: "700" as const,
      marginTop: 8,
      color: theme.colors.onSurface,
    },
    dialogText: {
      marginBottom: 8,
      lineHeight: 20,
      color: theme.colors.onSurface,
    },
    recommendation: {
      marginTop: 12,
      padding: 12,
      backgroundColor: isDark ? "#1e3a5f" : "#f0f9ff",
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: "#0ea5e9",
    },
  };

  const handleProfilePress = () => {
    handleQuickAction("profile");
  };

  const handleLogoPress = () => {
    handleRefresh();
    console.log("Logo clicked - refreshing home!");
  };

  const handleNotificationPress = () => {
    router.push("/notifications");
  };

  const handleViewFinancials = () => {
    router.push("/financials/see-all");
  };

  // ✅ UPDATED: Donation button handler with guest check
  const handleMakeDonation = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!isAuthenticated) {
      // Show custom dialog for guest users
      setGuestDialogVisible(true);
      return;
    }

    // User is authenticated, proceed to donation flow
    router.push("/donation/type");
  };

  // ✅ ADDED: Handle guest donation from home screen
  const handleGuestDonation = () => {
    setGuestDialogVisible(false);
    router.push("/donation/type");
  };

  // ✅ ADDED: Handle login with redirect from home screen
  const handleLoginForDonation = () => {
    setGuestDialogVisible(false);
    router.push({
      pathname: "/(auth)/login",
      params: {
        redirect: "/donation/type",
      },
    });
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
            onLogoPress={handleLogoPress}
            notificationCount={notificationState.unreadCount}
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
              style={styles.loadingSpinner}
            />
            <RNText
              style={[styles.loadingText, { color: theme.colors.onSurface }]}
            >
              Loading Home Data...
            </RNText>
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
          onLogoPress={handleLogoPress}
          notificationCount={notificationState.unreadCount}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          style={styles.scrollView}
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
                    <RNText
                      style={[
                        styles.welcomeTitle,
                        { color: theme.colors.primary },
                      ]}
                    >
                      Assalamu Alaikum 👋
                    </RNText>
                    <RNText
                      style={[
                        styles.welcomeSubtitle,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      Welcome back to your mosque community
                    </RNText>
                  </View>
                  <View
                    style={[
                      styles.dateBadge,
                      { backgroundColor: theme.colors.primaryContainer },
                    ]}
                  >
                    <RNText
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
                    </RNText>
                  </View>
                </View>

                <RNText
                  style={[
                    styles.welcomeText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Manage your spiritual journey, donations, and community events
                  in one place.
                </RNText>

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
                      <RNText
                        style={[
                          styles.announcementTitle,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        📢 {announcements[0].title}
                      </RNText>
                      <RNText
                        style={[
                          styles.announcementText,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {announcements[0].message}
                      </RNText>
                    </Card.Content>
                  </Card>
                )}

                {/* ✅ UPDATED: Donation Button with guest handling */}
                <Button
                  mode="contained"
                  onPress={handleMakeDonation}
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
                    <RNText
                      style={[
                        styles.financialsTitle,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      Financial Overview
                    </RNText>
                    <RNText
                      style={[
                        styles.financialsSubtitle,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      View detailed financial reports and analytics
                    </RNText>
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
                            <RNText
                              style={[
                                styles.eventType,
                                { color: theme.colors.primary },
                              ]}
                            >
                              {event.type.toUpperCase()}
                            </RNText>
                          </View>
                          <RNText
                            style={[
                              styles.eventTitle,
                              { color: theme.colors.onSurface },
                            ]}
                          >
                            {event.title}
                          </RNText>
                          <RNText
                            style={[
                              styles.eventDate,
                              { color: theme.colors.onSurfaceVariant },
                            ]}
                          >
                            {event.date} • {event.time} • {event.location}
                          </RNText>
                          {event.description && (
                            <RNText
                              style={[
                                styles.eventDescription,
                                { color: theme.colors.onSurfaceVariant },
                              ]}
                            >
                              {event.description}
                            </RNText>
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

        {/* ✅ UPDATED: Guest Donation Dialog with theme styles */}
        <Portal>
          <Dialog
            visible={guestDialogVisible}
            onDismiss={() => setGuestDialogVisible(false)}
            style={dialogStyles.dialog}
          >
            <Dialog.Icon
              icon="account-question"
              size={40}
              color={theme.colors.primary}
            />
            <Dialog.Title style={dialogStyles.dialogTitle}>
              Continue as Guest?
            </Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium" style={dialogStyles.dialogText}>
                📝{" "}
                <Text
                  style={{ fontWeight: "bold", color: theme.colors.onSurface }}
                >
                  You're not logged in
                </Text>
              </Text>
              <Text variant="bodyMedium" style={dialogStyles.dialogText}>
                • Your donation history won't be saved for future reference
              </Text>
              <Text variant="bodyMedium" style={dialogStyles.dialogText}>
                • You won't be able to track your contributions
              </Text>
              <Text
                variant="bodyMedium"
                style={[dialogStyles.dialogText, dialogStyles.recommendation]}
              >
                💡{" "}
                <Text
                  style={{ fontWeight: "bold", color: theme.colors.onSurface }}
                >
                  We recommend creating an account
                </Text>{" "}
                to keep track of your charitable activities and receive updates
                on how your donations are making a difference.
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <Button
                mode="outlined"
                onPress={handleGuestDonation}
                style={styles.guestButton}
                textColor={theme.colors.onSurfaceVariant}
              >
                Donate as Guest
              </Button>
              <Button
                mode="contained"
                onPress={handleLoginForDonation}
                style={styles.loginButton}
              >
                Log In to Continue
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
  // ✅ UPDATED: Dialog styles - removed hardcoded background colors
  dialogActions: {
    flexDirection: "column",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  guestButton: {
    width: "100%",
    borderRadius: 12,
  },
  loginButton: {
    width: "100%",
    borderRadius: 12,
  },
});
