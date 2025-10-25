// app/donation/type.tsx
import React, { useState } from "react";
import { ScrollView, View, StyleSheet, StatusBar } from "react-native";
import { useTheme, Text, Card, Button, Menu } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SimpleHeader } from "../../src/components/SimpleHeader";
import { Container } from "../../src/components/common/Container";
import { DonationData, DonationType } from "../../src/types/donation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDonationTypeColor } from "../../src/utils/donationUtils"; // ✅ ADDED

// ✅ FIXED: Use theme colors through utility function
const getDonationTypes = (theme: any) => [
  {
    id: "zakat",
    name: "Zakat",
    description: "Obligatory charity (2.5% of wealth)",
    icon: "🔄",
    color: getDonationTypeColor("zakat", theme), // ✅ USE UTILITY
  },
  {
    id: "sadaqah",
    name: "Sadaqah",
    description: "Voluntary charity",
    icon: "💖",
    color: getDonationTypeColor("sadaqah", theme), // ✅ USE UTILITY
  },
  {
    id: "construction",
    name: "Construction Fund",
    description: "Mosque development and maintenance",
    icon: "🏗️",
    color: getDonationTypeColor("construction", theme), // ✅ USE UTILITY
  },
  {
    id: "education",
    name: "Education Fund",
    description: "Educational programs and resources",
    icon: "📚",
    color: getDonationTypeColor("education", theme), // ✅ USE UTILITY
  },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DonationTypeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ✅ FIXED: Remove unused params
  // const params = useLocalSearchParams(); // ❌ REMOVED

  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    months[new Date().getMonth()]
  );
  const [showMonthMenu, setShowMonthMenu] = useState(false);

  // ✅ FIXED: Get donation types with theme colors
  const donationTypes = getDonationTypes(theme);

  const handleContinue = () => {
    if (!selectedType) return;

    // ✅ FIXED: Only include necessary data for this step
    router.push({
      pathname: "/donation/amount",
      params: {
        type: selectedType,
        month: selectedMonth,
      },
    });
  };

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
        title="Make Donation"
        showBackButton={true}
        onBackPress={handleBackPress}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Donation Type Selection */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Choose Donation Type
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Select the purpose of your donation
              </Text>

              <View style={styles.typesGrid}>
                {donationTypes.map((type) => (
                  <Card
                    key={type.id}
                    style={[
                      styles.typeCard,
                      selectedType === type.id && {
                        borderColor: type.color,
                        backgroundColor: `${type.color}10`,
                      },
                    ]}
                    onPress={() => setSelectedType(type.id)}
                    mode="elevated"
                  >
                    <Card.Content style={styles.typeContent}>
                      <View style={styles.typeHeader}>
                        <View style={styles.typeLeft}>
                          <Text style={styles.typeIcon}>{type.icon}</Text>
                          <View style={styles.typeTextContainer}>
                            <Text
                              style={[
                                styles.typeName,
                                { color: theme.colors.onSurface },
                              ]}
                            >
                              {type.name}
                            </Text>
                            <Text
                              style={[
                                styles.typeDescription,
                                { color: theme.colors.onSurfaceVariant },
                              ]}
                            >
                              {type.description}
                            </Text>
                          </View>
                        </View>

                        {/* Tick Mark - Only show when selected */}
                        {selectedType === type.id && (
                          <View
                            style={[
                              styles.tickContainer,
                              { backgroundColor: type.color },
                            ]}
                          >
                            <Text style={styles.tickMark}>✓</Text>
                          </View>
                        )}
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Month Selection */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Select Month
              </Text>

              <Menu
                visible={showMonthMenu}
                onDismiss={() => setShowMonthMenu(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setShowMonthMenu(true)}
                    style={styles.monthButton}
                    contentStyle={styles.monthButtonContent}
                    icon="calendar-month"
                  >
                    {selectedMonth} {new Date().getFullYear()}
                  </Button>
                }
              >
                {months.map((month) => (
                  <Menu.Item
                    key={month}
                    onPress={() => {
                      setSelectedMonth(month);
                      setShowMonthMenu(false);
                    }}
                    title={month}
                    style={
                      selectedMonth === month
                        ? { backgroundColor: theme.colors.surfaceVariant }
                        : undefined
                    }
                  />
                ))}
              </Menu>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={!selectedType}
          style={styles.continueButton}
          contentStyle={styles.continueButtonContent}
          icon="arrow-right"
        >
          Continue to Amount
        </Button>
      </View>
    </Container>
  );
}

// ✅ KEEP THE SAME STYLES (they're good)
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  sectionCard: {
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  typesGrid: {
    gap: 12,
  },
  typeCard: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  typeContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  typeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  typeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  typeTextContainer: {
    flex: 1,
  },
  typeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  typeDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  tickContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  tickMark: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  monthButton: {
    borderRadius: 12,
    borderWidth: 1.5,
  },
  monthButtonContent: {
    paddingVertical: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "transparent",
  },
  continueButton: {
    borderRadius: 12,
  },
  continueButtonContent: {
    paddingVertical: 8,
  },
});
