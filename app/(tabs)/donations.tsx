//app/(tabs)/donations.tsx
import React, { useState } from "react";
import { ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import {
  useTheme,
  Text,
  Card,
  Button,
  DataTable,
  FAB,
} from "react-native-paper";
import { Header } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { StatsGrid } from "../../src/components/StatsGrid";
import { useDonationManager } from "../../src/hooks/useDonationManager";
import {
  formatCurrency,
  formatDate,
  capitalizeWords,
} from "../../src/utils/formatters";

export default function DonationsScreen() {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    donations,
    addDonation,
    getMonthlyTotal,
    totalDonations,
    monthlyDonationCount,
  } = useDonationManager();

  const donationStats = [
    {
      label: "Monthly Total",
      value: formatCurrency(getMonthlyTotal()),
      icon: "💰",
      color: theme.colors.primary,
    },
    {
      label: "Total Donations",
      value: totalDonations.toString(),
      icon: "📊",
      color: theme.colors.secondary,
    },
    {
      label: "This Month",
      value: monthlyDonationCount.toString(),
      icon: "📅",
      color: "#f59e0b",
    },
  ];

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleAddDonation = (donationData: Omit<Donation, "id" | "date">) => {
    addDonation(donationData);
    setShowAddModal(false);
  };

  const donationTypes = [
    {
      type: "zakat",
      description: "Obligatory charity (2.5% of wealth)",
      color: "#16a34a",
    },
    { type: "sadaqah", description: "Voluntary charity", color: "#f59e0b" },
    {
      type: "construction",
      description: "Mosque development fund",
      color: "#ef4444",
    },
    { type: "other", description: "Other charitable causes", color: "#8b5cf6" },
  ];

  return (
    <Container padding={false}>
      <Header
        title="Donations"
        subtitle="Support your mosque community"
        rightComponent={
          <Button
            mode="contained"
            onPress={() => setShowAddModal(true)}
            icon="plus"
            compact
          >
            Add
          </Button>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Donation Summary */}
        <Section title="Donation Overview">
          <StatsGrid stats={donationStats} />
        </Section>

        {/* Recent Donations Table */}
        <Section
          title="Recent Donations"
          action={
            <Button mode="text" compact>
              View All
            </Button>
          }
        >
          <Card style={styles.tableCard}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Donor</DataTable.Title>
                <DataTable.Title>Type</DataTable.Title>
                <DataTable.Title numeric>Amount</DataTable.Title>
              </DataTable.Header>

              {donations.slice(0, 5).map((donation) => (
                <DataTable.Row key={donation.id}>
                  <DataTable.Cell>
                    <View>
                      <Text style={styles.donorName}>
                        {donation.anonymous ? "Anonymous" : donation.donor}
                      </Text>
                      <Text
                        style={[
                          styles.donationDate,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {formatDate(donation.date)}
                      </Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <View
                      style={[
                        styles.typeBadge,
                        {
                          backgroundColor: `${
                            donationTypes.find((t) => t.type === donation.type)
                              ?.color
                          }20`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeText,
                          {
                            color: donationTypes.find(
                              (t) => t.type === donation.type
                            )?.color,
                          },
                        ]}
                      >
                        {capitalizeWords(donation.type)}
                      </Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text
                      style={[styles.amount, { color: theme.colors.primary }]}
                    >
                      {formatCurrency(donation.amount)}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>

            {donations.length === 0 && (
              <View style={styles.emptyState}>
                <Text
                  style={[
                    styles.emptyText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  No donations yet
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => setShowAddModal(true)}
                  style={styles.emptyButton}
                >
                  Make First Donation
                </Button>
              </View>
            )}
          </Card>
        </Section>

        {/* Donation Types Info */}
        <Section title="Donation Types">
          <Card style={styles.typesCard}>
            <Card.Content>
              {donationTypes.map((typeInfo, index) => (
                <View
                  key={typeInfo.type}
                  style={[
                    styles.typeItem,
                    index !== donationTypes.length - 1 && styles.typeItemBorder,
                    { borderBottomColor: theme.colors.outline },
                  ]}
                >
                  <View style={styles.typeHeader}>
                    <View
                      style={[
                        styles.typeColor,
                        { backgroundColor: typeInfo.color },
                      ]}
                    />
                    <Text
                      style={[
                        styles.typeName,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {capitalizeWords(typeInfo.type)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.typeDescription,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {typeInfo.description}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        </Section>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowAddModal(true)}
        color="white"
      />

      {/* Add Donation Modal */}
      {/* We'll create this as a separate component */}
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  tableCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  donorName: {
    fontSize: 14,
    fontWeight: "600",
  },
  donationDate: {
    fontSize: 12,
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  typeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  amount: {
    fontSize: 14,
    fontWeight: "700",
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  emptyButton: {
    borderRadius: 8,
  },
  typesCard: {
    borderRadius: 12,
  },
  typeItem: {
    paddingVertical: 12,
  },
  typeItemBorder: {
    borderBottomWidth: 1,
  },
  typeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  typeColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  typeName: {
    fontSize: 16,
    fontWeight: "600",
  },
  typeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});