import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Provider, Menu, Divider } from "react-native-paper";

const notificationsData = [
  { id: "1", text: "Bạn có tin nhắn mới từ John" },
  { id: "2", text: "Đơn hàng của bạn đã được gửi" },
  { id: "3", text: "Có sự kiện mới hôm nay" },
  { id: "4", text: "Thông báo thứ 4" },
  { id: "5", text: "Thông báo thứ 5" },
];

export default function NotificationDropdown() {
  const [menuVisible, setMenuVisible] = useState(false);

  const handlePress = () => {
    console.log("Trước khi click, menuVisible =", menuVisible);
    setMenuVisible((menuVisible) => !menuVisible);
    console.log("Sau khi click, menuVisible =", !menuVisible);
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <View style={styles.anchorWrapper}>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Ionicons
                name="notifications-outline"
                size={30}
                color="#070707ff"
              />
            </TouchableOpacity>
          </View>
        }
      >
        {notificationsData.length === 0 ? (
          <Menu.Item title="Không có thông báo" />
        ) : (
          <View style={{ maxHeight: 300, overflow: "scroll" }}>
            {notificationsData.map((item) => (
              <View key={item.id} style={styles.notificationItem}>
                <Text style={styles.notificationText}>{item.text}</Text>
                <Divider />
              </View>
            ))}
          </View>
        )}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 40,
    minHeight: 40,
  },

  anchorWrapper: {
    minWidth: 40,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  notificationText: {
    fontSize: 14,
    color: "#333",
  },
});
