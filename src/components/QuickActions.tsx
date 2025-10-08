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

  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
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
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <MaterialCommunityIcons
              name={action.icon as any}
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <Text style={[styles.actionTitle, { color: theme.colors.onSurface }]}>
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
      ))}
    </View>
  );
};

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
