// ✅ UPDATED: src/components/Button.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useTheme } from "react-native-paper";

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "error";
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

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12, // ✅ Consistent with your app
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: size === "sm" ? 12 : size === "lg" ? 24 : 16,
      paddingVertical: size === "sm" ? 8 : size === "lg" ? 16 : 12,
    } as ViewStyle;

    if (fullWidth) {
      (baseStyle as any).width = "100%";
    }

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary, // ✅ Green
        } as ViewStyle;
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.secondary, // ✅ Amber/Orange
        } as ViewStyle;
      case "tertiary":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.tertiary, // ✅ Emerald
        } as ViewStyle;
      case "error":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.error, // ✅ Red (only for errors)
        } as ViewStyle;
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.colors.primary, // ✅ Outline with primary color
        } as ViewStyle;
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
        } as ViewStyle;
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontWeight: "600" as const,
      fontSize: size === "sm" ? 14 : size === "lg" ? 18 : 16,
    };

    switch (variant) {
      case "outline":
        return {
          ...baseStyle,
          color: theme.colors.primary, // ✅ Text color matches border
        };
      case "secondary":
        return {
          ...baseStyle,
          color: theme.colors.onSurface, // ✅ Dark text for light background
        };
      case "tertiary":
        return {
          ...baseStyle,
          color: theme.colors.onPrimary, // ✅ White text for colored background
        };
      case "error":
        return {
          ...baseStyle,
          color: theme.colors.onError, // ✅ White text for error buttons
        };
      default:
        return {
          ...baseStyle,
          color: theme.colors.onPrimary, // ✅ White text for primary
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
