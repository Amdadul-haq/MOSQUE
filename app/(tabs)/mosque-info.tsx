// app/(tabs)/mosque-info.tsx - Updated version
import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Linking,
  StatusBar,
  RefreshControl,
  Image,
} from "react-native";
import {
  useTheme,
  Text,
  Card,
  Button,
  Chip,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { SimpleHeader } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { MosqueInfo } from "../../src/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mosqueData } from "../../src/data/mosqueMockData";
import { HistorySection } from "../../src/components/mosque/HistorySection";
import { MosqueGallery } from "../../src/components/mosque/MosqueGallery";
import { CommitteeGrid } from "../../src/components/mosque/CommitteeGrid";
import { useTabNavigation } from "../../src/hooks/useTabNavigation"; // ✅ NEW IMPORT

export default function MosqueInfoScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // ✅ REPLACED: Using tab navigation hook instead of local states
  const { isLoading, handleRefresh } = useTabNavigation("mosqueInfo");

  // Simulate API call with loading state
  const fetchMosqueData = useCallback(async () => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In real app, here would be actual API call
      // const response = await api.getMosqueInfo();
      // setMosqueData(response.data);
    } catch (error) {
      console.error("Error fetching mosque data:", error);
    }
  }, []);

  // ✅ UPDATED: Using handleRefresh from useTabNavigation
  const onRefresh = useCallback(async () => {
    handleRefresh();
  }, [handleRefresh]);

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

  // ✅ ADDED: Loading State UI
  if (isLoading) {
    return (
      <Container padding={false}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <SimpleHeader
          title="Mosque Information"
          
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.loadingSpinner}
          />
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            Loading Mosque Information...
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

      <SimpleHeader title="Mosque Information"/>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        // ✅ UPDATED: Refresh control with theme colors
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
          {/* Mosque Header with Main Photo */}
          <Section title="Mosque Information">
            <Card style={styles.mosqueHeaderCard}>
              <Card.Content>
                <View style={styles.mosqueImageContainer}>
                  {mosqueData.mainPhoto ? (
                    <Image
                      source={{ uri: mosqueData.mainPhoto }} // ✅ Cloudinary URL ব্যবহার করা হচ্ছে
                      style={styles.mosqueImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.mosqueImagePlaceholder}>
                      <Text style={styles.mosqueImageText}>
                        Mosque Main Photo
                      </Text>
                    </View>
                  )}
                </View>

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

          {/* Mosque Gallery */}
          <Section title="Photo Gallery">
            <MosqueGallery images={mosqueData.gallery} />
          </Section>

          {/* Mosque History */}
          <HistorySection history={mosqueData.history} />

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
                    onPress={() => handleContact("maps", mosqueData.address)}
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
                  {mosqueData.imam.photo ? ( // ✅ Imam এর photo আছে কিনা check
                    <Image
                      source={{ uri: mosqueData.imam.photo }} // ✅ Cloudinary URL
                      style={styles.imamPhoto}
                      resizeMode="cover"
                    />
                  ) : (
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
                  )}
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
                      style={[styles.imamRole, { color: theme.colors.primary }]}
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
                    onPress={() => handleContact("call", mosqueData.imam.phone)}
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

          {/* Committee Members */}
          <Section title="Committee Members">
            <CommitteeGrid members={mosqueData.committeeMembers} />
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
  mosqueHeaderCard: {
    borderRadius: 20,
  },
  mosqueImageContainer: {
    marginBottom: 16,
  },
  mosqueImagePlaceholder: {
    height: 200,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mosqueImageText: {
    color: "#6b7280",
    fontSize: 16,
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
  // ✅ Mosque Main Image style
  mosqueImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },

  // ✅ Imam Photo style
  imamPhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
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
});
