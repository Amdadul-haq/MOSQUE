// app/(tabs)/mosque-info.tsx
import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Linking, StatusBar } from "react-native";
import {
  useTheme,
  Text,
  Card,
  Button,
  Chip,
  Divider,
  ToggleButton,
} from "react-native-paper";
import { Header } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { PrayerTimes } from "../../src/components/PrayerTimes";
import { MosqueInfo, Event } from "../../src/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const mosqueData: MosqueInfo = {
  id: "1",
  name: "Al-Masjid Al-Jamia",
  established: "1995",
  description:
    "A vibrant community mosque serving Muslims in the area with daily prayers, educational programs, and community events. We strive to be a center for spiritual growth, education, and community service.",
  address: "123 Islamic Street, Muslim Town, City 12345",
  phone: "+1 (555) 123-4567",
  email: "info@almasjid.org",
  imam: {
    name: "Imam Omar Farooq",
    phone: "+1 (555) 123-4568",
    bio: "Graduate of Islamic University of Madinah with 15 years of experience in community leadership and Islamic education.",
    email: "imam@almasjid.org",
  },
  prayerTimes: {
    fajr: "5:30 AM",
    dhuhr: "12:30 PM",
    asr: "4:15 PM",
    maghrib: "6:45 PM",
    isha: "8:00 PM",
    jumuah: "1:00 PM",
  },
  services: [
    "Daily Five Prayers",
    "Jumuah Friday Prayer",
    "Quran Classes for All Ages",
    "Islamic Studies Program",
    "Youth Activities",
    "Marriage Services",
    "Funeral Services",
    "Community Hall Rental",
    "Islamic Library",
    "Parking Facility",
    "Wudu Area",
    "Disabled Access",
    "Children's Play Area",
    "Kitchen Facilities",
    "Bookstore",
  ],
  facilities: [
    "Main Prayer Hall (500 capacity)",
    "Women's Prayer Area",
    "Children's Room",
    "Library with 1000+ Books",
    "Community Center",
    "Parking Lot (50 cars)",
    "Garden Area",
  ],
  upcomingEvents: [
    {
      id: "1",
      title: "Friday Khutba - Importance of Charity",
      date: "Today",
      time: "1:00 PM",
      type: "khutba",
      imam: "Imam Omar Farooq",
    },
    {
      id: "2",
      title: "Quran Memorization Class",
      date: "Tomorrow",
      time: "5:00 PM",
      type: "education",
      imam: "Shaykh Ahmed",
    },
    {
      id: "3",
      title: "Community Iftar",
      date: "This Saturday",
      time: "6:30 PM",
      type: "community",
      imam: "All Imams",
    },
  ],
};

export default function MosqueInfoScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<"info" | "events">("info");

  const handleContact = async (
    type: "call" | "email" | "maps",
    value: string
  ) => {
    try {
      switch (type) {
        case "call":
          await Linking.openURL(`tel:${value}`);
          break;
        case "email":
          await Linking.openURL(`mailto:${value}`);
          break;
        case "maps":
          await Linking.openURL(
            `https://maps.google.com/?q=${encodeURIComponent(
              mosqueData.name + " " + value
            )}`
          );
          break;
      }
    } catch (error) {
      console.error("Error opening link:", error);
    }
  };

  const prayerTimesList = Object.entries(mosqueData.prayerTimes).map(
    ([prayer, time]) => ({
      name: prayer === "jumuah" ? "Friday Prayer" : prayer,
      time,
      isCurrent: prayer === "dhuhr",
    })
  );

  const getEventColor = (type: string) => {
    switch (type) {
      case "khutba":
        return theme.colors.primary;
      case "education":
        return "#f59e0b";
      case "community":
        return "#8b5cf6";
      default:
        return theme.colors.secondary;
    }
  };

  return (
    <Container padding={false}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <Header title="Mosque Information" subtitle="Learn about our community" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={styles.content}>
          {/* View Mode Toggle */}
          <Card style={styles.toggleCard}>
            <Card.Content>
              <ToggleButton.Row
                value={viewMode}
                onValueChange={(value) =>
                  setViewMode(value as "info" | "events")
                }
                style={styles.toggleContainer}
              >
                <ToggleButton
                  icon="information"
                  value="info"
                  style={[
                    styles.toggleButton,
                    viewMode === "info" && {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  color={viewMode === "info" ? "white" : theme.colors.onSurface}
                />
                <ToggleButton
                  icon="calendar"
                  value="events"
                  style={[
                    styles.toggleButton,
                    viewMode === "events" && {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  color={
                    viewMode === "events" ? "white" : theme.colors.onSurface
                  }
                />
              </ToggleButton.Row>
            </Card.Content>
          </Card>

          {viewMode === "info" ? (
            <>
              {/* Mosque Overview */}
              <Section title="About Our Mosque">
                <Card style={styles.overviewCard}>
                  <Card.Content>
                    <View style={styles.mosqueHeader}>
                      <View style={styles.mosqueTitle}>
                        <Text
                          style={[
                            styles.mosqueName,
                            { color: theme.colors.primary },
                          ]}
                        >
                          {mosqueData.name}
                        </Text>
                        <Text
                          style={[
                            styles.established,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                        >
                          Established {mosqueData.established}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.mosqueBadge,
                          { backgroundColor: theme.colors.primaryContainer },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            { color: theme.colors.onPrimaryContainer },
                          ]}
                        >
                          🕌 Mosque
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.description,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {mosqueData.description}
                    </Text>
                    <Button
                      mode="contained"
                      icon="map-marker"
                      onPress={() => handleContact("maps", mosqueData.address)}
                      style={styles.directionsButton}
                      contentStyle={styles.buttonContent}
                    >
                      Get Directions
                    </Button>
                  </Card.Content>
                </Card>
              </Section>

              {/* Contact Information */}
              <Section title="Contact Information">
                <Card style={styles.contactCard}>
                  <Card.Content style={styles.contactContent}>
                    <View style={styles.contactItem}>
                      <View style={styles.contactIcon}>
                        <Text style={styles.contactEmoji}>📍</Text>
                      </View>
                      <View style={styles.contactInfo}>
                        <Text
                          style={[
                            styles.contactLabel,
                            { color: theme.colors.onSurface },
                          ]}
                        >
                          Address
                        </Text>
                        <Text
                          style={[
                            styles.contactValue,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                        >
                          {mosqueData.address}
                        </Text>
                      </View>
                      <Button
                        mode="text"
                        compact
                        icon="map"
                        onPress={() =>
                          handleContact("maps", mosqueData.address)
                        }
                      >
                        Map
                      </Button>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.contactItem}>
                      <View style={styles.contactIcon}>
                        <Text style={styles.contactEmoji}>📞</Text>
                      </View>
                      <View style={styles.contactInfo}>
                        <Text
                          style={[
                            styles.contactLabel,
                            { color: theme.colors.onSurface },
                          ]}
                        >
                          Phone
                        </Text>
                        <Text
                          style={[
                            styles.contactValue,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                        >
                          {mosqueData.phone}
                        </Text>
                      </View>
                      <Button
                        mode="text"
                        compact
                        icon="phone"
                        onPress={() => handleContact("call", mosqueData.phone)}
                      >
                        Call
                      </Button>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.contactItem}>
                      <View style={styles.contactIcon}>
                        <Text style={styles.contactEmoji}>✉️</Text>
                      </View>
                      <View style={styles.contactInfo}>
                        <Text
                          style={[
                            styles.contactLabel,
                            { color: theme.colors.onSurface },
                          ]}
                        >
                          Email
                        </Text>
                        <Text
                          style={[
                            styles.contactValue,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                        >
                          {mosqueData.email}
                        </Text>
                      </View>
                      <Button
                        mode="text"
                        compact
                        icon="email"
                        onPress={() => handleContact("email", mosqueData.email)}
                      >
                        Email
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              </Section>

              {/* Imam Information */}
              <Section title="Imam Information">
                <Card style={styles.imamCard}>
                  <Card.Content>
                    <View style={styles.imamHeader}>
                      <View
                        style={[
                          styles.imamAvatar,
                          { backgroundColor: theme.colors.primary },
                        ]}
                      >
                        <Text style={styles.imamInitial}>
                          {mosqueData.imam.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Text>
                      </View>
                      <View style={styles.imamInfo}>
                        <Text
                          style={[
                            styles.imamName,
                            { color: theme.colors.onSurface },
                          ]}
                        >
                          {mosqueData.imam.name}
                        </Text>
                        <Text
                          style={[
                            styles.imamRole,
                            { color: theme.colors.primary },
                          ]}
                        >
                          Head Imam
                        </Text>
                        <Text
                          style={[
                            styles.imamBio,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                        >
                          {mosqueData.imam.bio}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.imamActions}>
                      <Button
                        mode="outlined"
                        icon="phone"
                        onPress={() =>
                          handleContact("call", mosqueData.imam.phone)
                        }
                        style={styles.imamButton}
                        compact
                      >
                        Call Imam
                      </Button>
                      <Button
                        mode="outlined"
                        icon="email"
                        onPress={() =>
                          handleContact("email", mosqueData.imam.email)
                        }
                        style={styles.imamButton}
                        compact
                      >
                        Email
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              </Section>

              {/* Prayer Times */}
              <Section title="Prayer Times" subtitle="Current prayer: Dhuhr">
                <PrayerTimes times={prayerTimesList} />
              </Section>

              {/* Services & Facilities */}
              <Section title="Services & Facilities">
                <Card style={styles.servicesCard}>
                  <Card.Content>
                    <Text
                      style={[
                        styles.sectionSubtitle,
                        { color: theme.colors.primary },
                      ]}
                    >
                      Services Offered
                    </Text>
                    <View style={styles.servicesGrid}>
                      {mosqueData.services.map((service, index) => (
                        <Chip
                          key={index}
                          mode="outlined"
                          style={styles.serviceChip}
                          textStyle={styles.serviceChipText}
                          showSelectedCheck={false}
                        >
                          {service}
                        </Chip>
                      ))}
                    </View>

                    <Text
                      style={[
                        styles.sectionSubtitle,
                        { color: theme.colors.primary, marginTop: 16 },
                      ]}
                    >
                      Facilities
                    </Text>
                    <View style={styles.servicesGrid}>
                      {mosqueData.facilities?.map((facility, index) => (
                        <Chip
                          key={index}
                          mode="flat"
                          style={[
                            styles.facilityChip,
                            { backgroundColor: theme.colors.surfaceVariant },
                          ]}
                          textStyle={[
                            styles.facilityChipText,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                          showSelectedCheck={false}
                        >
                          {facility}
                        </Chip>
                      ))}
                    </View>
                  </Card.Content>
                </Card>
              </Section>
            </>
          ) : (
            /* Events View */
            <>
              <Section title="Upcoming Events">
                <Card style={styles.eventsCard}>
                  <Card.Content>
                    {mosqueData.upcomingEvents?.map((event, index) => (
                      <React.Fragment key={event.id}>
                        <View style={styles.eventItem}>
                          <View
                            style={[
                              styles.eventColor,
                              { backgroundColor: getEventColor(event.type) },
                            ]}
                          />
                          <View style={styles.eventContent}>
                            <View style={styles.eventHeader}>
                              <Text
                                style={[
                                  styles.eventTitle,
                                  { color: theme.colors.onSurface },
                                ]}
                              >
                                {event.title}
                              </Text>
                              <Chip
                                mode="outlined"
                                compact
                                textStyle={[
                                  styles.eventType,
                                  { color: getEventColor(event.type) },
                                ]}
                              >
                                {event.type}
                              </Chip>
                            </View>
                            <View style={styles.eventDetails}>
                              <Text
                                style={[
                                  styles.eventDetail,
                                  { color: theme.colors.onSurfaceVariant },
                                ]}
                              >
                                📅 {event.date} • ⏰ {event.time}
                              </Text>
                              <Text
                                style={[
                                  styles.eventDetail,
                                  { color: theme.colors.onSurfaceVariant },
                                ]}
                              >
                                👨‍🏫 {event.imam}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {index < mosqueData.upcomingEvents!.length - 1 && (
                          <Divider style={styles.eventDivider} />
                        )}
                      </React.Fragment>
                    ))}
                  </Card.Content>
                </Card>
              </Section>

              <Section title="Weekly Schedule">
                <Card style={styles.scheduleCard}>
                  <Card.Content>
                    <View style={styles.scheduleItem}>
                      <Text
                        style={[
                          styles.scheduleDay,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Friday
                      </Text>
                      <Text
                        style={[
                          styles.scheduleTime,
                          { color: theme.colors.primary },
                        ]}
                      >
                        1:00 PM
                      </Text>
                      <Text
                        style={[
                          styles.scheduleEvent,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        Jumuah Prayer
                      </Text>
                    </View>
                    <Divider style={styles.scheduleDivider} />
                    <View style={styles.scheduleItem}>
                      <Text
                        style={[
                          styles.scheduleDay,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Saturday
                      </Text>
                      <Text
                        style={[
                          styles.scheduleTime,
                          { color: theme.colors.primary },
                        ]}
                      >
                        5:00 PM
                      </Text>
                      <Text
                        style={[
                          styles.scheduleEvent,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        Quran Class
                      </Text>
                    </View>
                    <Divider style={styles.scheduleDivider} />
                    <View style={styles.scheduleItem}>
                      <Text
                        style={[
                          styles.scheduleDay,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Sunday
                      </Text>
                      <Text
                        style={[
                          styles.scheduleTime,
                          { color: theme.colors.primary },
                        ]}
                      >
                        10:00 AM
                      </Text>
                      <Text
                        style={[
                          styles.scheduleEvent,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        Islamic Studies
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </Section>
            </>
          )}
        </View>
      </ScrollView>
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
  toggleCard: {
    borderRadius: 16,
    marginBottom: 16,
  },
  toggleContainer: {
    justifyContent: "center",
  },
  toggleButton: {
    flex: 1,
    borderRadius: 12,
  },
  overviewCard: {
    borderRadius: 20,
  },
  mosqueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  mosqueTitle: {
    flex: 1,
  },
  mosqueName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  established: {
    fontSize: 14,
  },
  mosqueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  directionsButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  contactCard: {
    borderRadius: 16,
  },
  contactContent: {
    gap: 0,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  contactIcon: {
    width: 40,
    alignItems: "center",
  },
  contactEmoji: {
    fontSize: 20,
  },
  contactInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 0,
  },
  imamCard: {
    borderRadius: 16,
  },
  imamHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  imamAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  imamInitial: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  imamInfo: {
    flex: 1,
  },
  imamName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  imamRole: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  imamBio: {
    fontSize: 14,
    lineHeight: 20,
  },
  imamActions: {
    flexDirection: "row",
    gap: 8,
  },
  imamButton: {
    flex: 1,
    borderRadius: 8,
  },
  servicesCard: {
    borderRadius: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  serviceChip: {
    margin: 2,
  },
  serviceChipText: {
    fontSize: 12,
  },
  facilityChip: {
    margin: 2,
  },
  facilityChipText: {
    fontSize: 11,
  },
  eventsCard: {
    borderRadius: 16,
  },
  eventItem: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  eventColor: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 12,
  },
  eventType: {
    fontSize: 10,
    fontWeight: "700",
  },
  eventDetails: {
    gap: 2,
  },
  eventDetail: {
    fontSize: 12,
  },
  eventDivider: {
    marginLeft: 16,
  },
  scheduleCard: {
    borderRadius: 16,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  scheduleDay: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: "700",
    marginRight: 12,
  },
  scheduleEvent: {
    fontSize: 14,
    flex: 2,
    textAlign: "right",
  },
  scheduleDivider: {
    marginVertical: 0,
  },
});
