import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface PrayerTime {
  name: string;
  time: string;
  isCurrent?: boolean;
}

interface PrayerTimesProps {
  times: PrayerTime[];
}

export const PrayerTimes: React.FC<PrayerTimesProps> = ({ times }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.outline, // ✅ Theme border color
          backgroundColor: theme.colors.surface, // ✅ Theme background
        },
      ]}
    >
      {times.map((prayer, index) => (
        <View
          key={prayer.name}
          style={[
            styles.prayerRow,
            {
              borderBottomColor: theme.colors.outline, // ✅ Theme border color
            },
            prayer.isCurrent && {
              backgroundColor: theme.colors.primaryContainer,
            },
            index === times.length - 1 && { borderBottomWidth: 0 },
          ]}
        >
          <Text
            style={[
              styles.prayerName,
              { color: theme.colors.onSurface },
              prayer.isCurrent && {
                color: theme.colors.primary,
                fontWeight: "700",
              },
            ]}
          >
            {prayer.name}
          </Text>
          <Text
            style={[
              styles.prayerTime,
              { color: theme.colors.onSurface },
              prayer.isCurrent && {
                color: theme.colors.primary,
                fontWeight: "700",
              },
            ]}
          >
            {prayer.time}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  prayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  prayerName: {
    fontSize: 16,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: "600",
  },
});
