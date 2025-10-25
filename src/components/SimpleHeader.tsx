// src/components/SimpleHeader.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SimpleHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  leftIcon?: string;
  onLeftPress?: () => void;
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightIcon,
  onRightPress,
  leftIcon,
  onLeftPress,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.dark;

  // Determine left side content
  const renderLeftSection = () => {
    if (showBackButton) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      );
    }

    if (leftIcon) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onLeftPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name={leftIcon as any}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      );
    }

    // Empty view to maintain flex space
    return <View style={styles.placeholder} />;
  };

  // Determine right side content
  const renderRightSection = () => {
    if (rightIcon) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onRightPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name={rightIcon as any}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      );
    }

    // Empty view to maintain flex space
    return <View style={styles.placeholder} />;
  };

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={
          isDark
            ? (["#0d4420", "#0b3a1b", "#092e15"] as const)
            : (["#16a34a", "#0d8a3a", "#0a722e"] as const)
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientHeader}
      >
        {/* Header Content */}
        <View style={styles.headerContent}>
          {/* Left Section */}
          <View style={styles.section}>{renderLeftSection()}</View>

          {/* Center Section - Always centered */}
          <View style={styles.centerSection}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>

          {/* Right Section */}
          <View style={styles.section}>{renderRightSection()}</View>
        </View>

        {/* Bottom Curve Decoration */}
        <View
          style={[
            styles.headerCurve,
            { backgroundColor: theme.colors.background },
          ]}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {},
  gradientHeader: {
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 60,
  },
  section: {
    width: 40, // Fixed width for balanced spacing
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
    fontWeight: "500",
    textAlign: "center",
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
    // backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  placeholder: {
    width: 40, // Same as icon button area for balance
  },
  headerCurve: {
    position: "absolute",
    bottom: -15,
    left: 0,
    right: 0,
    height: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});

