// app/profile/edit.tsx - FIXED WITH KEYBOARD AVOIDING VIEW
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  Alert,
  Image as RNImage,
  KeyboardAvoidingView,
  Platform,
} from "react-native"; // ✅ ADDED KeyboardAvoidingView
import {
  useTheme,
  Text,
  Card,
  Button,
  TextInput,
  ActivityIndicator,
  Snackbar,
} from "react-native-paper";
import { SimpleHeader } from "../../src/components/SimpleHeader";
import { Container } from "../../src/components/common/Container";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { UserProfile } from "../../src/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_AVATAR_KEY = "userAvatar";

export default function EditProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateProfile, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Load user data and avatar when screen opens
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });

        // ✅ Load saved avatar from AsyncStorage
        try {
          const savedAvatar = await AsyncStorage.getItem(USER_AVATAR_KEY);
          if (savedAvatar) {
            setImage(savedAvatar);
          } else {
            // Fallback to default avatar
            setImage(
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            );
          }
        } catch (error) {
          console.log("Error loading avatar:", error);
          setImage(
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          );
        }
      }
    };

    loadUserData();
  }, [user]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
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

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // ✅ IMAGE PICKER FUNCTION
  const pickImage = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Request permission first
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload images!"
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setImage(selectedImage.uri);

        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        console.log("✅ Image selected:", selectedImage.uri);
      }
    } catch (error) {
      console.error("❌ Image picker error:", error);
      setSnackbarMessage("Failed to pick image. Please try again.");
      setSnackbarVisible(true);
    }
  };

  // ✅ TAKE PHOTO FUNCTION
  const takePhoto = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera permissions to take photos!"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photo = result.assets[0];
        setImage(photo.uri);

        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        console.log("✅ Photo taken:", photo.uri);
      }
    } catch (error) {
      console.error("❌ Camera error:", error);
      setSnackbarMessage("Failed to take photo. Please try again.");
      setSnackbarVisible(true);
    }
  };

  // ✅ SAVE AVATAR TO ASYNCSTORAGE
  const saveAvatarToStorage = async (avatarUri: string) => {
    try {
      await AsyncStorage.setItem(USER_AVATAR_KEY, avatarUri);
      console.log("✅ Avatar saved to AsyncStorage");
    } catch (error) {
      console.error("❌ Error saving avatar:", error);
      throw error;
    }
  };

  // ✅ SAVE PROFILE FUNCTION
  const handleSaveProfile = async () => {
    if (!validateForm()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setSnackbarMessage("Please fix the errors before saving.");
      setSnackbarVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Prepare updated profile data
      const updatedProfile: Partial<UserProfile> = {
        name: formData.name.trim(),
        email: formData.email,
        phone: formData.phone,
      };

      // Save profile data
      await updateProfile(updatedProfile);

      // ✅ Save avatar to AsyncStorage if new image selected
      if (image && !image.includes("unsplash.com")) {
        // Check if it's a new image (not default)
        await saveAvatarToStorage(image);
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // ✅ Show success snackbar instead of alert
      setSnackbarMessage("Profile updated successfully! 🎉");
      setSnackbarVisible(true);

      // Navigate back after a short delay
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error("❌ Profile update error:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setSnackbarMessage("Failed to update profile. Please try again.");
      setSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <Container padding={false}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <SimpleHeader
        title="Edit Profile"
        showBackButton={true}
        onBackPress={handleBackPress}
      />

      {/* ✅ ADDED: Keyboard Avoiding View */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // ✅ Allows tapping outside to dismiss keyboard
        >
          <View style={styles.content}>
            {/* Profile Image Section */}
            <Card style={styles.imageCard}>
              <Card.Content style={styles.imageContent}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  Profile Picture
                </Text>

                <View style={styles.imageSection}>
                  <View style={styles.avatarContainer}>
                    <RNImage
                      source={{
                        uri:
                          image ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                      }}
                      style={styles.avatarImage}
                    />
                  </View>

                  <View style={styles.imageButtons}>
                    <Button
                      mode="outlined"
                      onPress={pickImage}
                      style={styles.imageButton}
                      contentStyle={styles.imageButtonContent}
                      icon="image"
                      disabled={isLoading}
                    >
                      Choose Photo
                    </Button>

                    <Button
                      mode="outlined"
                      onPress={takePhoto}
                      style={styles.imageButton}
                      contentStyle={styles.imageButtonContent}
                      icon="camera"
                      disabled={isLoading}
                    >
                      Take Photo
                    </Button>
                  </View>
                </View>

                <Text
                  style={[
                    styles.imageHint,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Tap to change your profile picture
                </Text>
              </Card.Content>
            </Card>

            {/* Profile Information Form */}
            <Card style={styles.formCard}>
              <Card.Content>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  Personal Information
                </Text>

                <TextInput
                  label="Full Name"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                  mode="outlined"
                  error={!!errors.name}
                  style={styles.input}
                  left={<TextInput.Icon icon="account" />}
                  returnKeyType="next" // ✅ Better keyboard navigation
                  blurOnSubmit={false}
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
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!errors.email}
                  style={styles.input}
                  left={<TextInput.Icon icon="email" />}
                  returnKeyType="next"
                  blurOnSubmit={false}
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
                  returnKeyType="done" // ✅ Done button for last field
                />
                {errors.phone ? (
                  <Text
                    style={[styles.errorText, { color: theme.colors.error }]}
                  >
                    {errors.phone}
                  </Text>
                ) : null}
              </Card.Content>
            </Card>

            {/* Save Button */}
            <Button
              mode="contained"
              onPress={handleSaveProfile}
              loading={isLoading}
              disabled={isLoading || authLoading}
              style={styles.saveButton}
              contentStyle={styles.saveButtonContent}
              icon="content-save"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>

            {/* ✅ ADDED: Extra padding for keyboard space */}
            <View style={styles.keyboardSpacer} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ✅ SUCCESS SNACKBAR */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.primary }}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  imageCard: {
    borderRadius: 16,
  },
  imageContent: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  imageSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#e5e7eb",
  },
  imageButtons: {
    flex: 1,
    gap: 8,
  },
  imageButton: {
    borderRadius: 8,
  },
  imageButtonContent: {
    paddingVertical: 6,
  },
  imageHint: {
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
  formCard: {
    borderRadius: 16,
  },
  input: {
    marginBottom: 16, // ✅ Increased margin for better spacing
  },
  errorText: {
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 4,
  },
  saveButton: {
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
  keyboardSpacer: {
    height: 100, // ✅ Extra space for keyboard
  },
});
