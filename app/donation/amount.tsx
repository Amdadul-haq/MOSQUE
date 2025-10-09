// app/donation/amount.tsx
import React, { useState } from "react";
import { ScrollView, View, StyleSheet, StatusBar } from "react-native";
import {
  useTheme,
  Text,
  Card,
  Button,
  TextInput,
  Switch,
  Chip,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Header } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { DonationData } from "../../src/types/donation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const quickAmounts = [500, 1000, 2000, 5000];

export default function DonationAmountScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [amount, setAmount] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const selectedType = params.type as string;
  const selectedMonth = params.month as string;

  const handleContinue = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    const donationData: Partial<DonationData> = {
      type: selectedType,
      month: selectedMonth,
      amount: Number(amount),
      isAnonymous,
      message: message.trim() || undefined,
    };

    router.push({
      pathname: "/donation/payment",
      params: {
        ...donationData,
        amount: amount,
        isAnonymous: isAnonymous.toString(),
      },
    });
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
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

      <Header
        title="Donation Amount"
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
                  Type:
                </Text>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: `${getTypeColor()}20` },
                  ]}
                >
                  <Text style={[styles.typeText, { color: getTypeColor() }]}>
                    {selectedType}
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

          {/* Amount Input */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Enter Amount
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                How much would you like to donate?
              </Text>

              <View style={styles.amountInputContainer}>
                <TextInput
                  mode="outlined"
                  placeholder="0"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  style={styles.amountInput}
                  contentStyle={styles.amountInputContent}
                  outlineStyle={styles.amountInputOutline}
                  left={
                    <TextInput.Affix
                      text="৳"
                      textStyle={styles.currencyAffix}
                    />
                  }
                />
                <Text
                  style={[
                    styles.currencyLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  BDT
                </Text>
              </View>

              {/* Quick Amounts */}
              <Text
                style={[
                  styles.quickAmountsLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Quick Amounts:
              </Text>
              <View style={styles.quickAmountsContainer}>
                {quickAmounts.map((quickAmount) => (
                  <Chip
                    key={quickAmount}
                    mode="outlined"
                    selected={amount === quickAmount.toString()}
                    onPress={() => handleQuickAmount(quickAmount)}
                    style={[
                      styles.quickAmountChip,
                      amount === quickAmount.toString() && {
                        backgroundColor: theme.colors.primary,
                        borderColor: theme.colors.primary,
                      },
                    ]}
                    textStyle={[
                      styles.quickAmountText,
                      amount === quickAmount.toString() && { color: "white" },
                    ]}
                    showSelectedCheck={false}
                  >
                    ৳{quickAmount}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Anonymous Toggle */}
          <Card style={styles.sectionCard}>
            <Card.Content style={styles.anonymousContent}>
              <View style={styles.anonymousRow}>
                <View style={styles.anonymousInfo}>
                  <Text
                    style={[
                      styles.anonymousTitle,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Make this donation anonymous
                  </Text>
                  <Text
                    style={[
                      styles.anonymousDescription,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Your name will not be shown publicly
                  </Text>
                </View>
                <Switch
                  value={isAnonymous}
                  onValueChange={setIsAnonymous}
                  color={theme.colors.primary}
                />
              </View>
            </Card.Content>
          </Card>

          {/* Optional Message */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Optional Message
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Add a note with your donation (optional)
              </Text>

              <TextInput
                mode="outlined"
                placeholder="Write your message here..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={3}
                style={styles.messageInput}
                contentStyle={styles.messageInputContent}
                outlineStyle={styles.messageInputOutline}
              />
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0}
          style={styles.continueButton}
          contentStyle={styles.continueButtonContent}
          icon="arrow-right"
        >
          Continue to Payment
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
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  amountInputContent: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
  },
  amountInputOutline: {
    borderRadius: 12,
  },
  currencyAffix: {
    fontSize: 20,
    fontWeight: "700",
    color: "#666",
  },
  currencyLabel: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  quickAmountsLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  quickAmountsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickAmountChip: {
    borderRadius: 20,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: "600",
  },
  anonymousContent: {
    paddingVertical: 8,
  },
  anonymousRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  anonymousInfo: {
    flex: 1,
    marginRight: 16,
  },
  anonymousTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  anonymousDescription: {
    fontSize: 12,
  },
  messageInput: {
    marginTop: 8,
  },
  messageInputContent: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  messageInputOutline: {
    borderRadius: 12,
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
