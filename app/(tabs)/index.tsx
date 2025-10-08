// app/(tabs)/index.tsx
import React from "react";
import { ScrollView, View, Text, StyleSheet, StatusBar } from "react-native";
import { useTheme, Card, Button } from "react-native-paper";
import { Header, HomeHeader } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { PrayerTimes } from "../../src/components/PrayerTimes";
import { StatsGrid } from "../../src/components/StatsGrid";
import { QuickActions } from "../../src/components/QuickActions";
import { useHomeData } from "../../src/hooks/useHomeData";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {
    stats,
    upcomingEvents,
    prayerTimes,
    quickActions,
    handleQuickAction,
  } = useHomeData();

  const handleProfilePress = () => {
    handleQuickAction("profile");
  };

  const handleNotificationPress = () => {
    handleQuickAction("notifications");
  };

  return (
    <Container padding={false}>
      {/* StatusBar with dark content for better visibility */}
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Main content with safe area handling */}
      <View style={styles.container}>
        {/* Using the enhanced HomeHeader */}
        <HomeHeader
          onProfilePress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
          notificationCount={3}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          style={styles.scrollView}
        >
          <View style={styles.content}>
            {/* Rest of your content remains the same */}
            <Card style={styles.welcomeCard}>
              <Card.Content>
                <Text
                  style={[styles.welcomeTitle, { color: theme.colors.primary }]}
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
                <Text
                  style={[
                    styles.welcomeText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Manage your spiritual journey, donations, and community events
                  in one place.
                </Text>
                <Button
                  mode="contained"
                  onPress={() => handleQuickAction("donation")}
                  style={styles.donateButton}
                  icon="heart"
                >
                  Make a Donation
                </Button>
              </Card.Content>
            </Card>

            <Section title="Today's Prayer Times">
              <PrayerTimes times={prayerTimes} />
            </Section>

            <Section title="Quick Actions">
              <QuickActions
                actions={quickActions}
                onAction={handleQuickAction}
              />
            </Section>

            <Section title="Today's Summary">
              <StatsGrid stats={stats} />
            </Section>

            <Section
              title="Upcoming Events"
              action={
                <Button
                  mode="text"
                  compact
                  onPress={() => handleQuickAction("events")}
                >
                  View All
                </Button>
              }
            >
              <View style={styles.eventsContainer}>
                {upcomingEvents.map((event) => (
                  <Card
                    key={event.id}
                    style={styles.eventCard}
                    mode="contained"
                  >
                    <Card.Content>
                      <View style={styles.eventHeader}>
                        <View style={styles.eventInfo}>
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
                            {event.date} • {event.time}
                          </Text>
                          <Text
                            style={[
                              styles.eventDescription,
                              { color: theme.colors.onSurfaceVariant },
                            ]}
                          >
                            {event.description}
                          </Text>
                        </View>
                        <Button
                          mode="outlined"
                          compact
                          onPress={() => handleQuickAction("event", event.id)}
                        >
                          View
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

// ... styles remain the same
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
  welcomeCard: {
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
  welcomeText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  donateButton: {
    borderRadius: 12,
  },
  eventsContainer: {
    gap: 8,
  },
  eventCard: {
    borderRadius: 12,
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
});
