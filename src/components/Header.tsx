import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme, Appbar } from "react-native-paper";

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightComponent,
  showBackButton = false,
  onBackPress,
}) => {
  const theme = useTheme();

  return (
    <Appbar.Header
      style={[styles.header, { backgroundColor: theme.colors.surface }]}
      elevated
    >
      {showBackButton && (
        <Appbar.BackAction
          onPress={onBackPress}
          color={theme.colors.onSurface}
        />
      )}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.rightContainer}>{rightComponent}</View>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 2,
    shadowOpacity: 0.1,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
