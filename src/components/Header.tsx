import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useColorScheme } from "../hooks/useColorScheme";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightComponent,
}) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const headerStyle = {
    backgroundColor: theme.colors.surface,
    borderBottomColor: colorScheme === "dark" ? "#374151" : "#e5e7eb",
  };

  return (
    <View style={[styles.header, headerStyle]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          {showBack && (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Text style={[styles.backText, { color: theme.colors.primary }]}>
                ←
              </Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: theme.colors.onSurface }]}> 
            {title}
          </Text>
        </View>
        {rightComponent && (
          <View style={styles.headerRight}>{rightComponent}</View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: 12,
  },
  backText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  headerRight: {
    marginLeft: "auto",
  },
});
