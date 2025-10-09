// app/donation/success.tsx
import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { useTheme, Text, Card, Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Header } from "../../src/components/Header";
import { Container } from "../../src/components/common/Container";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DonationSuccessScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const selectedType = params.type as string;
  const selectedMonth = params.month as string;
  const amount = params.amount as string;
  const paymentMethod = params.paymentMethod as string;
  const isAnonymous = params.isAnonymous === "true";

  const donationId = `DON-${Date.now().toString().slice(-6)}`;

  const handleGoHome = () => {
    router.replace("/(tabs)");
  };

  const handleDonateAgain = () => {
    router.replace("/donation/type");
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

  const getPaymentMethodName = (method: string) => {
    const methodNames: { [key: string]: string } = {
      bkash: "bKash",
      nagad: "Nagad",
      rocket: "Rocket",
      cash: "Cash",
    };
    return methodNames[method] || method;
  };

  return (
    <Container padding={false}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <Header title="Donation Complete" showBackButton={false} />

      <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        {/* Success Icon & Message */}
        <View style={styles.successHeader}>
          <View
            style={[
              styles.successIcon,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text
            style={[styles.successTitle, { color: theme.colors.onSurface }]}
          >
            Donation Successful!
          </Text>
          <Text
            style={[
              styles.successSubtitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Thank you for your generosity
          </Text>
        </View>

        {/* Donation Details */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text
              style={[styles.detailsTitle, { color: theme.colors.onSurface }]}
            >
              Donation Details
            </Text>

            <View style={styles.detailsList}>
              <View style={styles.detailItem}>
                <Text
                  style={[
                    styles.detailLabel,
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

              <View style={styles.detailItem}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Amount:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  ৳{amount} BDT
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Month:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {selectedMonth}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Payment:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {getPaymentMethodName(paymentMethod)}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Donation ID:
                </Text>
                <Text
                  style={[styles.donationId, { color: theme.colors.primary }]}
                >
                  {donationId}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Gratitude Message */}
        <Card style={styles.messageCard}>
          <Card.Content>
            <Text
              style={[styles.gratitudeText, { color: theme.colors.onSurface }]}
            >
              "Thank you for your generous donation. May Allah accept your
              charity and reward you abundantly in this life and the hereafter."
            </Text>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            mode="outlined"
            onPress={handleGoHome}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            icon="home"
          >
            Go to Home
          </Button>

          <Button
            mode="contained"
            onPress={handleDonateAgain}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            icon="heart"
          >
            Donate Again
          </Button>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  successHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successIconText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  detailsCard: {
    borderRadius: 16,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  detailsList: {
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  detailValue: {
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
  donationId: {
    fontSize: 14,
    fontWeight: "700",
  },
  messageCard: {
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: "#f8f9fa",
  },
  gratitudeText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontStyle: "italic",
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
});
