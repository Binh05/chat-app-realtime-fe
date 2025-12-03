import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Switch,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Menu } from "react-native-paper";

const icons: { name: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { name: "call-outline", label: "Call" },
  { name: "videocam-outline", label: "Video" },
  { name: "notifications-outline", label: "Mute" },
  { name: "person-add-outline", label: "Add" },
];

export default function ChatDesc({ navigation }: any) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=47" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>Your Name</Text>
        </View>

        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={26} color="#333" />
        </TouchableOpacity>

        {/* Menu 3-dots */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<View />} // anchor tách riêng để tránh lỗi click
        >
          <Menu.Item onPress={() => {}} title="Block" />
          <Menu.Item onPress={() => {}} title="Report" />
        </Menu>
      </View>

      {/* Icon Row */}
      <View style={styles.iconRow}>
        {icons.map((icon, index) => (
          <TouchableOpacity key={index} style={styles.iconBox}>
            <Ionicons name={icon.name} size={28} color="#444" />
            <Text style={styles.iconLabel}>{icon.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications */}
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Ionicons name="notifications-outline" size={24} color="#555" />
          <Text style={styles.rowText}>Notifications</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
        />
      </View>

      {/* File & Media dropdown */}
      <View style={styles.dropdownContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={styles.dropdown}
            >
              <Text style={styles.dropdownText}>File & Media</Text>
              <Ionicons name="chevron-down" size={20} color="#444" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => {}} title="Images" />
          <Menu.Item onPress={() => {}} title="Videos" />
          <Menu.Item onPress={() => {}} title="Files" />
        </Menu>
      </View>

      <StatusBar barStyle="dark-content" />
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  headerInfo: { alignItems: "center", flex: 1 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  name: { fontSize: 22, fontWeight: "600", color: "#333" },

  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  iconBox: {
    width: (width - 80) / 4,
    backgroundColor: "#f2f2f2",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconLabel: { marginTop: 6, fontSize: 14, color: "#444" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },

  dropdownContainer: { marginTop: 20 },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    alignItems: "center",
  },
  dropdownText: { fontSize: 16, color: "#333" },
});
