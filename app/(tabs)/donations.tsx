import React from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { Header } from "../../src/components/Header";
import { Card, CardHeader } from "../../src/components/Card";
import { Button } from "../../src/components/Button";
import { DummyData } from "../../src/constants";

export default function DonationsScreen() {
  const handleAddDonation = () => {
    Alert.alert("Add Donation", "Donation form would open here");
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Header
        title="Donations"
        rightComponent={
          <Button title="Add" onPress={handleAddDonation} size="sm" />
        }
      />

      <ScrollView className="flex-1 p-4">
        {/* Donation Summary */}
        <Card className="mb-6">
          <CardHeader
            title="Donation Summary"
            subtitle="Total donations this month"
          />
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-3xl font-bold text-primary">$425.00</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                From 4 donations
              </Text>
            </View>
            <Button title="Donate Now" onPress={handleAddDonation} />
          </View>
        </Card>

        {/* Recent Donations */}
        <View>
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Recent Donations
          </Text>

          {/* Table Header */}
          <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-t-lg px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <Text className="flex-1 font-semibold text-gray-900 dark:text-white">
              Donor
            </Text>
            <Text className="flex-1 font-semibold text-gray-900 dark:text-white">
              Type
            </Text>
            <Text className="flex-1 font-semibold text-gray-900 dark:text-white text-right">
              Amount
            </Text>
          </View>

          {/* Donation List */}
          {DummyData.donations.map((donation, index) => (
            <Card
              key={donation.id}
              className={`
                rounded-none border-t-0 
                ${
                  index === DummyData.donations.length - 1
                    ? "rounded-b-lg"
                    : "border-b-0"
                }
              `}
            >
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text className="font-medium text-gray-900 dark:text-white">
                    {donation.donor}
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {donation.date}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-700 dark:text-gray-300">
                    {donation.type}
                  </Text>
                </View>
                <View className="flex-1 items-end">
                  <Text className="font-bold text-primary text-lg">
                    {formatCurrency(donation.amount)}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Donation Types Info */}
        <Card className="mt-6">
          <CardHeader
            title="Donation Types"
            subtitle="Learn about different types of donations"
          />
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-700 dark:text-gray-300">Zakat</Text>
              <Text className="text-gray-600 dark:text-gray-400">
                Obligatory charity
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-700 dark:text-gray-300">Sadaqah</Text>
              <Text className="text-gray-600 dark:text-gray-400">
                Voluntary charity
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-700 dark:text-gray-300">
                Construction
              </Text>
              <Text className="text-gray-600 dark:text-gray-400">
                Mosque development
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
