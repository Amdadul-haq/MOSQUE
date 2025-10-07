import React from "react";
import { ScrollView, View, Text, Alert, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useColorScheme } from "../../src/hooks/useColorScheme";
import { Header } from "../../src/components/Header";
import { Card, CardHeader } from "../../src/components/Card";
import { Button } from "../../src/components/Button";
import { DummyData } from "../../src/constants";

export default function HomeScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const handleQuickAction = (action: string) => {
    Alert.alert("Quick Action", `${action} button pressed!`);
  };

  const containerStyle = {
    backgroundColor: theme.colors.background,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Header title="Al-Masjid Al-Jamia" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <Card style={styles.card}>
          <CardHeader
            title="Assalamu Alaikum 👋"
            subtitle="Welcome to Mosque Management System"
          />
          <Text style={[styles.description, { color: theme.colors.onSurface }]}>
            Manage your mosque activities, donations, and community events in
            one place.
          </Text>
          <Button
            title="Make a Donation"
            onPress={() => handleQuickAction("Donation")}
            fullWidth
          />
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsRow}>
            <View style={styles.actionButton}>
              <Button
                title="Prayer Times"
                onPress={() => handleQuickAction("Prayer Times")}
                variant="outline"
                size="sm"
                fullWidth
              />
            </View>
            <View style={styles.actionButton}>
              <Button
                title="Events"
                onPress={() => handleQuickAction("Events")}
                variant="outline"
                size="sm"
                fullWidth
              />
            </View>
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Upcoming Events
          </Text>
          {DummyData.events.map((event) => (
            <Card key={event.id} style={styles.eventCard}>
              <View style={styles.eventRow}>
                <View style={styles.eventInfo}>
                  <Text
                    style={[styles.eventTitle, { color: theme.colors.onSurface }]}
                  >
                    {event.title}
                  </Text>
                  <Text
                    style={[
                      styles.eventDate,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {event.date} at {event.time}
                  </Text>
                </View>
                <Button
                  title="View"
                  onPress={() => Alert.alert("Event", `Viewing ${event.title}`)}
                  size="sm"
                />
              </View>
            </Card>
          ))}
        </View>

        {/* Stats Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}> 
            Today's Summary
          </Text>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>5</Text>
              <Text
                style={[styles.statLabel, { color: theme.colors.onSurface }]}
              >
                Prayers
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={[styles.statNumber, styles.statAccent]}>12</Text>
              <Text
                style={[styles.statLabel, { color: theme.colors.onSurface }]}
              >
                Attendees
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>$350</Text>
              <Text
                style={[styles.statLabel, { color: theme.colors.onSurface }]}
              >
                Donations
              </Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
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
    padding: 16,
  },
  card: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "48%",
  },
  eventCard: {
    marginBottom: 8,
  },
  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  eventDate: {
    fontSize: 14,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#16a34a",
  },
  statAccent: {
    color: "#facc15",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
