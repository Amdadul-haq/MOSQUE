// src/components/Button.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useTheme } from "react-native-paper";
import { useColorScheme } from "../hooks/useColorScheme";

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "primary" | "accent" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  fullWidth = false,
}) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: size === "sm" ? 12 : size === "lg" ? 24 : 16,
      paddingVertical: size === "sm" ? 8 : size === "lg" ? 16 : 12,
    } as ViewStyle;

    if (fullWidth) {
      // width accepts number | string as DimensionValue
      (baseStyle as any).width = "100%";
    }

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
        } as ViewStyle;
      case "accent":
        return {
          ...baseStyle,
          // MD3 uses `secondary`; fall back to literal if missing
          backgroundColor: (theme.colors as any).secondary ?? "#facc15",
        } as ViewStyle;
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colorScheme === "dark" ? "#6b7280" : "#d1d5db",
        } as ViewStyle;
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
        } as ViewStyle;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return {
          color: colorScheme === "dark" ? "#ffffff" : "#1f2937",
          fontWeight: "600" as const,
          fontSize: 16,
        };
      case "accent":
        return {
          color: "#1f2937",
          fontWeight: "600" as const,
          fontSize: 16,
        };
      default:
        return {
          color: "#ffffff",
          fontWeight: "600" as const,
          fontSize: 16,
        };
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};
