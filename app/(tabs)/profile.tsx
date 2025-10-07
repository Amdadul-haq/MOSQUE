import React from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { Header } from "../../src/components/Header";
import { Card, CardHeader } from "../../src/components/Card";
import { Button } from "../../src/components/Button";

export default function ProfileScreen() {
  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing form would open here");
  };

  const handleSettings = (setting: string) => {
    Alert.alert("Settings", `${setting} setting would open here`);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Header title="Profile" />

      <ScrollView className="flex-1 p-4">
        {/* Profile Header */}
        <Card className="mb-6">
          <View className="items-center">
            <View className="w-24 h-24 bg-primary rounded-full items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">U</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              User Name
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mb-4">
              Community Member
            </Text>
            <Button
              title="Edit Profile"
              onPress={handleEditProfile}
              variant="outline"
            />
          </View>
        </Card>

        {/* Profile Information */}
        <Card className="mb-6">
          <CardHeader title="Profile Information" />
          <View className="space-y-4">
            <View>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Email
              </Text>
              <Text className="text-gray-900 dark:text-white">
                user@example.com
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Phone
              </Text>
              <Text className="text-gray-900 dark:text-white">
                +1 (555) 123-4567
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Member Since
              </Text>
              <Text className="text-gray-900 dark:text-white">
                January 2024
              </Text>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Card className="mb-6">
          <CardHeader title="Settings" />
          <View className="space-y-3">
            {[
              { title: "Notification Settings", icon: "🔔" },
              { title: "Prayer Time Settings", icon: "🕌" },
              { title: "Language Preferences", icon: "🌐" },
              { title: "Privacy Settings", icon: "🔒" },
            ].map((item, index) => (
              <Button
                key={index}
                title={`${item.icon} ${item.title}`}
                onPress={() => handleSettings(item.title)}
                variant="outline"
                fullWidth
                className="justify-start"
              />
            ))}
          </View>
        </Card>

        {/* Quick Stats */}
        <Card className="mb-6">
          <CardHeader title="Your Activity" />
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-primary">12</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Prayers
              </Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-accent">4</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Donations
              </Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-primary">3</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Events
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader title="Actions" />
          <View className="space-y-3">
            <Button
              title="Contact Support"
              onPress={() => Alert.alert("Support", "Contacting support...")}
              variant="outline"
              fullWidth
            />
            <Button
              title="About Mosque App"
              onPress={() =>
                Alert.alert("About", "Mosque Management System v1.0")
              }
              variant="outline"
              fullWidth
            />
            <Button
              title="Logout"
              onPress={() => Alert.alert("Logout", "You have been logged out")}
              fullWidth
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
