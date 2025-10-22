import React, { useState } from "react";
import { ScrollView, View, StyleSheet, StatusBar } from "react-native";
import { useTheme, Text, Card, Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SimpleHeader } from "../../src/components/SimpleHeader";
import { Container } from "../../src/components/common/Container";
import { DonationData, PaymentMethod } from "../../src/types/donation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const paymentMethods: PaymentMethod[] = [
  {
    id: "bkash",
    name: "bKash",
    description: "Send money to our bKash account",
    icon: "📱",
    color: "#e2136e",
  },
  {
    id: "nagad",
    name: "Nagad",
    description: "Send money to our Nagad account",
    icon: "📲",
    color: "#f8a61c",
  },
  {
    id: "rocket",
    name: "Rocket",
    description: "Send money to our Rocket account",
    icon: "💳",
    color: "#7848b5",
  },
  {
    id: "cash",
    name: "Cash",
    description: "Pay directly at mosque office",
    icon: "💵",
    color: "#16a34a",
  },
];

export default function DonationPaymentScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [selectedPayment, setSelectedPayment] = useState<string>("");

  const selectedType = params.type as string;
  const selectedMonth = params.month as string;
  const amount = params.amount as string;
  const isAnonymous = params.isAnonymous === "true";

  const handleContinue = () => {
    if (!selectedPayment) return;

    const donationData: Partial<DonationData> = {
      type: selectedType,
      month: selectedMonth,
      amount: Number(amount),
      isAnonymous,
      paymentMethod: selectedPayment,
    };

    router.push({
      pathname: "/donation/review",
      params: {
        ...donationData,
        amount: amount,
        isAnonymous: isAnonymous.toString(),
        paymentMethod: selectedPayment,
      },
    });
  };

  const getTypeColor = () => {
    const typeColors: { [key: string]: string } = {
      zakat: "#16a34a",
      sadaqah: "#f59e0b",
      construction: "#ef4444",
      education: "#8b5cf6",
    };
    return typeColors[selectedType] || theme.colors.primary;
  };
  const handleBackPress = () => {
    router.back();
  }

  return (
    <Container padding={false}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <SimpleHeader
        title="Payment Method"
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
          {/* Donation Summary */}
          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Donation:
                </Text>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: `${getTypeColor()}20` },
                  ]}
                >
                  <Text style={[styles.typeText, { color: getTypeColor() }]}>
                    {selectedType} - ৳{amount}
                  </Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Month:
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {selectedMonth}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Payment Methods */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Select Payment Method
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Choose how you want to pay
              </Text>

              <View style={styles.paymentMethodsContainer}>
                {paymentMethods.map((method) => (
                  <Card
                    key={method.id}
                    style={[
                      styles.paymentMethodCard,
                      selectedPayment === method.id && {
                        borderColor: method.color,
                        backgroundColor: `${method.color}10`,
                      },
                    ]}
                    onPress={() => setSelectedPayment(method.id)}
                    mode="elevated"
                  >
                    <Card.Content style={styles.paymentMethodContent}>
                      <View style={styles.paymentMethodHeader}>
                        <View style={styles.paymentMethodLeft}>
                          <Text style={styles.paymentMethodIcon}>
                            {method.icon}
                          </Text>
                          <View style={styles.paymentMethodInfo}>
                            <Text
                              style={[
                                styles.paymentMethodName,
                                { color: theme.colors.onSurface },
                              ]}
                            >
                              {method.name}
                            </Text>
                            <Text
                              style={[
                                styles.paymentMethodDescription,
                                { color: theme.colors.onSurfaceVariant },
                              ]}
                            >
                              {method.description}
                            </Text>
                          </View>
                        </View>

                        {/* Tick Mark - Only show when selected */}
                        {selectedPayment === method.id && (
                          <View
                            style={[
                              styles.tickContainer,
                              { backgroundColor: method.color },
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
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={!selectedPayment}
          style={styles.continueButton}
          contentStyle={styles.continueButtonContent}
          icon="arrow-right"
        >
          Review Donation
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
  summaryCard: {
    borderRadius: 16,
  },
  summaryContent: {
    paddingVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  sectionCard: {
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  paymentMethodsContainer: {
    gap: 12,
  },
  paymentMethodCard: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  paymentMethodContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  paymentMethodHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentMethodLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  paymentMethodDescription: {
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
