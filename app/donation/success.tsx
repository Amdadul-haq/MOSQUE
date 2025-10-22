// app/donation/success.tsx
import React, { useRef } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import { useTheme, Text, Card, Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import {SimpleHeader } from "../../src/components/SimpleHeader";
import { Container } from "../../src/components/common/Container";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import * as Haptics from "expo-haptics";

export default function DonationSuccessScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const receiptRef = useRef<View>(null);

  const selectedType = params.type as string;
  const selectedMonth = params.month as string;
  const amount = params.amount as string;
  const paymentMethod = params.paymentMethod as string;
  const isAnonymous = params.isAnonymous === "true";

  const donationId = `DON-${Date.now().toString().slice(-6)}`;
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleGoHome = () => {
    router.replace("/(tabs)");
  };

  const handleDonateAgain = () => {
    router.replace("/donation/type");
  };

  const downloadReceipt = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (!receiptRef.current) {
        Alert.alert("Error", "Unable to generate receipt");
        return;
      }

      // Capture the receipt as image
      const uri = await captureRef(receiptRef.current, {
        format: "png",
        quality: 1,
      });

      // In development build, we can use MediaLibrary directly
      try {
        // Request permission
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status === "granted") {
          // Save directly to gallery
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync("Downloads", asset, false);

          Alert.alert(
            "✅ Receipt Downloaded",
            "Donation receipt has been saved to your Photos gallery in 'Downloads' album",
            [{ text: "OK" }]
          );
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
        } else {
          // If permission denied, use sharing as fallback
          Alert.alert(
            "Permission Required",
            "Please allow photo library access to save receipts directly. Using sharing instead.",
            [{ text: "OK", onPress: () => shareReceiptDirect(uri) }]
          );
        }
      } catch (mediaError) {
        console.log("Media library error:", mediaError);
        // Fallback to sharing
        await shareReceiptDirect(uri);
      }
    } catch (error) {
      console.error("Error downloading receipt:", error);
      Alert.alert("Error", "Failed to download receipt. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const shareReceiptDirect = async (uri: string) => {
    try {
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Save Donation Receipt",
        UTI: "image/png",
      });
    } catch (shareError) {
      console.error("Error sharing:", shareError);
      Alert.alert("Error", "Failed to share receipt.");
    }
  };

  const shareReceipt = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (!receiptRef.current) return;

      const uri = await captureRef(receiptRef.current, {
        format: "png",
        quality: 0.8,
      });

      await shareReceiptDirect(uri);
    } catch (error) {
      console.error("Error sharing receipt:", error);
      Alert.alert("Error", "Failed to share receipt. Please try again.");
    }
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

  const formatTypeName = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Container padding={false}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <SimpleHeader title="Donation Complete" showBackButton={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
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

          {/* Receipt Card - This will be captured as image */}
          <View ref={receiptRef} collapsable={false}>
            <Card style={styles.receiptCard}>
              <Card.Content>
                {/* Receipt Header */}
                <View style={styles.receiptHeader}>
                  <Text style={styles.mosqueName}>Khiarpara Jame Moshjid</Text>
                  <Text style={styles.receiptTitle}>DONATION RECEIPT</Text>
                  <Text style={styles.receiptSubtitle}>
                    Official Tax Deductible Receipt
                  </Text>
                </View>

                {/* Receipt Details */}
                <View style={styles.receiptDetails}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Receipt No:</Text>
                    <Text style={styles.receiptValue}>{donationId}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Date:</Text>
                    <Text style={styles.receiptValue}>{currentDate}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Time:</Text>
                    <Text style={styles.receiptValue}>{currentTime}</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Donation Type:</Text>
                    <Text
                      style={[styles.receiptValue, { color: getTypeColor() }]}
                    >
                      {formatTypeName(selectedType)}
                    </Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Amount:</Text>
                    <Text style={styles.receiptAmount}>৳{amount} BDT</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Month:</Text>
                    <Text style={styles.receiptValue}>
                      {selectedMonth} 2024
                    </Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Payment Method:</Text>
                    <Text style={styles.receiptValue}>
                      {getPaymentMethodName(paymentMethod)}
                    </Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Anonymous:</Text>
                    <Text style={styles.receiptValue}>
                      {isAnonymous ? "Yes" : "No"}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.signatureSection}>
                    <Text style={styles.signatureLabel}>
                      Authorized Signature
                    </Text>
                    <View style={styles.signatureLine} />
                    <Text style={styles.mosqueStamp}>
                      Khiarpara Jame Moshjid
                    </Text>
                  </View>

                  <View style={styles.footerNote}>
                    <Text style={styles.footerText}>
                      This receipt is issued for tax deduction purposes as per
                      Bangladesh tax laws.
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Receipt Actions */}
          <Card style={styles.messageCard}>
            <Card.Content>
              <Text
                style={[styles.actionsTitle, { color: theme.colors.onSurface }]}
              >
                Download Receipt
              </Text>
              <Text
                style={[
                  styles.actionsSubtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Save your donation receipt directly to your device
              </Text>

              <View style={styles.receiptActions}>
                <Button
                  mode="contained"
                  onPress={downloadReceipt}
                  style={styles.receiptButton}
                  contentStyle={styles.receiptButtonContent}
                  icon="download"
                >
                  Download to Gallery
                </Button>

                <Button
                  mode="outlined"
                  onPress={shareReceipt}
                  style={styles.receiptButton}
                  contentStyle={styles.receiptButtonContent}
                  icon="share-variant"
                >
                  Share Receipt
                </Button>
              </View>
            </Card.Content>
          </Card>

          {/* Navigation Actions */}
          <View style={styles.navigationContainer}>
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
    padding: 24,
    gap: 24,
    minHeight: "100%",
  },
  successHeader: {
    alignItems: "center",
    marginBottom: 8,
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
  receiptCard: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#16a34a",
    backgroundColor: "white",
  },
  receiptHeader: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#16a34a",
  },
  mosqueName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: 4,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
    marginBottom: 2,
  },
  receiptSubtitle: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  receiptDetails: {
    gap: 8,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  receiptLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  receiptValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
    flex: 1,
    textAlign: "right",
  },
  receiptAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#16a34a",
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  signatureSection: {
    alignItems: "center",
    marginTop: 16,
  },
  signatureLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 8,
  },
  signatureLine: {
    width: "60%",
    height: 1,
    backgroundColor: "#000",
    marginBottom: 4,
  },
  mosqueStamp: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16a34a",
    fontStyle: "italic",
  },
  footerNote: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
  },
  footerText: {
    fontSize: 9,
    color: "#666",
    textAlign: "center",
    lineHeight: 12,
  },
  actionsCard: {
    borderRadius: 16,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  actionsSubtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 16,
  },
  receiptActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  receiptButton: {
    flex: 1,
    borderRadius: 8,
  },
  receiptButtonContent: {
    paddingVertical: 6,
  },
  downloadInstructions: {
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#16a34a",
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  messageCard: {
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
  },
  gratitudeText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontStyle: "italic",
  },
  navigationContainer: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 12,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
});
