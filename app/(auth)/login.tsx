// app/(auth)/login.tsx
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

  // ✅ ADDED: Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  const redirectPath = (params.redirect as string) || "/(tabs)";

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

    const success = await login(formData.email, formData.password);

    if (success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Navigation is now handled in AuthContext
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

  // ✅ ADDED: Toggle password visibility
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
                  label="Password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  mode="outlined"
                  secureTextEntry={!showPassword} // ✅ FIXED: Use state for visibility
                  error={!!errors.password}
                  style={styles.input}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"} // ✅ FIXED: Toggle icon
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
                <Link href="/(auth)/signup" asChild>
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
  input: {
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  loginButton: {
    borderRadius: 12,
    marginTop: 8,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  signupCard: {
    borderRadius: 16,
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
    borderRadius: 12,
  },
  signupButtonContent: {
    paddingVertical: 6,
  },
});
