import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Switch,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Provider, Menu } from "react-native-paper";

const icons = ["home", "search", "call", "notifications"] as const;

export default function ChatDesc({ navigation }: any) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Provider>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={28} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=47" }}
              style={styles.headerAvatar}
              resizeMode="cover"
            />
            <Text style={styles.headerName}>Your Name</Text>
          </View>
        </View>

        {/* Icon Row */}
        <View style={styles.iconRow}>
          {icons.map((icon, index) => (
            <TouchableOpacity key={index} style={styles.iconBox}>
              <Ionicons name={icon} size={30} color="#555" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications Switch */}
        <View style={styles.row}>
          <Ionicons name="notifications-outline" size={24} color="#555" />
          <Text style={styles.label}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={() =>
              setNotificationsEnabled(!notificationsEnabled)
            }
          />
        </View>

        {/* Dropdown Menu */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={styles.dropdown}
            >
              <Text style={{ fontSize: 16 }}>File and media</Text>
              <Ionicons name="chevron-down" size={20} />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => {}} title="Option 1" />
          <Menu.Item onPress={() => {}} title="Option 2" />
        </Menu>

        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backIcon: { marginRight: 16 },
  headerContent: { flex: 1, alignItems: "center" },
  headerAvatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 8 },
  headerName: { fontSize: 24, fontWeight: "bold", color: "#333" },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  iconBox: {
    width: (width - 64) / 4, // responsive: 4 icons, margin included
    paddingVertical: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  label: { flex: 1, marginLeft: 8, fontSize: 16 },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 16,
  },
});
