// src/components/mosque/HistorySection.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTheme, Text, Card, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface HistorySectionProps {
  history: {
    background: string;
    landDetails: string;
    constructionDetails: string;
    founder: string;
    foundingMembers: string[];
    historicalPhotos: Array<{
      id: string;
      title: string;
      caption: string;
      url: string;
    }>;
  };
}

export const HistorySection: React.FC<HistorySectionProps> = ({ history }) => {
  const theme = useTheme();
  const router = useRouter();

  const handleViewFullHistory = () => {
    router.push("/mosque/mosque-history");
  };

  // Take only first 2 photos for preview
  const previewPhotos = history.historicalPhotos.slice(0, 2);

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Section Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons
              name="history"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Mosque History
            </Text>
          </View>
          <Button
            mode="text"
            compact
            onPress={handleViewFullHistory}
            textColor={theme.colors.primary}
            style={styles.viewAllButton}
          >
            View Full
          </Button>
        </View>

        {/* Historical Photos Preview */}
        {previewPhotos.length > 0 && (
          <View style={styles.photosContainer}>
            {previewPhotos.map((photo, index) => (
              <View key={photo.id} style={styles.photoContainer}>
                <Image
                  source={{ uri: photo.url }}
                  style={styles.photo}
                  resizeMode="cover"
                />
                <View style={styles.photoOverlay}>
                  <Text style={styles.photoTitle} numberOfLines={1}>
                    {photo.title}
                  </Text>
                </View>
                {index === 0 && (
                  <View style={styles.photoBadge}>
                    <Text style={styles.photoBadgeText}>Historical</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Quick Facts Grid */}
        <View style={styles.factsGrid}>
          <View style={styles.factItem}>
            <View
              style={[
                styles.factIcon,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={16}
                color={theme.colors.onPrimaryContainer}
              />
            </View>
            <Text style={[styles.factLabel, { color: theme.colors.onSurface }]}>
              Land Area
            </Text>
            <Text
              style={[
                styles.factValue,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {history.landDetails}
            </Text>
          </View>

          <View style={styles.factItem}>
            <View
              style={[
                styles.factIcon,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <MaterialCommunityIcons
                name="home-edit"
                size={16}
                color={theme.colors.onPrimaryContainer}
              />
            </View>
            <Text style={[styles.factLabel, { color: theme.colors.onSurface }]}>
              Construction
            </Text>
            <Text
              style={[
                styles.factValue,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={2}
            >
              {history.constructionDetails}
            </Text>
          </View>

          <View style={styles.factItem}>
            <View
              style={[
                styles.factIcon,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <MaterialCommunityIcons
                name="account-tie"
                size={16}
                color={theme.colors.onPrimaryContainer}
              />
            </View>
            <Text style={[styles.factLabel, { color: theme.colors.onSurface }]}>
              Founder
            </Text>
            <Text
              style={[
                styles.factValue,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={2}
            >
              {history.founder}
            </Text>
          </View>

          <View style={styles.factItem}>
            <View
              style={[
                styles.factIcon,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <MaterialCommunityIcons
                name="account-group"
                size={16}
                color={theme.colors.onPrimaryContainer}
              />
            </View>
            <Text style={[styles.factLabel, { color: theme.colors.onSurface }]}>
              Founding Members
            </Text>
            <Text
              style={[
                styles.factValue,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {history.foundingMembers.length} People
            </Text>
          </View>
        </View>

        {/* Background Preview */}
        <View style={styles.backgroundContainer}>
          <Text
            style={[
              styles.backgroundText,
              { color: theme.colors.onSurfaceVariant },
            ]}
            numberOfLines={3}
          >
            {history.background}
          </Text>
        </View>

        {/* View Full History Button */}
        <TouchableOpacity
          style={[
            styles.fullHistoryButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={handleViewFullHistory}
        >
          <Text style={styles.fullHistoryButtonText}>Explore Full History</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  viewAllButton: {
    borderRadius: 8,
  },
  photosContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  photoContainer: {
    flex: 1,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 8,
  },
  photoTitle: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  photoBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#f59e0b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  photoBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  factsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  factItem: {
    width: "47%",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(22, 163, 74, 0.05)",
  },
  factIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  factLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  factValue: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
  },
  backgroundContainer: {
    marginBottom: 16,
  },
  backgroundText: {
    fontSize: 14,
    lineHeight: 20,
  },
  fullHistoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  fullHistoryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
