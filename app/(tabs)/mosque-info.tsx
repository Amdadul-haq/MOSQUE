import React from "react";
import { ScrollView, View, Text, Linking, Alert } from "react-native";
import { Header } from "../../src/components/Header";
import { Card, CardHeader } from "../../src/components/Card";
import { Button } from "../../src/components/Button";
import { DummyData } from "../../src/constants";

export default function MosqueInfoScreen() {
  const handleContact = (type: string, value: string) => {
    Alert.alert("Contact", `${type}: ${value}`);
  };

  const openMap = () => {
    Alert.alert("Open Map", "Opening mosque location in maps...");
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Header title="Mosque Information" />

      <ScrollView className="flex-1 p-4">
        {/* Mosque Basic Info */}
        <Card className="mb-6">
          <CardHeader
            title={DummyData.mosqueInfo.name}
            subtitle="Established 1995"
          />
          <Text className="text-gray-600 dark:text-gray-400 mb-4">
            A vibrant community mosque serving Muslims in the area with daily
            prayers, educational programs, and community events.
          </Text>
          <Button
            title="Get Directions"
            onPress={openMap}
            variant="outline"
            fullWidth
          />
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardHeader title="Contact Information" />
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-medium text-gray-900 dark:text-white">
                  Address
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  {DummyData.mosqueInfo.address}
                </Text>
              </View>
              <Button
                title="Copy"
                onPress={() =>
                  handleContact("Address", DummyData.mosqueInfo.address)
                }
                size="sm"
                variant="outline"
              />
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-medium text-gray-900 dark:text-white">
                  Phone
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  {DummyData.mosqueInfo.phone}
                </Text>
              </View>
              <Button
                title="Call"
                onPress={() =>
                  handleContact("Phone", DummyData.mosqueInfo.phone)
                }
                size="sm"
                variant="outline"
              />
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-medium text-gray-900 dark:text-white">
                  Email
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  {DummyData.mosqueInfo.email}
                </Text>
              </View>
              <Button
                title="Email"
                onPress={() =>
                  handleContact("Email", DummyData.mosqueInfo.email)
                }
                size="sm"
                variant="outline"
              />
            </View>
          </View>
        </Card>

        {/* Imam Information */}
        <Card className="mb-6">
          <CardHeader title="Imam Information" />
          <View className="flex-row items-start space-x-4">
            <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
              <Text className="text-white text-2xl font-bold">I</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                {DummyData.mosqueInfo.imam.name}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {DummyData.mosqueInfo.imam.bio}
              </Text>
              <Button
                title="Contact Imam"
                onPress={() =>
                  handleContact("Imam Phone", DummyData.mosqueInfo.imam.phone)
                }
                size="sm"
                variant="outline"
                className="mt-3"
              />
            </View>
          </View>
        </Card>

        {/* Prayer Times */}
        <Card className="mb-6">
          <CardHeader title="Daily Prayer Times" />
          <View className="space-y-3">
            {Object.entries(DummyData.mosqueInfo.prayerTimes).map(
              ([prayer, time]) => (
                <View
                  key={prayer}
                  className="flex-row justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <Text className="font-medium text-gray-900 dark:text-white capitalize">
                    {prayer}
                  </Text>
                  <Text className="text-primary font-semibold text-lg">
                    {time}
                  </Text>
                </View>
              )
            )}
          </View>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader title="Services & Facilities" />
          <View className="space-y-2">
            {[
              "Daily Five Prayers",
              "Jumuah Friday Prayer",
              "Quran Classes for All Ages",
              "Islamic Studies",
              "Marriage Services",
              "Funeral Services",
              "Community Hall",
              "Library",
              "Parking Facility",
            ].map((service, index) => (
              <View
                key={index}
                className="flex-row items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              >
                <View className="w-2 h-2 bg-primary rounded-full mr-3" />
                <Text className="text-gray-700 dark:text-gray-300">
                  {service}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
