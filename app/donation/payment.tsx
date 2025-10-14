// app/donation/payment.tsx
import React, { useState } from "react";
import { ScrollView, View, StyleSheet, StatusBar } from "react-native";
import { useTheme, Text, Card, Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Header, SimpleHeader } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { DonationData, PaymentMethod } from "../../src/types/donation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const paymentMethods: PaymentMethod[] = [
  {
    id: "bkash",
    name: "bKash",
    description: "Send money to our bKash account",
    icon: "📱",
    accountNumber: "017XXXXXXXX",
    instructions:
      "Send money to this number and include donation ID in reference",
  },
  {
    id: "nagad",
    name: "Nagad",
    description: "Send money to our Nagad account",
    icon: "📲",
    accountNumber: "017XXXXXXXX",
    instructions:
      "Send money to this number and include donation ID in reference",
  },
  {
    id: "rocket",
    name: "Rocket",
    description: "Send money to our Rocket account",
    icon: "💳",
    accountNumber: "017XXXXXXXX",
    instructions:
      "Send money to this number and include donation ID in reference",
  },
  {
    id: "cash",
    name: "Cash",
    description: "Pay directly at mosque office",
    icon: "💵",
    instructions: "Visit mosque office during working hours",
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
                        borderColor: theme.colors.primary,
                        backgroundColor: `${theme.colors.primary}10`,
                      },
                    ]}
                    onPress={() => setSelectedPayment(method.id)}
                    mode="elevated"
                  >
                    <Card.Content style={styles.paymentMethodContent}>
                      <View style={styles.paymentMethodHeader}>
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

                      {method.accountNumber && (
                        <View style={styles.accountInfo}>
                          <Text
                            style={[
                              styles.accountLabel,
                              { color: theme.colors.onSurfaceVariant },
                            ]}
                          >
                            Send to:
                          </Text>
                          <Text
                            style={[
                              styles.accountNumber,
                              { color: theme.colors.primary },
                            ]}
                          >
                            {method.accountNumber}
                          </Text>
                        </View>
                      )}

                      <Text
                        style={[
                          styles.instructions,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {method.instructions}
                      </Text>
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
    marginBottom: 12,
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
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 6,
  },
  accountLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginRight: 4,
  },
  accountNumber: {
    fontSize: 14,
    fontWeight: "700",
  },
  instructions: {
    fontSize: 11,
    fontStyle: "italic",
    lineHeight: 14,
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
