import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme, Card } from "react-native-paper";

interface Stat {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const theme = useTheme();

  return (
    <View style={styles.grid}>
      {stats.map((stat, index) => (
        <Card key={index} style={styles.statCard} mode="contained">
          <Card.Content style={styles.statContent}>
            <Text
              style={[
                styles.statValue,
                { color: stat.color || theme.colors.primary },
              ]}
            >
              {stat.value}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {stat.label}
            </Text>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "30%",
    borderRadius: 12,
  },
  statContent: {
    alignItems: "center",
    padding: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});
