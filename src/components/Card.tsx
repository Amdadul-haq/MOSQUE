import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useColorScheme } from "../hooks/useColorScheme";

interface CardProps {
  children: React.ReactNode;
  style?: any;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const cardStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: colorScheme === "dark" ? 0.1 : 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: colorScheme === "dark" ? "#374151" : "#e5e7eb",
    ...style,
  };

  return <View style={cardStyle}>{children}</View>;
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle }) => {
  const theme = useTheme();

  return (
    <View style={styles.cardHeader}>
      <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.cardSubtitle, { color: theme.colors.onSurface }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
});
