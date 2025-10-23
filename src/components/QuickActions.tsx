// ✅ FIXED: src/components/QuickActions.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export interface QuickActionItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  screen?: string;
  color?: string; // ✅ ADDED: Custom color support
}

interface QuickActionsProps {
  actions: QuickActionItem[];
  onAction: (actionId: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onAction,
}) => {
  const theme = useTheme();

  // ✅ ADDED: Get icon color based on action type
  const getIconColor = (action: QuickActionItem) => {
    if (action.color) return action.color;

    switch (action.id) {
      case "donation":
        return theme.colors.secondary; // Amber for donations
      case "prayer":
        return theme.colors.primary; // Green for prayers
      case "events":
        return theme.colors.tertiary; // Emerald for events
      case "quran":
        return theme.colors.secondary; // Amber for quran
      default:
        return theme.colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      {actions.map((action, index) => {
        const iconColor = getIconColor(action);

        return (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.actionCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
              },
              index % 2 === 0 ? styles.leftItem : styles.rightItem,
            ]}
            onPress={() => onAction(action.id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${iconColor}20` }, // ✅ Dynamic background with opacity
              ]}
            >
              <MaterialCommunityIcons
                name={action.icon as any}
                size={24}
                color={iconColor} // ✅ Dynamic icon color
              />
            </View>
            <Text
              style={[styles.actionTitle, { color: theme.colors.onSurface }]}
            >
              {action.title}
            </Text>
            <Text
              style={[
                styles.actionDescription,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {action.description}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ... keep same styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: "48%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  leftItem: {
    marginRight: 6,
  },
  rightItem: {
    marginLeft: 6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
});
