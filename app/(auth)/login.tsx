// app/(auth)/login.tsx - UPDATED WITH CONSISTENT INPUT DESIGN
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
} from "react-native-paper";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { Container } from "../../src/components/common/Container";
import { SimpleHeader } from "../../src/components/SimpleHeader";
import { useAuth } from "../../src/contexts/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ UPDATED: Get redirect path and handle it properly
  const redirectPath = params.redirect as string;

  const handleBackPress = () => {
    router.back();
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const success = await login(
      formData.email,
      formData.password,
      redirectPath
    );

    if (success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // ✅ UPDATED: Navigate to the intended destination after login
      if (redirectPath) {
        console.log("🎯 Redirecting to:", redirectPath);
        router.replace(redirectPath);
      } else {
        // Default navigation if no redirect specified
        router.replace("/(tabs)");
      }
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setSnackbarMessage(
        "Login failed. Please check your credentials or create an account."
      );
      setSnackbarVisible(true);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Container padding={false}>
      <SimpleHeader
        title="Login to Your Account"
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
            {/* Login Form */}
            <Card style={styles.formCard}>
              <Card.Content style={styles.formContent}>
                {/* ✅ UPDATED: Consistent input design like donation screen */}
                <TextInput
                  label="Email Address"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  mode="outlined"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={!!errors.email}
                  style={styles.input}
                  contentStyle={styles.inputContent} // ✅ Same content style
                  outlineStyle={styles.inputOutline} // ✅ Same outline style
                  left={<TextInput.Icon icon="email" />}
                />
                {errors.email ? (
                  <Text
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.email}
                  </Text>
                ) : null}

                {/* ✅ UPDATED: Consistent password input design */}
                <TextInput
                  label="Password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  error={!!errors.password}
                  style={styles.input}
                  contentStyle={styles.inputContent} // ✅ Same content style
                  outlineStyle={styles.inputOutline} // ✅ Same outline style
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={togglePasswordVisibility}
                    />
                  }
                />
                {errors.password ? (
                  <Text
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.password}
                  </Text>
                ) : null}

                <Button
                  mode="contained"
                  onPress={handleLogin}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.loginButton}
                  contentStyle={styles.loginButtonContent}
                  icon="login"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                {/* Forgot Password */}
                <View style={styles.forgotPasswordContainer}>
                  <Link href="/forgot-password" asChild>
                    <Button
                      mode="text"
                      compact
                      textColor={theme.colors.primary}
                    >
                      Forgot your password?
                    </Button>
                  </Link>
                </View>
              </Card.Content>
            </Card>

            {/* Sign Up Link */}
            <Card style={styles.signupCard}>
              <Card.Content style={styles.signupContent}>
                <Text
                  style={[
                    styles.signupText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Don't have an account?
                </Text>
                <Link
                  href={{
                    pathname: "/(auth)/signup",
                    params: { redirect: redirectPath },
                  }}
                  asChild
                >
                  <Button
                    mode="outlined"
                    style={styles.signupButton}
                    contentStyle={styles.signupButtonContent}
                    icon="account-plus"
                  >
                    Create Account
                  </Button>
                </Link>
              </Card.Content>
            </Card>

            {/* ✅ ADDED: Extra padding for keyboard space */}
            <View style={styles.keyboardSpacer} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Error Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.error }}
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
  // ✅ UPDATED: Consistent input styles with donation screen
  input: {
    marginBottom: 4,
  },
  inputContent: {
    // Same styling as donation screen inputs
  },
  inputOutline: {
    borderRadius: 12, // ✅ Same border radius
  },
  errorText: {
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  loginButton: {
    borderRadius: 12, // ✅ Same border radius
    marginTop: 8,
  },
  loginButtonContent: {
    paddingVertical: 8, // ✅ Same padding
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  signupCard: {
    borderRadius: 16, // ✅ Same border radius
  },
  signupContent: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },
  signupText: {
    fontSize: 14,
  },
  signupButton: {
    borderRadius: 12, // ✅ Same border radius
  },
  signupButtonContent: {
    paddingVertical: 6,
  },
  keyboardSpacer: {
    height: 100, // ✅ Extra space for keyboard
  },
});
