// src/components/common/Section.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  action,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          {title}
        </Text>
        {action}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
});
