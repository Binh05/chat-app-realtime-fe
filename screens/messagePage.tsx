import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { StackNavigationProp } from "@react-navigation/stack";

type Props = {
  navigation: StackNavigationProp<any>;
};

export default function MessagePage({ navigation }: Props) {
  const onlineUsers = [
    { id: 1, name: "Christopher", img: "https://i.pravatar.cc/150?img=12" },
    { id: 2, name: "Reese", img: "https://i.pravatar.cc/150?img=32" },
    { id: 3, name: "Jeffrey", img: "https://i.pravatar.cc/150?img=28" },
    { id: 4, name: "Laura", img: "https://i.pravatar.cc/150?img=15" },
    { id: 5, name: "Maldonado", img: "https://i.pravatar.cc/150?img=48" },
  ];

  const messages = [
    {
      id: 1,
      name: "Ellen Lambert",
      message: "Hey! How's it going?",
      time: "04:04AM",
      img: "https://i.pravatar.cc/150?img=47",
      badge: 3,
    },
    {
      id: 2,
      name: "Connor Frazier",
      message: "What kind of music do you like?",
      time: "08:58PM",
      img: "https://i.pravatar.cc/150?img=34",
      badge: 1,
    },
    {
      id: 3,
      name: "Josephine Gordon",
      message: "Sounds good to me!",
      time: "11:33PM",
      img: "https://i.pravatar.cc/150?img=26",
      badge: 0,
    },
  ];

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.headerRow}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100?img=5" }}
          style={styles.headerAvatar}
        />
        <Ionicons name="notifications-outline" size={26} color="#333" />
      </View>

      {/* ================= ONLINE USERS ================= */}
      <Text style={styles.title}>ONLINE USERS</Text>
      <FlatList
        data={onlineUsers}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.flatList_1}
        renderItem={({ item }) => (
          <View style={styles.onlineUser}>
            <View>
              <Image source={{ uri: item.img }} style={styles.onlineAvatar} />
              <View style={styles.onlineDot} />
            </View>
            <Text style={styles.onlineName}>{item.name}</Text>
          </View>
        )}
      />

      {/* ================= CHATS ================= */}
      <Text style={styles.title}>CHATS</Text>

      {/* ================= MESSAGE LIST ================= */}
      <FlatList
        data={messages}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.messageContainer} onPress={() => navigation.navigate("Detail")}>
            <Image source={{ uri: item.img }} style={styles.messageAvatar} />
            {/* Badge tin nhắn */}
            {item.badge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            )}
            <View style={styles.messageContent}>
              <View style={styles.rowBetween}>
                <Text style={styles.name}>{item.name}</Text>  
                <Text style={styles.time}>{item.time}</Text>
              </View>

              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 45,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  headerAvatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },

  // Online users
  flatList_1: {
    flexGrow: 0,
    marginBottom: 10,
    paddingVertical: 5,
  },

  onlineUser: {
    width: 70,
    alignItems: "center",
    marginRight: 18,
  },

  onlineAvatar: {
    width: 65,
    height: 65,
    borderRadius: 50,
  },
  onlineName: {
    marginTop: 6,
    fontSize: 12,
  },
  onlineDot: {
    width: 14,
    height: 14,
    backgroundColor: "#2ecc71",
    borderRadius: 50,
    position: "absolute",
    bottom: 4,
    right: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },

  // Message
  messageContainer: {
    flexDirection: "row",
    marginBottom: 25,
    alignItems: "center",
  },
  messageAvatar: {
    width: 65,
    height: 65,
    borderRadius: 50,
  },

  badge: {
    position: "absolute",
    left: 45,
    top: 5,
    backgroundColor: "red",
    width: 22,
    height: 22,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  messageContent: {
    marginLeft: 12,
    flex: 1,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  time: {
    fontSize: 12,
    color: "#777",
  },

  messageText: {
    marginTop: 5,
    color: "#555",
  },
});
