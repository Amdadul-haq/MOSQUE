//app/(tabs)/mosque-info.tsx
import React from "react";
import { ScrollView, View, StyleSheet, Linking } from "react-native";
import {
  useTheme,
  Text,
  Card,
  Button,
  Chip,
  Divider,
} from "react-native-paper";
import { Header } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { PrayerTimes } from "../../src/components/PrayerTimes";
import { MosqueInfo } from "../../src/types";

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
  ],
};

export default function MosqueInfoScreen() {
  const theme = useTheme();

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
          // For demo, we'll use a generic maps URL
          await Linking.openURL(
            `https://maps.google.com/?q=${encodeURIComponent(value)}`
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
      isCurrent:
        prayer === "dhuhr" &&
        new Date().getHours() >= 12 &&
        new Date().getHours() < 16,
    })
  );

  return (
    <Container>
      <Header title="Mosque Information" subtitle="Learn about our community" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Mosque Overview */}
        <Section title="About Our Mosque">
          <Card style={styles.overviewCard}>
            <Card.Content>
              <Text
                style={[styles.mosqueName, { color: theme.colors.primary }]}
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
              <Text
                style={[styles.description, { color: theme.colors.onSurface }]}
              >
                {mosqueData.description}
              </Text>
              <Button
                mode="outlined"
                icon="map-marker"
                onPress={() => handleContact("maps", mosqueData.address)}
                style={styles.directionsButton}
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
                <View style={styles.contactInfo}>
                  <Text
                    style={[
                      styles.contactLabel,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    📍 Address
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
                  onPress={() => handleContact("maps", mosqueData.address)}
                >
                  Map
                </Button>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.contactItem}>
                <View style={styles.contactInfo}>
                  <Text
                    style={[
                      styles.contactLabel,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    📞 Phone
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
                  onPress={() => handleContact("call", mosqueData.phone)}
                >
                  Call
                </Button>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.contactItem}>
                <View style={styles.contactInfo}>
                  <Text
                    style={[
                      styles.contactLabel,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    ✉️ Email
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
                    style={[styles.imamName, { color: theme.colors.onSurface }]}
                  >
                    {mosqueData.imam.name}
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
                  compact
                  icon="phone"
                  onPress={() => handleContact("call", mosqueData.imam.phone)}
                >
                  Call Imam
                </Button>
                <Button
                  mode="outlined"
                  compact
                  icon="email"
                  onPress={() => handleContact("email", mosqueData.imam.email)}
                >
                  Email
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Section>

        {/* Prayer Times */}
        <Section title="Prayer Times">
          <PrayerTimes times={prayerTimesList} />
        </Section>

        {/* Services & Facilities */}
        <Section title="Services & Facilities">
          <Card style={styles.servicesCard}>
            <Card.Content>
              <View style={styles.servicesGrid}>
                {mosqueData.services.map((service, index) => (
                  <Chip
                    key={index}
                    mode="outlined"
                    style={styles.serviceChip}
                    textStyle={styles.serviceChipText}
                  >
                    {service}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        </Section>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  overviewCard: {
    borderRadius: 16,
  },
  mosqueName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  established: {
    fontSize: 14,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  directionsButton: {
    borderRadius: 8,
  },
  contactCard: {
    borderRadius: 12,
  },
  contactContent: {
    gap: 8,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 8,
  },
  imamCard: {
    borderRadius: 12,
  },
  imamHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  imamAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  imamInitial: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  imamInfo: {
    flex: 1,
  },
  imamName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  imamBio: {
    fontSize: 14,
    lineHeight: 20,
  },
  imamActions: {
    flexDirection: "row",
    gap: 8,
  },
  servicesCard: {
    borderRadius: 12,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  serviceChip: {
    margin: 2,
  },
  serviceChipText: {
    fontSize: 12,
  },
});