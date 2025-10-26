// app/donation/amount.tsx - UPDATED WITH KEYBOARD AVOIDING VIEW
import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native"; // ✅ ADDED KeyboardAvoidingView
import {
  useTheme,
  Text,
  Card,
  Button,
  TextInput,
  Chip,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SimpleHeader } from "../../src/components/SimpleHeader";
import { Container } from "../../src/components/common/Container";
import { DonationData } from "../../src/types/donation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDonationTypeColor } from "../../src/utils/donationUtils";
import { useAuth } from "../../src/contexts/AuthContext";

const quickAmounts = [500, 1000, 2000, 5000];

export default function DonationAmountScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { isAuthenticated, user } = useAuth();

  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const selectedType = params.type as string;
  const selectedMonth = params.month as string;

  const handleContinue = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    const donationData: Partial<DonationData> = {
      type: selectedType,
      month: selectedMonth,
      amount: Number(amount),
      isAnonymous: !isAuthenticated,
      message: message.trim() || undefined,
      donorName: isAuthenticated ? user?.name : "Guest User",
      donorEmail: isAuthenticated ? user?.email : undefined,
    };

    router.push({
      pathname: "/donation/payment",
      params: {
        ...donationData,
        amount: amount,
        isAnonymous: (!isAuthenticated).toString(),
        donorName: isAuthenticated ? user?.name : "Guest User",
      },
    });
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleBackPress = () => {
    router.back();
  };

  const typeColor = getDonationTypeColor(selectedType, theme);

  return (
    <Container padding={false}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <SimpleHeader
        title="Donation Amount"
        showBackButton={true}
        onBackPress={handleBackPress}
      />

      {/* ✅ ADDED: Keyboard Avoiding View */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // ✅ Allows tapping outside to dismiss keyboard
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
                    Donor:
                  </Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      { color: theme.colors.primary, fontWeight: "600" },
                    ]}
                  >
                    {isAuthenticated ? user?.name : "Guest User"}
                  </Text>
                </View>
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
                      { backgroundColor: `${typeColor}20` },
                    ]}
                  >
                    <Text style={[styles.typeText, { color: typeColor }]}>
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
                <View style={styles.summaryRow}>
                  <Text
                    style={[
                      styles.summaryLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Anonymous:
                  </Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      {
                        color: !isAuthenticated
                          ? theme.colors.primary
                          : theme.colors.onSurface,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {!isAuthenticated ? "Yes" : "No"}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            {/* Amount Input */}
            <Card style={styles.sectionCard}>
              <Card.Content>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.onSurface },
                  ]}
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

            {/* Optional Message */}
            <Card style={styles.sectionCard}>
              <Card.Content>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.onSurface },
                  ]}
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

            {/* ✅ ADDED: Extra padding for keyboard space */}
            <View style={styles.keyboardSpacer} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  keyboardAvoid: {
    flex: 1,
  },
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
  keyboardSpacer: {
    height: 100, // ✅ Extra space for keyboard
  },
});
