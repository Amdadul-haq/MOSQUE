// app/financials/financials.tsx
import React from "react";
import { ScrollView, View, StyleSheet, StatusBar } from "react-native";
import { useTheme, Text, Card, Button, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import { Header } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockFinancialData } from "../../src/data/mockFinancialData";
import { formatCurrency } from "../../src/utils/formatters";
import { FinancialSummaryItem } from "../../src/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function FinancialsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentMonth, lifetime } = mockFinancialData;

  // Prepare current month summary data
  const currentMonthSummary: FinancialSummaryItem[] = [
    {
      label: "Total Donations",
      value: formatCurrency(currentMonth.totalDonations),
      amount: currentMonth.totalDonations,
      type: "donation",
      trend: "+12%",
      icon: "💰",
      color: theme.colors.primary,
    },
    {
      label: "Total Expenses",
      value: formatCurrency(currentMonth.totalExpenses),
      amount: currentMonth.totalExpenses,
      type: "expense",
      trend: "+8%",
      icon: "💸",
      color: "#ef4444",
    },
    {
      label: "Remaining Balance",
      value: formatCurrency(currentMonth.balance),
      amount: currentMonth.balance,
      type: "balance",
      trend: "+15%",
      icon: "📊",
      color: "#16a34a",
    },
  ];

  // Prepare lifetime summary data
  const lifetimeSummary: FinancialSummaryItem[] = [
    {
      label: "Total Donations",
      value: formatCurrency(lifetime.totalDonations),
      amount: lifetime.totalDonations,
      type: "donation",
      icon: "💰",
      color: theme.colors.primary,
    },
    {
      label: "Total Expenses",
      value: formatCurrency(lifetime.totalExpenses),
      amount: lifetime.totalExpenses,
      type: "expense",
      icon: "💸",
      color: "#ef4444",
    },
    {
      label: "Net Balance",
      value: formatCurrency(lifetime.netBalance),
      amount: lifetime.netBalance,
      type: "balance",
      icon: "📈",
      color: "#16a34a",
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const getIconColor = (type: "donation" | "expense" | "balance") => {
    switch (type) {
      case "donation":
        return theme.colors.primary;
      case "expense":
        return "#ef4444";
      case "balance":
        return "#16a34a";
      default:
        return theme.colors.onSurface;
    }
  };

  const getTrendColor = (trend: string) => {
    return trend?.startsWith("+") ? "#16a34a" : "#ef4444";
  };

  return (
    <Container padding={false}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <Header
        title="Mosque Financials"
        showBackButton={true}
        onBackPress={handleBack}
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
          {/* Current Month Financial Summary */}
          <Section
            title={`${currentMonth.month} ${currentMonth.year} Financial Summary`}
            subtitle="Current month overview"
          >
            <Card style={styles.summaryCard}>
              <Card.Content style={styles.summaryContent}>
                {currentMonthSummary.map((item, index) => (
                  <View key={item.label}>
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryLeft}>
                        <View style={styles.iconContainer}>
                          <Text style={styles.iconText}>{item.icon}</Text>
                        </View>
                        <View style={styles.summaryText}>
                          <Text
                            style={[
                              styles.summaryLabel,
                              { color: theme.colors.onSurfaceVariant },
                            ]}
                          >
                            {item.label}
                          </Text>
                          <Text
                            style={[
                              styles.summaryValue,
                              { color: getIconColor(item.type) },
                            ]}
                          >
                            {item.value}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.summaryRight}>
                        {item.trend && (
                          <Text
                            style={[
                              styles.trendText,
                              { color: getTrendColor(item.trend) },
                            ]}
                          >
                            {item.trend}
                          </Text>
                        )}
                      </View>
                    </View>
                    {index < currentMonthSummary.length - 1 && (
                      <Divider style={styles.divider} />
                    )}
                  </View>
                ))}
              </Card.Content>
            </Card>

            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.statText, { color: theme.colors.onSurface }]}
                >
                  {currentMonth.donationCount} donations
                </Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="file-document"
                  size={20}
                  color="#ef4444"
                />
                <Text
                  style={[styles.statText, { color: theme.colors.onSurface }]}
                >
                  {currentMonth.expenseCount} expenses
                </Text>
              </View>
            </View>
          </Section>

          {/* Lifetime Overview */}
          <Section
            title="Lifetime Overview"
            subtitle="Total financial performance"
          >
            <Card style={styles.lifetimeCard}>
              <Card.Content style={styles.lifetimeContent}>
                {lifetimeSummary.map((item, index) => (
                  <View key={item.label}>
                    <View style={styles.lifetimeRow}>
                      <View style={styles.lifetimeLeft}>
                        <View style={styles.iconContainer}>
                          <Text style={styles.iconText}>{item.icon}</Text>
                        </View>
                        <View style={styles.lifetimeText}>
                          <Text
                            style={[
                              styles.lifetimeLabel,
                              { color: theme.colors.onSurfaceVariant },
                            ]}
                          >
                            {item.label}
                          </Text>
                          <Text
                            style={[
                              styles.lifetimeValue,
                              { color: getIconColor(item.type) },
                            ]}
                          >
                            {item.value}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {index < lifetimeSummary.length - 1 && (
                      <Divider style={styles.divider} />
                    )}
                  </View>
                ))}
              </Card.Content>
            </Card>

            {/* Additional Lifetime Stats */}
            <View style={styles.additionalStats}>
              <Card style={styles.additionalStatCard} mode="outlined">
                <Card.Content style={styles.additionalStatContent}>
                  <View style={styles.additionalStat}>
                    <MaterialCommunityIcons
                      name="chart-line"
                      size={16}
                      color={theme.colors.primary}
                    />
                    <Text
                      style={[
                        styles.additionalStatLabel,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      Avg. Monthly Donations
                    </Text>
                    <Text
                      style={[
                        styles.additionalStatValue,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {formatCurrency(lifetime.averageMonthlyDonations)}
                    </Text>
                  </View>
                  <View style={styles.additionalStat}>
                    <MaterialCommunityIcons
                      name="chart-bar"
                      size={16}
                      color="#ef4444"
                    />
                    <Text
                      style={[
                        styles.additionalStatLabel,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      Avg. Monthly Expenses
                    </Text>
                    <Text
                      style={[styles.additionalStatValue, { color: "#ef4444" }]}
                    >
                      {formatCurrency(lifetime.averageMonthlyExpenses)}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </View>
          </Section>

          {/* Future Features Note */}
          <Section title="Comming Soon">
            <Card style={styles.futureCard} mode="contained">
              <Card.Content style={styles.futureContent}>
                <MaterialCommunityIcons
                  name="lightbulb-on"
                  size={24}
                  color={theme.colors.primary}
                />
                <View style={styles.futureText}>
                  <Text
                    style={[
                      styles.futureTitle,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Coming Soon
                  </Text>
                  <Text
                    style={[
                      styles.futureDescription,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Annual reports, expense categories, and export features
                  </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  summaryCard: {
    borderRadius: 16,
    marginBottom: 12,
  },
  summaryContent: {
    paddingVertical: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(22, 163, 74, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  summaryRight: {
    marginLeft: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    marginVertical: 0,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: "500",
  },
  lifetimeCard: {
    borderRadius: 16,
    marginBottom: 12,
  },
  lifetimeContent: {
    paddingVertical: 8,
  },
  lifetimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  lifetimeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  lifetimeText: {
    flex: 1,
  },
  lifetimeLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  lifetimeValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  additionalStats: {
    marginTop: 8,
  },
  additionalStatCard: {
    borderRadius: 12,
  },
  additionalStatContent: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  additionalStat: {
    alignItems: "center",
    gap: 4,
  },
  additionalStatLabel: {
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },
  additionalStatValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  futureCard: {
    borderRadius: 16,
    backgroundColor: "rgba(22, 163, 74, 0.05)",
  },
  futureContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  futureText: {
    flex: 1,
    marginLeft: 12,
  },
  futureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  futureDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
});
