import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";

const notificationsData = [
  { id: "1", text: "Bạn có tin nhắn mới từ John" },
  { id: "2", text: "Đơn hàng của bạn đã được gửi" },
  { id: "3", text: "Có sự kiện mới hôm nay" },
  { id: "4", text: "Thông báo thứ 4" },
  { id: "5", text: "Thông báo thứ 5" },
];

export default function NotificationDropdown() {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <Ionicons name="notifications-outline" size={28} color="#000" />
        </TouchableOpacity>
      }
      contentStyle={{ paddingVertical: 0 }}
    >
      {notificationsData.length === 0 ? (
        <Menu.Item title="Không có thông báo" />
      ) : (
        <ScrollView style={{ maxHeight: 250 }}>
          {notificationsData.map((item, index) => (
            <View key={item.id}>
              <Menu.Item title={item.text} />
              {index < notificationsData.length - 1 && <Divider />}
            </View>
          ))}
        </ScrollView>
      )}
    </Menu>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
