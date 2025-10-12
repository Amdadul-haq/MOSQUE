// src/components/LineChart.tsx
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useTheme, Text } from "react-native-paper";
import Svg, {
  Polyline,
  Circle,
  G,
  Line,
  Text as SvgText,
} from "react-native-svg";
import { MonthlyTrend } from "../../types";
import { formatCurrency } from "../../utils/formatters";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_WIDTH - 64;
const CHART_HEIGHT = 200;
const POINT_RADIUS = 4;

interface LineChartProps {
  data: MonthlyTrend[];
}

export default function LineChart({ data }: LineChartProps) {
  const theme = useTheme();

  // Calculate points for balance trend
  const balanceData = data.map((item) => item.balance);
  const maxBalance = Math.max(...balanceData);
  const minBalance = Math.min(...balanceData);

  const scaleX = CHART_WIDTH / (data.length - 1);
  const scaleY = (CHART_HEIGHT - 40) / (maxBalance - minBalance);

  // Generate points for the line
  const points = data
    .map((item, index) => {
      const x = index * scaleX;
      const y = CHART_HEIGHT - 40 - (item.balance - minBalance) * scaleY;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <View style={styles.container}>
      <Text style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
        Balance Trend
      </Text>

      <View style={styles.chartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* Grid Lines */}
          <G>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const value = minBalance + ratio * (maxBalance - minBalance);
              const y = CHART_HEIGHT - 40 - ratio * (CHART_HEIGHT - 40);

              return (
                <G key={index}>
                  <Line
                    x1={0}
                    y1={y}
                    x2={CHART_WIDTH}
                    y2={y}
                    stroke={theme.colors.surfaceVariant}
                    strokeWidth={1}
                    strokeDasharray="4,4"
                  />
                  <SvgText
                    x={CHART_WIDTH - 30}
                    y={y - 4}
                    fontSize="10"
                    fill={theme.colors.onSurfaceVariant}
                    textAnchor="end"
                  >
                    {formatCurrency(value)}
                  </SvgText>
                </G>
              );
            })}
          </G>

          {/* Balance Trend Line */}
          <Polyline
            points={points}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {data.map((item, index) => {
            const x = index * scaleX;
            const y = CHART_HEIGHT - 40 - (item.balance - minBalance) * scaleY;

            return (
              <G key={item.month}>
                <Circle
                  cx={x}
                  cy={y}
                  r={POINT_RADIUS}
                  fill={theme.colors.primary}
                  stroke="white"
                  strokeWidth="2"
                />

                {/* Month Label */}
                <SvgText
                  x={x}
                  y={CHART_HEIGHT - 20}
                  fontSize="10"
                  fill={theme.colors.onSurfaceVariant}
                  textAnchor="middle"
                >
                  {item.month.split(" ")[0]}
                </SvgText>

                {/* Value Label on hover points */}
                <SvgText
                  x={x}
                  y={y - 10}
                  fontSize="10"
                  fill={theme.colors.primary}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {formatCurrency(item.balance)}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text
            style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            Highest
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {formatCurrency(maxBalance)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text
            style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            Lowest
          </Text>
          <Text style={[styles.statValue, { color: "#ef4444" }]}>
            {formatCurrency(minBalance)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text
            style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            Current
          </Text>
          <Text style={[styles.statValue, { color: "#16a34a" }]}>
            {formatCurrency(data[data.length - 1].balance)}
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
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
  },
});
