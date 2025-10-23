// src/components/CategoryBreakdown.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, Text, Card } from "react-native-paper";
import { FinancialCategory } from "../../types";
import { formatCurrency } from "../../utils/formatters";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface CategoryBreakdownProps {
  categories: FinancialCategory[];
  type: "donation" | "expense";
  title: string;
}

export default function CategoryBreakdown({
  categories,
  type,
  title,
}: CategoryBreakdownProps) {
  const theme = useTheme();

  // Filter categories by type
  const filteredCategories = categories.filter((cat) => cat.type === type);

  // Calculate total for percentage
  const total = filteredCategories.reduce((sum, cat) => sum + cat.amount, 0);

const getTypeColor = () => {
  return type === "donation" ? theme.colors.primary : theme.colors.error; // ✅ Theme colors
};

  const getTypeIcon = (iconName: string) => {
    return (
      <MaterialCommunityIcons
        name={iconName as any}
        size={20}
        color={getTypeColor()}
      />
    );
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {title}
          </Text>
          <Text style={[styles.total, { color: getTypeColor() }]}>
            {formatCurrency(total)}
          </Text>
        </View>

        <View style={styles.categoriesList}>
          {filteredCategories.map((category, index) => (
            <View key={category.name} style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={styles.iconContainer}>
                  {getTypeIcon(category.icon)}
                </View>
                <View style={styles.categoryInfo}>
                  <Text
                    style={[
                      styles.categoryName,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {category.name}
                  </Text>
                  <Text
                    style={[
                      styles.categoryAmount,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {formatCurrency(category.amount)} • {category.percentage}%
                  </Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                />
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${category.percentage}%`,
                      backgroundColor: category.color || getTypeColor(),
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  total: {
    fontSize: 18,
    fontWeight: "700",
  },
  categoriesList: {
    gap: 16,
  },
  categoryItem: {
    gap: 8,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.04)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressContainer: {
    position: "relative",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 3,
  },
  progressFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 3,
  },
});
