// app/donation/type.tsx
import React, { useState } from "react";
import { ScrollView, View, StyleSheet, StatusBar } from "react-native";
import {
  useTheme,
  Text,
  Card,
  Button,
  Menu,
  Divider,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Header } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { DonationData, DonationType } from "../../src/types/donation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const donationTypes: DonationType[] = [
  {
    id: "zakat",
    name: "Zakat",
    description: "Obligatory charity (2.5% of wealth)",
    icon: "🔄",
    color: "#16a34a",
  },
  {
    id: "sadaqah",
    name: "Sadaqah",
    description: "Voluntary charity",
    icon: "💖",
    color: "#f59e0b",
  },
  {
    id: "construction",
    name: "Construction Fund",
    description: "Mosque development and maintenance",
    icon: "🏗️",
    color: "#ef4444",
  },
  {
    id: "education",
    name: "Education Fund",
    description: "Educational programs and resources",
    icon: "📚",
    color: "#8b5cf6",
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
  const params = useLocalSearchParams();

  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    months[new Date().getMonth()]
  );
  const [showMonthMenu, setShowMonthMenu] = useState(false);

  const handleContinue = () => {
    if (!selectedType) return;

    const donationData: Partial<DonationData> = {
      type: selectedType,
      month: selectedMonth,
    };

    router.push({
      pathname: "/donation/amount",
      params: {
        type: selectedType,
        month: selectedMonth,
      },
    });
  };

  return (
    <Container padding={false}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <Header
        title="Make Donation"
        showBackButton={true}
        onBackPress={() => router.back()}
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
                      <Text style={styles.typeIcon}>{type.icon}</Text>
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
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  typeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 12,
    lineHeight: 16,
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
