// app/mosque/mosque-history.tsx
import React from "react";
import { ScrollView, View, StyleSheet, Image, StatusBar } from "react-native";
import { useTheme, Text, Card, Chip } from "react-native-paper";
import { SimpleHeader } from "../../src/components/SimpleHeader";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mosqueData } from "../../src/data/mosqueMockData";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function MosqueHistoryScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { history } = mosqueData;

  const handleBackPress = () => {
    router.back();
  };

  return (
    <Container padding={false}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <SimpleHeader
        title="Mosque History"
        showBackButton={true}
        onBackPress={handleBackPress}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={styles.content}>
          {/* Hero Section */}
          <Card style={styles.heroCard}>
            <Card.Content style={styles.heroContent}>
              <View style={styles.heroIcon}>
                <MaterialCommunityIcons
                  name="mosque"
                  size={48}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.heroText}>
                <Text
                  style={[styles.heroTitle, { color: theme.colors.primary }]}
                >
                  Our Legacy
                </Text>
                <Text
                  style={[
                    styles.heroSubtitle,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {mosqueData.name} - Since {mosqueData.established}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Historical Timeline */}
          <Section title="Historical Timeline">
            <Card style={styles.timelineCard}>
              <Card.Content>
                {/* 1972 - Foundation */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineMarker}>
                    <View
                      style={[
                        styles.markerDot,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    />
                    <View
                      style={[
                        styles.timelineLine,
                        { backgroundColor: theme.colors.outline },
                      ]}
                    />
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text
                        style={[
                          styles.timelineYear,
                          { color: theme.colors.primary },
                        ]}
                      >
                        1972
                      </Text>
                      <Chip mode="outlined" compact textStyle={styles.chipText}>
                        Foundation
                      </Chip>
                    </View>
                    <Text
                      style={[
                        styles.timelineTitle,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      Mosque Establishment
                    </Text>
                    <Text
                      style={[
                        styles.timelineDescription,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      Founded by {history.founder} and community members.
                      Started as a small tin-shed structure serving the local
                      Muslim community.
                    </Text>
                  </View>
                </View>

                {/* 1985 - First Expansion */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineMarker}>
                    <View
                      style={[
                        styles.markerDot,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    />
                    <View
                      style={[
                        styles.timelineLine,
                        { backgroundColor: theme.colors.outline },
                      ]}
                    />
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text
                        style={[
                          styles.timelineYear,
                          { color: theme.colors.primary },
                        ]}
                      >
                        1985
                      </Text>
                      <Chip mode="outlined" compact textStyle={styles.chipText}>
                        Expansion
                      </Chip>
                    </View>
                    <Text
                      style={[
                        styles.timelineTitle,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      First Concrete Building
                    </Text>
                    <Text
                      style={[
                        styles.timelineDescription,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      Constructed the first permanent concrete structure,
                      expanding capacity and facilities for the growing
                      community.
                    </Text>
                  </View>
                </View>

                {/* 2010 - Modern Facility */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineMarker}>
                    <View
                      style={[
                        styles.markerDot,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    />
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text
                        style={[
                          styles.timelineYear,
                          { color: theme.colors.primary },
                        ]}
                      >
                        2010
                      </Text>
                      <Chip mode="outlined" compact textStyle={styles.chipText}>
                        Modernization
                      </Chip>
                    </View>
                    <Text
                      style={[
                        styles.timelineTitle,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      Current Modern Facility
                    </Text>
                    <Text
                      style={[
                        styles.timelineDescription,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      Completed the current modern mosque building with enhanced
                      amenities, larger prayer hall, and improved facilities.
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </Section>

          {/* Historical Photos */}
          <Section title="Historical Photos">
            <Card style={styles.photosCard}>
              <Card.Content>
                <View style={styles.photosGrid}>
                  {history.historicalPhotos.map((photo) => (
                    <View key={photo.id} style={styles.photoCard}>
                      <Image
                        source={{ uri: photo.url }}
                        style={styles.historicalPhoto}
                        resizeMode="cover"
                      />
                      <View style={styles.photoInfo}>
                        <Text
                          style={[
                            styles.photoTitle,
                            { color: theme.colors.onSurface },
                          ]}
                        >
                          {photo.title}
                        </Text>
                        <Text
                          style={[
                            styles.photoCaption,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                        >
                          {photo.caption}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>
          </Section>

          {/* Founding Members */}
          <Section title="Founding Members">
            <Card style={styles.membersCard}>
              <Card.Content>
                <View style={styles.membersList}>
                  {history.foundingMembers.map((member, index) => (
                    <View key={index} style={styles.memberItem}>
                      <View
                        style={[
                          styles.memberAvatar,
                          { backgroundColor: theme.colors.primaryContainer },
                        ]}
                      >
                        <Text
                          style={[
                            styles.memberInitial,
                            { color: theme.colors.onPrimaryContainer },
                          ]}
                        >
                          {member.split(" ")[0][0]}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.memberName,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        {member}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>
          </Section>

          {/* Land and Construction Details */}
          <Section title="Property Details">
            <View style={styles.detailsGrid}>
              <Card style={styles.detailCard}>
                <Card.Content style={styles.detailContent}>
                  <MaterialCommunityIcons
                    name="map-marker-radius"
                    size={32}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.detailTitle,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Land Area
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {history.landDetails}
                  </Text>
                </Card.Content>
              </Card>

              <Card style={styles.detailCard}>
                <Card.Content style={styles.detailContent}>
                  <MaterialCommunityIcons
                    name="home-edit"
                    size={32}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.detailTitle,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Construction
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {history.constructionDetails}
                  </Text>
                </Card.Content>
              </Card>
            </View>
          </Section>

          {/* Full Background Story */}
          <Section title="Our Story">
            <Card style={styles.storyCard}>
              <Card.Content>
                <Text
                  style={[
                    styles.storyText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {history.background}
                </Text>
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
  heroCard: {
    borderRadius: 20,
    marginBottom: 24,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  heroIcon: {
    marginRight: 16,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  timelineCard: {
    borderRadius: 16,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
  },
  timelineMarker: {
    alignItems: "center",
    marginRight: 16,
  },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8,
  },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timelineYear: {
    fontSize: 16,
    fontWeight: "700",
  },
  chipText: {
    fontSize: 10,
    fontWeight: "700",
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  timelineDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  photosCard: {
    borderRadius: 16,
  },
  photosGrid: {
    gap: 16,
  },
  photoCard: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
  },
  historicalPhoto: {
    width: "100%",
    height: 200,
  },
  photoInfo: {
    padding: 12,
  },
  photoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  photoCaption: {
    fontSize: 14,
    lineHeight: 18,
  },
  membersCard: {
    borderRadius: 16,
  },
  membersList: {
    gap: 12,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberInitial: {
    fontSize: 16,
    fontWeight: "600",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "500",
  },
  detailsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  detailCard: {
    flex: 1,
    borderRadius: 12,
  },
  detailContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  detailValue: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  storyCard: {
    borderRadius: 16,
  },
  storyText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: "justify",
  },
});
