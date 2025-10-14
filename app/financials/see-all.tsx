// app/financials/financials.tsx - Complete Updated Version
import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useTheme, Text, Card, Button, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import { Header, SimpleHeader } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { Section } from "../../src/components/common/Section";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockFinancialData } from "../../src/data/mockFinancialData";
import { formatCurrency } from "../../src/utils/formatters";
import { FinancialSummaryItem } from "../../src/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FinancialChart from "../../src/components/financials/FinancialChart";
import CategoryBreakdown from "../../src/components/financials/CategoryBreakdown";
import LineChart from "../../src/components/financials/LineChart";
import PDFReportModal from "../../src/components/financials/PDFReportModal";
import { PDFReportData } from "../../src/types/pdf-report";

export default function FinancialsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  const { currentMonth, monthlyTrends, lifetime } = mockFinancialData;

  // Refresh function
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Current month summary
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

  // Lifetime summary
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

  // Prepare PDF report data
  const pdfReportData: PDFReportData = {
    mosqueName: "Khiarpara Jame Masjid",
    reportPeriod: `${currentMonth.month} ${currentMonth.year}`,
    generatedDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    financialSummary: {
      totalDonations: currentMonth.totalDonations,
      totalExpenses: currentMonth.totalExpenses,
      netBalance: currentMonth.balance,
      donationCount: currentMonth.donationCount,
      expenseCount: currentMonth.expenseCount,
    },
    donationBreakdown: currentMonth.categories
      .filter((cat) => cat.type === "donation")
      .map((cat) => ({
        category: cat.name,
        amount: cat.amount,
        percentage: cat.percentage,
        type: "donation" as const,
      })),
    expenseBreakdown: currentMonth.categories
      .filter((cat) => cat.type === "expense")
      .map((cat) => ({
        category: cat.name,
        amount: cat.amount,
        percentage: cat.percentage,
        type: "expense" as const,
      })),
    monthlyTrends: monthlyTrends.map((trend) => ({
      month: trend.month,
      donations: trend.donations,
      expenses: trend.expenses,
      balance: trend.balance,
    })),
    notes: "Generated automatically from Mosque Management System",
  };

  const handleBack = () => {
    router.back();
  };

  const handleExportPDF = () => {
    setPdfModalVisible(true);
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

      <SimpleHeader
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
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

          {/* Monthly Trends Bar Chart */}
          <Section title="Monthly Trends" subtitle="Donations vs Expenses">
            <FinancialChart data={monthlyTrends} />
          </Section>

          {/* Line Chart */}
          <Section title="Financial Growth" subtitle="Balance trend over time">
            <LineChart data={monthlyTrends} />
          </Section>

          {/* Donation Categories */}
          <Section
            title="Donation Breakdown"
            subtitle="Where donations come from"
          >
            <CategoryBreakdown
              categories={currentMonth.categories}
              type="donation"
              title="Donation Sources"
            />
          </Section>

          {/* Expense Categories */}
          <Section
            title="Expense Breakdown"
            subtitle="Where funds are allocated"
          >
            <CategoryBreakdown
              categories={currentMonth.categories}
              type="expense"
              title="Expense Categories"
            />
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

          {/* Export Features */}
          <Section title="Reports & Export" subtitle="Download financial data">
            <Card style={styles.featuresCard}>
              <Card.Content style={styles.featuresContent}>
                <View style={styles.featureItem}>
                  <MaterialCommunityIcons
                    name="file-pdf-box"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <View style={styles.featureText}>
                    <Text
                      style={[
                        styles.featureTitle,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      PDF Financial Report
                    </Text>
                    <Text
                      style={[
                        styles.featureDescription,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      Detailed monthly financial statement
                    </Text>
                  </View>
                  <Button
                    mode="outlined"
                    compact
                    style={styles.featureButton}
                    onPress={handleExportPDF}
                  >
                    Export PDF
                  </Button>
                </View>

                <Divider style={styles.featureDivider} />

                <View style={styles.featureItem}>
                  <MaterialCommunityIcons
                    name="file-excel"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <View style={styles.featureText}>
                    <Text
                      style={[
                        styles.featureTitle,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      Excel Data Export
                    </Text>
                    <Text
                      style={[
                        styles.featureDescription,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      Raw financial data for analysis
                    </Text>
                  </View>
                  <Button
                    mode="outlined"
                    compact
                    style={styles.featureButton}
                    onPress={handleExportPDF}
                  >
                    Export Excel
                  </Button>
                </View>

                <Divider style={styles.featureDivider} />

                <View style={styles.featureItem}>
                  <MaterialCommunityIcons
                    name="chart-box"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <View style={styles.featureText}>
                    <Text
                      style={[
                        styles.featureTitle,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      Annual Report 2024
                    </Text>
                    <Text
                      style={[
                        styles.featureDescription,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      Complete yearly financial summary
                    </Text>
                  </View>
                  <Button mode="contained" compact style={styles.featureButton}>
                    View Report
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </Section>
        </View>
      </ScrollView>

      {/* PDF Export Modal */}
      <PDFReportModal
        visible={pdfModalVisible}
        onDismiss={() => setPdfModalVisible(false)}
        reportData={pdfReportData}
      />
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
  featuresCard: {
    borderRadius: 16,
  },
  featuresContent: {
    paddingVertical: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  featureText: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  featureButton: {
    marginLeft: 12,
  },
  featureDivider: {
    marginVertical: 0,
  },
});
