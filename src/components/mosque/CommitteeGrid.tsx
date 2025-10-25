import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTheme, Text, Card, List } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Linking } from "react-native";
import { useCopyToClipboard } from "../../utils/copyUtils";

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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ✅ SEPARATE COPY HOOKS FOR PHONE AND EMAIL
  const { copyText: copyPhone, isCopied: phoneCopied } = useCopyToClipboard();
  const { copyText: copyEmail, isCopied: emailCopied } = useCopyToClipboard();

  const handleAccordionPress = (memberId: string) => {
    setExpandedId(expandedId === memberId ? null : memberId);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleCopyPhone = async (phone: string) => {
    await copyPhone(phone, "phone");
  };

  const handleCopyEmail = async (email: string) => {
    await copyEmail(email, "email");
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
      <Card.Content style={styles.cardContent}>
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

        {/* Accordion List */}
        <View style={styles.accordionList}>
          {members.map((member) => (
            <View key={member.id} style={styles.accordionWrapper}>
              <List.Accordion
                title={
                  <View style={styles.accordionHeader}>
                    <View style={styles.memberBasicInfo}>
                      <View style={styles.photoContainer}>
                        {member.photo ? (
                          <Image
                            source={{ uri: member.photo }}
                            style={styles.memberPhoto}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={[
                              styles.avatar,
                              { backgroundColor: theme.colors.primary },
                            ]}
                          >
                            <Text
                              style={[
                                styles.avatarText,
                                { color: theme.colors.onPrimary },
                              ]}
                            >
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.basicInfo}>
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
                      </View>
                    </View>
                  </View>
                }
                // ✅ FIXED: Proper expanded state management
                expanded={expandedId === member.id}
                onPress={() => handleAccordionPress(member.id)}
                style={[
                  styles.accordion,
                  {
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.outline,
                  },
                ]}
                titleStyle={styles.accordionTitle}
                // ✅ FIXED: Remove left prop completely
                right={(props) => (
                  <MaterialCommunityIcons
                    {...props}
                    name={
                      expandedId === member.id
                        ? "chevron-down"
                        : "chevron-right"
                    }
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              >
                {/* ✅ FIXED: Expanded content - ONLY shows when expanded */}
                {expandedId === member.id && (
                  <View style={styles.expandedContent}>
                    {/* Join Date */}
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons
                        name="calendar"
                        size={16}
                        color={theme.colors.onSurfaceVariant}
                      />
                      <Text
                        style={[
                          styles.detailText,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        Member since {member.joinDate}
                      </Text>
                    </View>

                    {/* Bio */}
                    {member.bio ? (
                      <View style={styles.bioContainer}>
                        <Text
                          style={[
                            styles.memberBio,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                        >
                          {member.bio}
                        </Text>
                      </View>
                    ) : null}

                    {/* Contact Info with DIRECT COPY BUTTONS */}
                    <View style={styles.contactInfo}>
                      {/* Phone Row */}
                      <View style={styles.contactRow}>
                        <MaterialCommunityIcons
                          name="phone"
                          size={16}
                          color={theme.colors.primary}
                        />
                        <Text
                          style={[
                            styles.contactText,
                            { color: theme.colors.onSurface },
                          ]}
                        >
                          {member.phone}
                        </Text>

                        {/* ✅ DIRECT COPY BUTTON FOR PHONE */}
                        <TouchableOpacity
                          style={[
                            styles.copyButton,
                            {
                              backgroundColor: phoneCopied
                                ? theme.colors.primary
                                : theme.colors.surfaceVariant,
                            },
                          ]}
                          onPress={() => handleCopyPhone(member.phone)}
                        >
                          {phoneCopied ? (
                            // ✅ TICK ANIMATION STATE
                            <View style={styles.copyFeedback}>
                              <MaterialCommunityIcons
                                name="check"
                                size={14}
                                color={theme.colors.onPrimary}
                              />
                              <Text
                                style={[
                                  styles.copyButtonText,
                                  { color: theme.colors.onPrimary },
                                ]}
                              >
                                Copied
                              </Text>
                            </View>
                          ) : (
                            // ✅ DEFAULT COPY STATE
                            <View style={styles.copyFeedback}>
                              <MaterialCommunityIcons
                                name="content-copy"
                                size={14}
                                color={theme.colors.onSurfaceVariant}
                              />
                              <Text
                                style={[
                                  styles.copyButtonText,
                                  { color: theme.colors.onSurfaceVariant },
                                ]}
                              >
                                Copy
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>

                      {/* Email Row */}
                      <View style={styles.contactRow}>
                        <MaterialCommunityIcons
                          name="email"
                          size={16}
                          color={theme.colors.primary}
                        />
                        <Text
                          style={[
                            styles.contactText,
                            { color: theme.colors.onSurface },
                          ]}
                          numberOfLines={1}
                        >
                          {member.email}
                        </Text>

                        {/* ✅ DIRECT COPY BUTTON FOR EMAIL */}
                        <TouchableOpacity
                          style={[
                            styles.copyButton,
                            {
                              backgroundColor: emailCopied
                                ? theme.colors.primary
                                : theme.colors.surfaceVariant,
                            },
                          ]}
                          onPress={() => handleCopyEmail(member.email)}
                        >
                          {emailCopied ? (
                            // ✅ TICK ANIMATION STATE
                            <View style={styles.copyFeedback}>
                              <MaterialCommunityIcons
                                name="check"
                                size={14}
                                color={theme.colors.onPrimary}
                              />
                              <Text
                                style={[
                                  styles.copyButtonText,
                                  { color: theme.colors.onPrimary },
                                ]}
                              >
                                Copied
                              </Text>
                            </View>
                          ) : (
                            // ✅ DEFAULT COPY STATE
                            <View style={styles.copyFeedback}>
                              <MaterialCommunityIcons
                                name="content-copy"
                                size={14}
                                color={theme.colors.onSurfaceVariant}
                              />
                              <Text
                                style={[
                                  styles.copyButtonText,
                                  { color: theme.colors.onSurfaceVariant },
                                ]}
                              >
                                Copy
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          {
                            backgroundColor: theme.colors.primary,
                          },
                        ]}
                        onPress={() => handleCall(member.phone)}
                      >
                        <MaterialCommunityIcons
                          name="phone"
                          size={16}
                          color={theme.colors.onPrimary}
                        />
                        <Text
                          style={[
                            styles.actionButtonText,
                            { color: theme.colors.onPrimary },
                          ]}
                        >
                          Call
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          {
                            backgroundColor: theme.colors.primary,
                          },
                        ]}
                        onPress={() => handleEmail(member.email)}
                      >
                        <MaterialCommunityIcons
                          name="email"
                          size={16}
                          color={theme.colors.onPrimary}
                        />
                        <Text
                          style={[
                            styles.actionButtonText,
                            { color: theme.colors.onPrimary },
                          ]}
                        >
                          Email
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </List.Accordion>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 0,
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
    padding: 16,
    paddingBottom: 12,
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
  accordionList: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  accordionWrapper: {
    marginBottom: 8,
  },
  accordion: {
    borderRadius: 8,
    overflow: "hidden",
  },
  accordionTitle: {
    padding: 0,
    margin: 0,
    height: "auto",
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },
  memberBasicInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  photoContainer: {
    marginRight: 12,
  },
  memberPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
  },
  basicInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  memberDesignation: {
    fontSize: 14,
    fontWeight: "500",
  },
  expandedContent: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: "transparent",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  bioContainer: {
    marginBottom: 16,
  },
  memberBio: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactInfo: {
    marginBottom: 16,
    gap: 12,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    flex: 1,
  },
  // ✅ COPY BUTTON STYLES
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 70,
    justifyContent: "center",
  },
  copyFeedback: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
