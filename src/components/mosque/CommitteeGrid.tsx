// src/components/mosque/CommitteeGrid.tsx - Fixed with Image
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
  Alert,
  Image, // ✅ Image import যোগ করুন
} from "react-native";
import { useTheme, Text, Card, Menu, Divider } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Linking } from "react-native";

interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
  bio: string;
  joinDate: string;
  photo?: string;
}

interface CommitteeGridProps {
  members: CommitteeMember[];
}

export const CommitteeGrid: React.FC<CommitteeGridProps> = ({ members }) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const openMenu = (memberId: string) => setMenuVisible(memberId);
  const closeMenu = () => setMenuVisible(null);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
    closeMenu();
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
    closeMenu();
  };

  const handleCopyPhone = async (phone: string) => {
    await Clipboard.setString(phone);
    Alert.alert("Copied!", "Phone number copied to clipboard");
    closeMenu();
  };

  const handleCopyEmail = async (email: string) => {
    await Clipboard.setString(email);
    Alert.alert("Copied!", "Email copied to clipboard");
    closeMenu();
  };

  if (members.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.emptyContent}>
          <MaterialCommunityIcons
            name="account-group"
            size={48}
            color={theme.colors.onSurfaceVariant}
          />
          <Text
            style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
          >
            No committee members available
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Section Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons
              name="account-tie"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Committee Members
            </Text>
          </View>
          <Text
            style={[
              styles.memberCount,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {members.length} Members
          </Text>
        </View>

        {/* Members Grid */}
        <View style={styles.grid}>
          {members.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              {/* Member Photo and Info */}
              <View style={styles.memberHeader}>
                <View style={styles.photoContainer}>
                  {member.photo ? (
                    // ✅ Cloudinary URL দিয়ে Real Image দেখানো হচ্ছে
                    <Image
                      source={{ uri: member.photo }}
                      style={styles.memberPhoto}
                      resizeMode="cover"
                    />
                  ) : (
                    // ✅ Photo না থাকলে Avatar দেখাবে
                    <View
                      style={[
                        styles.avatar,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    >
                      <Text style={styles.avatarText}>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.memberInfo}>
                  <Text
                    style={[
                      styles.memberName,
                      { color: theme.colors.onSurface },
                    ]}
                    numberOfLines={1}
                  >
                    {member.name}
                  </Text>
                  <Text
                    style={[
                      styles.memberDesignation,
                      { color: theme.colors.primary },
                    ]}
                    numberOfLines={1}
                  >
                    {member.designation}
                  </Text>
                  <Text
                    style={[
                      styles.memberJoinDate,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Since {member.joinDate}
                  </Text>
                </View>

                {/* Menu Button */}
                <Menu
                  visible={menuVisible === member.id}
                  onDismiss={closeMenu}
                  anchor={
                    <TouchableOpacity
                      style={styles.menuButton}
                      onPress={() => openMenu(member.id)}
                    >
                      <MaterialCommunityIcons
                        name="dots-vertical"
                        size={20}
                        color={theme.colors.onSurfaceVariant}
                      />
                    </TouchableOpacity>
                  }
                  contentStyle={[
                    styles.menuContent,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  <Menu.Item
                    leadingIcon="phone"
                    onPress={() => handleCall(member.phone)}
                    title="Call"
                    titleStyle={{ color: theme.colors.onSurface }}
                  />
                  <Menu.Item
                    leadingIcon="email"
                    onPress={() => handleEmail(member.email)}
                    title="Email"
                    titleStyle={{ color: theme.colors.onSurface }}
                  />
                  <Divider />
                  <Menu.Item
                    leadingIcon="content-copy"
                    onPress={() => handleCopyPhone(member.phone)}
                    title="Copy Phone"
                    titleStyle={{ color: theme.colors.onSurface }}
                  />
                  <Menu.Item
                    leadingIcon="content-copy"
                    onPress={() => handleCopyEmail(member.email)}
                    title="Copy Email"
                    titleStyle={{ color: theme.colors.onSurface }}
                  />
                </Menu>
              </View>

              {/* Member Bio */}
              <Text
                style={[
                  styles.memberBio,
                  { color: theme.colors.onSurfaceVariant },
                ]}
                numberOfLines={2}
              >
                {member.bio}
              </Text>

              {/* Contact Quick Actions */}
              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={[
                    styles.contactButton,
                    { backgroundColor: theme.colors.primaryContainer },
                  ]}
                  onPress={() => handleCall(member.phone)}
                >
                  <MaterialCommunityIcons
                    name="phone"
                    size={14}
                    color={theme.colors.onPrimaryContainer}
                  />
                  <Text
                    style={[
                      styles.contactButtonText,
                      { color: theme.colors.onPrimaryContainer },
                    ]}
                  >
                    Call
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.contactButton,
                    { backgroundColor: theme.colors.secondaryContainer },
                  ]}
                  onPress={() => handleEmail(member.email)}
                >
                  <MaterialCommunityIcons
                    name="email"
                    size={14}
                    color={theme.colors.onSecondaryContainer}
                  />
                  <Text
                    style={[
                      styles.contactButtonText,
                      { color: theme.colors.onSecondaryContainer },
                    ]}
                  >
                    Email
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  memberCount: {
    fontSize: 12,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  memberCard: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(22, 163, 74, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(22, 163, 74, 0.1)",
  },
  memberHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  photoContainer: {
    marginRight: 12,
  },
  // ✅ Real Member Photo Style
  memberPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  // ❌ পুরনো placeholder styles remove করেছি
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  memberDesignation: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  memberJoinDate: {
    fontSize: 12,
  },
  menuButton: {
    padding: 4,
  },
  menuContent: {
    borderRadius: 8,
  },
  memberBio: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  contactActions: {
    flexDirection: "row",
    gap: 8,
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
