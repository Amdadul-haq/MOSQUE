// app/(tabs)/donations.tsx - UPDATED WITH CUSTOM DIALOG
import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from "react-native";
import {
  useTheme,
  Text,
  Card,
  Button,
  DataTable,
  FAB,
  SegmentedButtons,
  Chip,
  ActivityIndicator,
  Dialog,
  Portal,
} from "react-native-paper"; // ✅ ADDED Dialog, Portal
import { SimpleHeader } from "../../src/components/SimpleHeader";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { StatsGrid } from "../../src/components/StatsGrid";
import { useDonationManager } from "../../src/hooks/useDonationManager";
import { useRouter } from "expo-router";
import { useTabNavigation } from "../../src/hooks/useTabNavigation";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  formatCurrency,
  formatDate,
  capitalizeWords,
} from "../../src/utils/formatters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

type TimeFilter = "all" | "month" | "week" | "today";

export default function DonationsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { isLoading, handleRefresh } = useTabNavigation("donations");
  const { isAuthenticated } = useAuth();

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [guestDialogVisible, setGuestDialogVisible] = useState(false); // ✅ ADDED

  const {
    donations,
    getMonthlyTotal,
    getWeeklyTotal,
    getTodayTotal,
    donationStats,
  } = useDonationManager();

  const filteredDonations = donations.filter((donation) => {
    if (typeFilter !== "all" && donation.type !== typeFilter) return false;

    const donationDate = new Date(donation.date);
    const now = new Date();

    switch (timeFilter) {
      case "today":
        return donationDate.toDateString() === now.toDateString();
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return donationDate >= weekAgo;
      case "month":
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
        return donationDate >= monthAgo;
      default:
        return true;
    }
  });

  const getCurrentTotal = () => {
    switch (timeFilter) {
      case "today":
        return getTodayTotal();
      case "week":
        return getWeeklyTotal();
      case "month":
        return getMonthlyTotal();
      default:
        return donationStats.totalAmount;
    }
  };

  const donationStatsData = [
    {
      label: "Total",
      value: formatCurrency(getCurrentTotal()),
      icon: "💰",
      color: theme.colors.primary,
      trend: "+12%",
    },
    {
      label: "Donations",
      value: filteredDonations.length.toString(),
      icon: "📊",
      color: theme.colors.secondary,
      trend: "+5%",
    },
    {
      label: "Avg. Donation",
      value: formatCurrency(
        filteredDonations.length > 0
          ? getCurrentTotal() / filteredDonations.length
          : 0
      ),
      icon: "📈",
      color: theme.colors.secondary,
      trend: "+8%",
    },
  ];

  const donationTypes = [
    {
      type: "zakat",
      description: "Obligatory charity (2.5% of wealth)",
      color: theme.colors.primary,
      icon: "scale-balance",
    },
    {
      type: "sadaqah",
      description: "Voluntary charity",
      color: theme.colors.secondary,
      icon: "heart",
    },
    {
      type: "construction",
      description: "Mosque development fund",
      color: "#10b981",
      icon: "home",
    },
    {
      type: "education",
      description: "Educational programs",
      color: "#10b981",
      icon: "school",
    },
    {
      type: "other",
      description: "Other charitable causes",
      color: theme.colors.secondary,
      icon: "charity",
    },
  ];

  // ✅ UPDATED: Show custom dialog instead of direct navigation
  const handleAddDonation = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!isAuthenticated) {
      // Show custom dialog for guest users
      setGuestDialogVisible(true);
      return;
    }

    // User is authenticated, proceed to donation flow
    router.push("/donation/type");
  };

  // ✅ ADDED: Handle guest donation
  const handleGuestDonation = () => {
    setGuestDialogVisible(false);
    router.push("/donation/type");
  };

  // ✅ ADDED: Handle login with redirect
  const handleLoginForDonation = () => {
    setGuestDialogVisible(false);
    router.push({
      pathname: "/(auth)/login",
      params: {
        redirect: "/donation/type",
      },
    });
  };

  // ✅ UPDATED: Handle "Make First Donation" button
  const handleMakeFirstDonation = () => {
    if (!isAuthenticated) {
      setGuestDialogVisible(true);
      return;
    }

    router.push("/donation/type");
  };

  const onRefresh = () => {
    handleRefresh();
  };

  if (isLoading) {
    return (
      <Container padding={false}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <SimpleHeader title="Donations" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.loadingSpinner}
          />
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            Loading Donations...
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

      <SimpleHeader title="Donations" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Donation Summary */}
          <Section title="Donation Overview">
            <StatsGrid stats={donationStatsData} />
          </Section>

          {/* Time Filter */}
          <Section title="Filter by Time">
            <SegmentedButtons
              value={timeFilter}
              onValueChange={setTimeFilter}
              buttons={[
                { value: "today", label: "Today" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
                { value: "all", label: "All Time" },
              ]}
              style={styles.segmentedButtons}
            />
          </Section>

          {/* Type Filter */}
          <Section title="Filter by Type">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                <Chip
                  selected={typeFilter === "all"}
                  onPress={() => setTypeFilter("all")}
                  style={styles.chip}
                  showSelectedCheck={false}
                >
                  All Types
                </Chip>
                {donationTypes.map((type) => (
                  <Chip
                    key={type.type}
                    selected={typeFilter === type.type}
                    onPress={() => setTypeFilter(type.type)}
                    style={styles.chip}
                    showSelectedCheck={false}
                    mode="outlined"
                  >
                    {capitalizeWords(type.type)}
                  </Chip>
                ))}
              </View>
            </ScrollView>
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
            <Card
              style={[
                styles.tableCard,
                {
                  borderWidth: 1,
                  borderColor: theme.colors.surfaceVariant,
                },
              ]}
            >
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Donor</DataTable.Title>
                  <DataTable.Title>Type</DataTable.Title>
                  <DataTable.Title numeric>Amount</DataTable.Title>
                </DataTable.Header>

                {filteredDonations.slice(0, 6).map((donation) => (
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
                              donationTypes.find(
                                (t) => t.type === donation.type
                              )?.color
                            }15`,
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

              {filteredDonations.length === 0 && (
                <View style={styles.emptyState}>
                  <Text
                    style={[
                      styles.emptyText,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    No donations found
                  </Text>
                  <Button
                    mode="outlined"
                    onPress={handleMakeFirstDonation}
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
            <Card
              style={[
                styles.typesCard,
                {
                  borderWidth: 1,
                  borderColor: theme.colors.surfaceVariant,
                },
              ]}
            >
              <Card.Content style={styles.typesContent}>
                {donationTypes.map((typeInfo, index) => (
                  <View
                    key={typeInfo.type}
                    style={[
                      styles.typeItem,
                      index !== donationTypes.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.surfaceVariant,
                      },
                    ]}
                  >
                    <View style={styles.typeHeader}>
                      <View style={styles.typeLeft}>
                        <View
                          style={[
                            styles.typeColor,
                            { backgroundColor: typeInfo.color },
                          ]}
                        />
                        <View>
                          <Text
                            style={[
                              styles.typeName,
                              { color: theme.colors.onSurface },
                            ]}
                          >
                            {capitalizeWords(typeInfo.type)}
                          </Text>
                          <Text
                            style={[
                              styles.typeDescription,
                              { color: theme.colors.onSurfaceVariant },
                            ]}
                          >
                            {typeInfo.description}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.typeStats}>
                        <Text
                          style={[styles.typeAmount, { color: typeInfo.color }]}
                        >
                          {formatCurrency(
                            donations
                              .filter((d) => d.type === typeInfo.type)
                              .reduce((sum, d) => sum + d.amount, 0)
                          )}
                        </Text>
                        <Text
                          style={[
                            styles.typeCount,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                        >
                          {
                            donations.filter((d) => d.type === typeInfo.type)
                              .length
                          }
                          donations
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>
          </Section>
        </View>
      </ScrollView>

      {/* FAB Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddDonation}
        color="white"
        label="Add Donation"
      />

      {/* ✅ ADDED: Guest Donation Dialog */}
      <Portal>
        <Dialog
          visible={guestDialogVisible}
          onDismiss={() => setGuestDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Icon
            icon="account-question"
            size={40}
            color={theme.colors.primary}
          />
          <Dialog.Title style={styles.dialogTitle}>
            Continue as Guest?
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.dialogText}>
              📝{" "}
              <Text style={{ fontWeight: "bold" }}>You're not logged in</Text>
            </Text>
            <Text variant="bodyMedium" style={styles.dialogText}>
              • Your donation history won't be saved for future reference
            </Text>
            <Text variant="bodyMedium" style={styles.dialogText}>
              • You won't be able to track your contributions
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.dialogText, styles.recommendation]}
            >
              💡{" "}
              <Text style={{ fontWeight: "bold" }}>
                We recommend creating an account
              </Text>{" "}
              to keep track of your charitable activities and receive updates on
              how your donations are making a difference.
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              mode="outlined"
              onPress={handleGuestDonation}
              style={styles.guestButton}
              textColor={theme.colors.onSurfaceVariant}
            >
              Donate as Guest
            </Button>
            <Button
              mode="contained"
              onPress={handleLoginForDonation}
              style={styles.loginButton}
            >
              Log In to Continue
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  },
  addButton: {
    borderRadius: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    marginRight: 8,
  },
  tableCard: {
    borderRadius: 16,
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
    borderRadius: 16,
  },
  typesContent: {
    paddingVertical: 8,
  },
  typeItem: {
    paddingVertical: 12,
  },
  typeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  typeColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
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
  typeStats: {
    alignItems: "flex-end",
  },
  typeAmount: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  typeCount: {
    fontSize: 11,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
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
  dialog: {
    borderRadius: 20,
    backgroundColor: "white",
  },
  dialogTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },
  dialogText: {
    marginBottom: 8,
    lineHeight: 20,
  },
  recommendation: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0ea5e9",
  },
  dialogActions: {
    flexDirection: "column",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  guestButton: {
    width: "100%",
    borderRadius: 12,
  },
  loginButton: {
    width: "100%",
    borderRadius: 12,
  },
});
