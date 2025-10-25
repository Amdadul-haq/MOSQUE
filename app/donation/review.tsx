// app/donation/review.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import { useTheme, Text, Card, Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SimpleHeader } from "../../src/components/SimpleHeader";
import { Container } from "../../src/components/common/Container";
import { DonationData } from "../../src/types/donation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDonationManager } from "../../src/hooks/useDonationManager";
import {
  getDonationTypeColor,
  getPaymentMethodName,
} from "../../src/utils/donationUtils";
import * as Haptics from "expo-haptics";

export default function DonationReviewScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { addDonation } = useDonationManager();

  const [isConfirming, setIsConfirming] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Listen to progressAnim safely
  useEffect(() => {
    const id = progressAnim.addListener(({ value }) => {
      setProgress(value);
    });
    return () => {
      progressAnim.removeListener(id);
    };
  }, []);

  const selectedType = params.type as string;
  const selectedMonth = params.month as string;
  const amount = params.amount as string;
  const isAnonymous = params.isAnonymous === "true";
  const paymentMethod = params.paymentMethod as string;

  const donationData: DonationData = {
    type: selectedType,
    amount: Number(amount),
    month: selectedMonth,
    isAnonymous,
    paymentMethod,
  };

  // ✅ USE UTILITY FUNCTIONS
  const typeColor = getDonationTypeColor(selectedType, theme);
  const paymentName = getPaymentMethodName(paymentMethod);

  const handleConfirmPressIn = () => {
    if (isConfirming) return;

    setIsConfirming(true);
    progressAnim.setValue(0);

    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    animationRef.current.start(({ finished }) => {
      if (finished) {
        completeDonation();
      } else {
        setIsConfirming(false);
      }
    });
  };

  const handleConfirmPressOut = () => {
    if (!isConfirming) return;

    animationRef.current?.stop();
    setIsConfirming(false);
    progressAnim.setValue(0);
  };

  const completeDonation = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    addDonation({
      donor: isAnonymous ? "Anonymous" : "Current User",
      type: selectedType,
      amount: Number(amount),
      anonymous: isAnonymous,
    });

    router.replace({
      pathname: "/donation/success",
      params: {
        type: selectedType,
        amount: amount,
        month: selectedMonth,
        paymentMethod: paymentMethod,
        isAnonymous: isAnonymous.toString(),
      },
    });
  };

  const animatedBackgroundColor = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.primary, "#16a34a"],
  });

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

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
        title="Review Donation"
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
            <Card.Content>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Donation Summary
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Review your donation details before confirming
              </Text>

              <View style={styles.summaryList}>
                <View style={styles.summaryItem}>
                  <Text
                    style={[
                      styles.summaryLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Donation Type:
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

                <View style={styles.summaryItem}>
                  <Text
                    style={[
                      styles.summaryLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Amount:
                  </Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    ৳{amount} BDT
                  </Text>
                </View>

                <View style={styles.summaryItem}>
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

                <View style={styles.summaryItem}>
                  <Text
                    style={[
                      styles.summaryLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Payment Method:
                  </Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {paymentName}
                  </Text>
                </View>

                <View style={styles.summaryItem}>
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
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {isAnonymous ? "Yes" : "No"}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Tap & Hold Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.confirmButtonContainer}>
          <Animated.View
            style={[
              styles.progressBackground,
              {
                backgroundColor: animatedBackgroundColor,
                width: animatedWidth,
              },
            ]}
          />

          <Button
            mode="contained"
            onPressIn={handleConfirmPressIn}
            onPressOut={handleConfirmPressOut}
            disabled={isConfirming}
            style={[
              styles.confirmButton,
              {
                backgroundColor: isConfirming
                  ? "transparent"
                  : theme.colors.primary,
              },
            ]}
            contentStyle={styles.confirmButtonContent}
            labelStyle={[
              styles.confirmButtonLabel,
              { color: isConfirming ? theme.colors.primary : "white" },
            ]}
            icon={isConfirming ? "timer-sand" : "check-circle"}
          >
            {isConfirming ? "Hold..." : "Tap & Hold to Confirm"}
          </Button>
        </View>

        {isConfirming && (
          <Text
            style={[
              styles.progressText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Keep holding... {Math.round(progress * 100)}%
          </Text>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { padding: 16, gap: 16 },
  summaryCard: { borderRadius: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, marginBottom: 20 },
  summaryList: { gap: 12 },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  summaryLabel: { fontSize: 14, fontWeight: "500" },
  summaryValue: { fontSize: 14, fontWeight: "600" },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  typeText: { fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "transparent",
  },
  confirmButtonContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  progressBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    borderRadius: 10,
  },
  confirmButton: { borderRadius: 10, borderWidth: 0 },
  confirmButtonContent: { paddingVertical: 12 },
  confirmButtonLabel: { fontSize: 16, fontWeight: "700" },
  progressText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
  },
});
