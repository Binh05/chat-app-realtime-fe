import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

type TabItem = {
  key: string;
  label: string;
  icon: IoniconName;
};

const tabs: TabItem[] = [
  { key: "home", label: "Home", icon: "home-outline" },
  { key: "messages", label: "Messages", icon: "chatbubble-ellipses-outline" },
  { key: "contacts", label: "Contacts", icon: "people-outline" },
  { key: "profile", label: "Profiles", icon: "person-outline" },
];

export default function TaskBar({
  current,
  onChange,
}: {
  current: string;
  onChange: (key: string) => void;
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.item}
            onPress={() => onChange(tab.key)}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={current === tab.key ? "#8A3FFC" : "#333"}
            />
            <Text
              style={[
                styles.label,
                { color: current === tab.key ? "#8A3FFC" : "#333" },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* underline */}
      <View style={styles.underline} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    elevation: 5,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  item: {
    alignItems: "center",
  },
  label: {
    marginTop: 5,
    fontSize: 12,
  },
  underline: {
    marginTop: 8,
    alignSelf: "center",
    width: 120,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
});
