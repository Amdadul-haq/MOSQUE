// src/components/FinancialChart.tsx
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useTheme, Text } from "react-native-paper";
import Svg, { Rect, G, Line, Text as SvgText } from "react-native-svg";
import { MonthlyTrend } from "../../types";
import { formatCurrency } from "../../utils/formatters";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_WIDTH - 64; // 32 padding each side
const CHART_HEIGHT = 200;
const BAR_WIDTH = 12;
const SPACING = (CHART_WIDTH - 12 * BAR_WIDTH) / 11;

interface FinancialChartProps {
  data: MonthlyTrend[];
}

export default function FinancialChart({ data }: FinancialChartProps) {
  const theme = useTheme();

  // Find max value for scaling
  const maxValue = Math.max(
    ...data.map((item) => Math.max(item.donations, item.expenses))
  );

  // Scale factor for bar heights
  const scale = (CHART_HEIGHT - 40) / maxValue;

  return (
    <View style={styles.container}>
      <Text style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
        Monthly Trends
      </Text>

      <View style={styles.chartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* Grid Lines */}
          <G>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <G key={index}>
                <Line
                  x1={0}
                  y1={CHART_HEIGHT - 40 - ratio * (CHART_HEIGHT - 40)}
                  x2={CHART_WIDTH}
                  y2={CHART_HEIGHT - 40 - ratio * (CHART_HEIGHT - 40)}
                  stroke={theme.colors.surfaceVariant}
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
                <SvgText
                  x={CHART_WIDTH - 30}
                  y={CHART_HEIGHT - 40 - ratio * (CHART_HEIGHT - 40) - 4}
                  fontSize="10"
                  fill={theme.colors.onSurfaceVariant}
                  textAnchor="end"
                >
                  {formatCurrency(ratio * maxValue)}
                </SvgText>
              </G>
            ))}
          </G>

          {/* Bars */}
          {data.map((item, index) => {
            const x = index * (BAR_WIDTH + SPACING);
            const donationHeight = item.donations * scale;
            const expenseHeight = item.expenses * scale;

            return (
              <G key={item.month} x={x}>
                {/* Donation Bar */}
                <Rect
                  x={0}
                  y={CHART_HEIGHT - 40 - donationHeight}
                  width={BAR_WIDTH}
                  height={donationHeight}
                  fill={theme.colors.primary}
                  rx={2}
                />

                {/* Expense Bar */}
                <Rect
                  x={BAR_WIDTH + 2}
                  y={CHART_HEIGHT - 40 - expenseHeight}
                  width={BAR_WIDTH}
                  height={expenseHeight}
                  fill="#ef4444"
                  rx={2}
                />

                {/* Month Label */}
                <SvgText
                  x={BAR_WIDTH}
                  y={CHART_HEIGHT - 20}
                  fontSize="10"
                  fill={theme.colors.onSurfaceVariant}
                  textAnchor="middle"
                >
                  {item.month.split(" ")[0]}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: theme.colors.primary },
            ]}
          />
          <Text
            style={[
              styles.legendText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Donations
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#ef4444" }]} />
          <Text
            style={[
              styles.legendText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Expenses
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 12,
    padding: 16,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
