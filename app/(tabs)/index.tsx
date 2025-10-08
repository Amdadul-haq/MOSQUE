//app/(tabs)/index.tsx
import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useTheme, Card, Button } from "react-native-paper";
import { Header } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { PrayerTimes } from "../../src/components/PrayerTimes";
import { StatsGrid } from "../../src/components/StatsGrid";
import { QuickActions } from "../../src/components/QuickActions";
import { useHomeData } from "../../src/hooks/useHomeData";

export default function HomeScreen() {
  const theme = useTheme();
  const {
    stats,
    upcomingEvents,
    prayerTimes,
    quickActions,
    handleQuickAction,
  } = useHomeData();

  return (
    <Container>
      <Header
        title="Al-Masjid Al-Jamia"
        subtitle="Welcome to your spiritual hub"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Card */}
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
              Manage your spiritual journey, donations, and community events in
              one place.
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

        {/* Prayer Times */}
        <Section title="Today's Prayer Times">
          <PrayerTimes times={prayerTimes} />
        </Section>

        {/* Quick Actions */}
        <Section title="Quick Actions">
          <QuickActions actions={quickActions} onAction={handleQuickAction} />
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
            >
              View All
            </Button>
          }
        >
          <View style={styles.eventsContainer}>
            {upcomingEvents.map((event) => (
              <Card key={event.id} style={styles.eventCard} mode="contained">
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
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  welcomeCard: {
    marginBottom: 24,
    borderRadius: 16,
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