// src/components/PDFReportModal.tsx - Fixed with permission handling
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Modal,
  Portal,
  Text,
  Button,
  Card,
  RadioButton,
  Switch,
  ActivityIndicator,
} from "react-native-paper";
import { useTheme } from "react-native-paper";
import { PDFReportData, PDFExportConfig } from "../types/pdf-report";
import { PDFService } from "../services/pdf-service";

interface PDFReportModalProps {
  visible: boolean;
  onDismiss: () => void;
  reportData: PDFReportData;
}

export default function PDFReportModal({
  visible,
  onDismiss,
  reportData,
}: PDFReportModalProps) {
  const theme = useTheme();
  const [exportConfig, setExportConfig] = useState<PDFExportConfig>({
    includeCharts: true,
    includeDetails: true,
    passwordProtected: false,
    format: "A4",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "excel">("pdf");
  const [hasGalleryPermission, setHasGalleryPermission] = useState<
    boolean | null
  >(null);

  // Check permissions when modal opens
  // useEffect(() => {
  //   if (visible) {
  //     checkPermissions();
  //   }
  // }, [visible]);

  // const checkPermissions = async () => {
  //   const hasPerm = await PDFService.checkGalleryPermissions();
  //   setHasGalleryPermission(hasPerm);
  // };

const handleGenerateReport = async () => {
  setIsGenerating(true);

  try {
    console.log(`Starting ${exportType} export...`);

    if (exportType === "pdf") {
      await PDFService.generateFinancialReport(reportData, exportConfig);
    } else {
      await PDFService.generateExcelExport(reportData);
    }

    Alert.alert(
      "✅ Export Ready",
      `Your ${exportType.toUpperCase()} file is ready!\n\nUse the share dialog to:\n• Open in browser\n• Save to Downloads\n• Save to Google Drive\n• Send via email\n• Save to any other app`,
      [{ text: "OK", onPress: onDismiss }]
    );
  } catch (error: any) {
    console.error("Export error:", error);
    Alert.alert(
      "❌ Export Failed",
      error.message || "Failed to generate report. Please try again.",
      [{ text: "OK" }]
    );
  } finally {
    setIsGenerating(false);
  }
};
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Card
          style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}
        >
          <Card.Content>
            <Text
              style={[styles.modalTitle, { color: theme.colors.onSurface }]}
            >
              Export Financial Report
            </Text>

            <Text
              style={[
                styles.reportInfo,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {reportData.mosqueName} - {reportData.reportPeriod}
            </Text>

            {/* Permission Status */}
            {hasGalleryPermission === false && (
              <View style={styles.permissionWarning}>
                <Text style={styles.permissionText}>
                  ⚠️ Gallery access required to save reports
                </Text>
              </View>
            )}

            {/* Export Type Selection */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Export Format
              </Text>
              <RadioButton.Group
                onValueChange={(value) =>
                  setExportType(value as "pdf" | "excel")
                }
                value={exportType}
              >
                <View style={styles.radioOption}>
                  <RadioButton value="pdf" />
                  <Text
                    style={[
                      styles.radioLabel,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    PDF Document
                  </Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="excel" />
                  <Text
                    style={[
                      styles.radioLabel,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Excel Spreadsheet (CSV)
                  </Text>
                </View>
              </RadioButton.Group>
            </View>

            {/* Export Options */}
            {exportType === "pdf" && (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  PDF Options
                </Text>

                <View style={styles.optionRow}>
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Include Charts & Trends
                  </Text>
                  <Switch
                    value={exportConfig.includeCharts}
                    onValueChange={(value) =>
                      setExportConfig((prev) => ({
                        ...prev,
                        includeCharts: value,
                      }))
                    }
                  />
                </View>

                <View style={styles.optionRow}>
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Include Detailed Breakdown
                  </Text>
                  <Switch
                    value={exportConfig.includeDetails}
                    onValueChange={(value) =>
                      setExportConfig((prev) => ({
                        ...prev,
                        includeDetails: value,
                      }))
                    }
                  />
                </View>

                {/* Page Format */}
                <Text
                  style={[
                    styles.subSectionTitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Page Format
                </Text>
                <RadioButton.Group
                  onValueChange={(value) =>
                    setExportConfig((prev) => ({
                      ...prev,
                      format: value as "A4" | "Letter",
                    }))
                  }
                  value={exportConfig.format}
                >
                  <View style={styles.radioOption}>
                    <RadioButton value="A4" />
                    <Text
                      style={[
                        styles.radioLabel,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      A4 (International)
                    </Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton value="Letter" />
                    <Text
                      style={[
                        styles.radioLabel,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      Letter (US)
                    </Text>
                  </View>
                </RadioButton.Group>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actions}>
              <Button
                mode="outlined"
                onPress={onDismiss}
                style={styles.button}
                disabled={isGenerating}
              >
                Cancel
              </Button>

              <Button
                mode="contained"
                onPress={handleGenerateReport}
                style={styles.button}
                disabled={isGenerating}
                icon={
                  isGenerating
                    ? () => <ActivityIndicator size={16} color="white" />
                    : "file-export"
                }
              >
                {isGenerating
                  ? "Generating..."
                  : `Export ${exportType.toUpperCase()}`}
              </Button>
            </View>

            {/* Preview Info */}
            <View style={styles.previewInfo}>
              <Text
                style={[
                  styles.previewText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                📄 Preview:{" "}
                {PDFService.getReportTemplate(reportData)
                  .split("\n")
                  .slice(0, 3)
                  .join("\n")}
                ...
              </Text>
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
  },
  modalCard: {
    borderRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  reportInfo: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionWarning: {
    backgroundColor: "#fff3cd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  permissionText: {
    color: "#856404",
    fontSize: 12,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 14,
    flex: 1,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  previewInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 8,
  },
  previewText: {
    fontSize: 12,
    fontFamily: "monospace",
  },
});
