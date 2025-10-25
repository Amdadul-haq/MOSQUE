// app/(auth)/signup.tsx - UPDATED TO HANDLE REDIRECT
import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  useTheme,
  Text,
  Card,
  Button,
  TextInput,
  ActivityIndicator,
  Snackbar,
  Checkbox,
} from "react-native-paper";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { Container } from "../../src/components/common/Container";
import { SimpleHeader } from "../../src/components/SimpleHeader";
import { useAuth } from "../../src/contexts/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

export default function SignupScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"error" | "success">(
    "error"
  );

  // ✅ UPDATED: Get redirect path
  const redirectPath = params.redirect as string;

  const handleBackPress = () => {
    router.back();
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!agreedToTerms) {
      setSnackbarMessage("Please agree to the Terms and Conditions");
      setSnackbarType("error");
      setSnackbarVisible(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const success = await signup({
      name: formData.name.trim(),
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    if (success) {
      setSnackbarMessage("Account created successfully! 🎉");
      setSnackbarType("success");
      setSnackbarVisible(true);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // ✅ UPDATED: Navigate to the intended destination after signup
      setTimeout(() => {
        if (redirectPath) {
          console.log("🎯 Redirecting to:", redirectPath);
          router.replace(redirectPath);
        } else {
          router.replace("/(tabs)");
        }
      }, 1500);
    } else {
      setSnackbarMessage("Signup failed. Please try again.");
      setSnackbarType("error");
      setSnackbarVisible(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Container padding={false}>
      <SimpleHeader
        title="Create Account"
        showBackButton={true}
        onBackPress={handleBackPress}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Signup Form */}
            <Card style={styles.formCard}>
              <Card.Content style={styles.formContent}>
                <TextInput
                  label="Full Name"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                  mode="outlined"
                  autoCapitalize="words"
                  error={!!errors.name}
                  style={styles.input}
                  left={<TextInput.Icon icon="account" />}
                />
                {errors.name ? (
                  <Text
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.name}
                  </Text>
                ) : null}

                <TextInput
                  label="Email Address"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  mode="outlined"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={!!errors.email}
                  style={styles.input}
                  left={<TextInput.Icon icon="email" />}
                />
                {errors.email ? (
                  <Text
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.email}
                  </Text>
                ) : null}

                <TextInput
                  label="Phone Number"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange("phone", value)}
                  mode="outlined"
                  keyboardType="phone-pad"
                  error={!!errors.phone}
                  style={styles.input}
                  left={<TextInput.Icon icon="phone" />}
                />
                {errors.phone ? (
                  <Text
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.phone}
                  </Text>
                ) : null}

                <TextInput
                  label="Password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  mode="outlined"
                  secureTextEntry
                  error={!!errors.password}
                  style={styles.input}
                  left={<TextInput.Icon icon="lock" />}
                />
                {errors.password ? (
                  <Text
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.password}
                  </Text>
                ) : null}

                <TextInput
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  mode="outlined"
                  secureTextEntry
                  error={!!errors.confirmPassword}
                  style={styles.input}
                  left={<TextInput.Icon icon="lock-check" />}
                />
                {errors.confirmPassword ? (
                  <Text
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.confirmPassword}
                  </Text>
                ) : null}

                {/* Terms Agreement */}
                <View style={styles.termsContainer}>
                  <Checkbox.Android
                    status={agreedToTerms ? "checked" : "unchecked"}
                    onPress={() => {
                      setAgreedToTerms(!agreedToTerms);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.termsText,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    I agree to the{" "}
                    <Text style={{ color: theme.colors.primary }}>
                      Terms of Service
                    </Text>{" "}
                    and{" "}
                    <Text style={{ color: theme.colors.primary }}>
                      Privacy Policy
                    </Text>
                  </Text>
                </View>

                <Button
                  mode="contained"
                  onPress={handleSignup}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.signupButton}
                  contentStyle={styles.signupButtonContent}
                  icon="account-plus"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </Card.Content>
            </Card>

            {/* Login Link */}
            <Card style={styles.loginCard}>
              <Card.Content style={styles.loginContent}>
                <Text
                  style={[
                    styles.loginText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Already have an account?
                </Text>
                <Link href="/(auth)/login" asChild>
                  <Button
                    mode="outlined"
                    style={styles.loginButton}
                    contentStyle={styles.loginButtonContent}
                    icon="login"
                  >
                    Sign In
                  </Button>
                </Link>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ✅ UPDATED: Snackbar with success/error colors */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={snackbarType === "success" ? 2000 : 3000}
        style={{
          backgroundColor:
            snackbarType === "success"
              ? theme.colors.primary
              : theme.colors.error,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </Container>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 20,
    gap: 24,
  },
  formCard: {
    borderRadius: 20,
  },
  formContent: {
    gap: 16,
    paddingVertical: 8,
  },
  input: {
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 16,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
  },
  signupButton: {
    borderRadius: 12,
  },
  signupButtonContent: {
    paddingVertical: 8,
  },
  loginCard: {
    borderRadius: 16,
  },
  loginContent: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },
  loginText: {
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 12,
  },
  loginButtonContent: {
    paddingVertical: 6,
  },
});
