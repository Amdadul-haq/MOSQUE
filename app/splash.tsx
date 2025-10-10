// app/splash.tsx
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, StatusBar, Animated, Easing } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreen() {
  const theme = useTheme();

  // Animation values for typing effect
  const nameTypingProgress = useRef(new Animated.Value(0)).current;
  const subtitleTypingProgress = useRef(new Animated.Value(0)).current;
  const gradientOpacity = useRef(new Animated.Value(0)).current;

  // Loading dots animation
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  // Text content
  const mosqueName = "Khiarpara Jame Masjid";
  const subtitle = "Your Digital Mosque Companion";

  useEffect(() => {
    // Main animation sequence
    Animated.sequence([
      // Gradient background
      Animated.timing(gradientOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),

      // Mosque name typing animation
      Animated.timing(nameTypingProgress, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      // Subtitle typing animation with delay
      Animated.delay(300),
      Animated.timing(subtitleTypingProgress, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Loading dots animation (pulse effect)
    const createDotAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start dots animation after typing animations
    setTimeout(() => {
      createDotAnimation(dot1Opacity, 0).start();
      createDotAnimation(dot2Opacity, 200).start();
      createDotAnimation(dot3Opacity, 400).start();
    }, 2000);
  }, []);

  // Calculate visible characters for typing effect
  const nameChars = mosqueName.split("");
  const subtitleChars = subtitle.split("");

  const nameVisibleCount = nameTypingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, nameChars.length],
  });

  const subtitleVisibleCount = subtitleTypingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, subtitleChars.length],
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Premium Gradient Background */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: gradientOpacity }]}
      >
        <LinearGradient
          colors={["#0f766e", "#16a34a", "#0d9488"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Subtle Pattern Overlay */}
        <View style={styles.patternOverlay} />
      </Animated.View>

      {/* Main Content - Only Text with Typing Animation */}
      <View style={styles.content}>
        {/* Mosque Name with Typing Animation */}
        <View style={styles.nameContainer}>
          <Text style={[styles.mosqueName, { color: "white" }]}>
            {nameChars.map((char, index) => (
              <Animated.Text
                key={index}
                style={{
                  opacity: nameVisibleCount.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [0, 1, 1],
                    extrapolate: "clamp",
                  }),
                }}
              >
                {char}
              </Animated.Text>
            ))}
          </Text>
        </View>

        {/* Subtitle with Typing Animation */}
        <View style={styles.subtitleContainer}>
          <Text
            style={[styles.mosqueSubtitle, { color: "rgba(255,255,255,0.9)" }]}
          >
            {subtitleChars.map((char, index) => (
              <Animated.Text
                key={index}
                style={{
                  opacity: subtitleVisibleCount.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [0, 1, 1],
                    extrapolate: "clamp",
                  }),
                }}
              >
                {char}
              </Animated.Text>
            ))}
          </Text>
        </View>
      </View>

      {/* Animated Loading Dots */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDots}>
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: "white",
                opacity: dot1Opacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: "white",
                opacity: dot2Opacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: "white",
                opacity: dot3Opacity,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16a34a",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    opacity: 0.05,
  },
  nameContainer: {
    marginBottom: 16,
  },
  mosqueName: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
    lineHeight: 38,
    // Prevent text from breaking into multiple lines
    flexWrap: "nowrap",
  },
  subtitleContainer: {
    marginBottom: 8,
  },
  mosqueSubtitle: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.3,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: 24,
    // Prevent text from breaking into multiple lines
    flexWrap: "nowrap",
  },
  loadingContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  loadingDots: {
    flexDirection: "row",
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
