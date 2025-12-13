import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { StackNavigationProp } from "@react-navigation/stack";

import NotificationDropdown from "../components/ui/notification";
import TaskBar from "../components/TaskBar";
import { useRoute } from "@react-navigation/native";

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

  const [currentTab, setCurrentTab] = useState("messages");
  const [searchText, setSearchText] = useState("");

  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<any[]>([]);

  const chatList = [
    ...groups.map((g) => ({ type: "group", ...g })),
    ...messages.map((m) => ({ type: "private", ...m })),
  ];

  // Lọc theo tên
  const filteredChats = useMemo(() => {
    return chatList.filter((c) =>
      c.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  const route = useRoute();
  const routeToKey: Record<string, string> = {
    Home: "home",
    Message: "messages",
    Contacts: "contacts",
    Profile: "profile",
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=5" }}
            style={styles.headerAvatar}
          />
        </TouchableOpacity>
        <NotificationDropdown />
      </View>

      <View style={{ flexDirection: "row" }}>
        {/* CREATE GROUP BUTTON */}
        <View style={{ width: "15%" }}>
          <TouchableOpacity
            style={styles.createGroupButton}
            onPress={() => setCreateGroupVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>
        {/* SEARCH BAR */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#555" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for friends..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* ========== ONLINE USERS ========== */}
      <Text style={styles.title}>ONLINE USERS</Text>
      <FlatList
        data={onlineUsers}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.flatList_1}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.onlineUser}
            onPress={() => navigation.navigate("Detail", { user: item })}
          >
            <View>
              <Image source={{ uri: item.img }} style={styles.onlineAvatar} />
              <View style={styles.onlineDot} />
            </View>
            <Text style={styles.onlineName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* ========== CHATS ========== */}
      <Text style={styles.title}>CHATS</Text>

      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item.type === "group") {
            return (
              <TouchableOpacity
                style={styles.messageContainer}
                onPress={() => navigation.navigate("GroupChat", item)}
              >
                <View style={styles.groupAvatarWrapper}>
                  <Image
                    source={{ uri: item.members[0].img }}
                    style={styles.groupAvatar}
                  />
                  {item.members[1] && (
                    <Image
                      source={{ uri: item.members[1].img }}
                      style={[styles.groupAvatar, styles.groupAvatar2]}
                    />
                  )}
                </View>

                <View style={styles.messageContent}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>

                  <Text style={styles.messageText}>{item.lastMessage}</Text>
                </View>
              </TouchableOpacity>
            );
          }

          // ===== PRIVATE CHAT =====
          return (
            <TouchableOpacity
              style={styles.messageContainer}
              onPress={() => navigation.navigate("Detail")}
            >
              <Image source={{ uri: item.img }} style={styles.messageAvatar} />

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
          );
        }}
      />

      {/* ========== CREATE GROUP MODAL ========== */}
      {createGroupVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Tạo nhóm chat</Text>

            <View style={styles.inputBox}>
              <Text style={styles.label}>Tên nhóm</Text>
              <TextInput
                placeholder="Nhập tên nhóm..."
                style={styles.input}
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>

            <Text style={[styles.label, { marginTop: 10 }]}>
              Chọn thành viên
            </Text>

            <FlatList
              data={onlineUsers}
              style={{ maxHeight: 150 }}
              renderItem={({ item }) => {
                const isSelected = selectedUsers.includes(item.id);
                return (
                  <TouchableOpacity
                    style={styles.userRow}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedUsers(
                          selectedUsers.filter((id) => id !== item.id)
                        );
                      } else {
                        setSelectedUsers([...selectedUsers, item.id]);
                      }
                    }}
                  >
                    <Image
                      source={{ uri: item.img }}
                      style={styles.userAvatarSmall}
                    />
                    <Text style={styles.userName}>{item.name}</Text>

                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={22}
                      color={isSelected ? "#3498db" : "#777"}
                    />
                  </TouchableOpacity>
                );
              }}
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setCreateGroupVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createBtn}
                onPress={() => {
                  if (!groupName.trim()) {
                    alert("Vui lòng nhập tên nhóm!");
                    return;
                  }
                  if (selectedUsers.length < 2) {
                    alert("Nhóm cần ít nhất 2 thành viên!");
                    return;
                  }

                  const newGroup = {
                    id: Date.now().toString(),
                    name: groupName,
                    members: onlineUsers.filter((u) =>
                      selectedUsers.includes(u.id)
                    ),
                    lastMessage: "Group created",
                    time: "Now",
                  };

                  setGroups([...groups, newGroup]);
                  navigation.navigate("GroupChat", newGroup);

                  setCreateGroupVisible(false);
                  setGroupName("");
                  setSelectedUsers([]);
                }}
              >
                <Text style={styles.createText}>Tạo nhóm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Bottom TaskBar */}
      <TaskBar
        current={routeToKey[route.name] || "home"}
        onChange={(key) => {
          setCurrentTab(key);
          if (key === "home") navigation.navigate("Home");
          if (key === "messages") navigation.navigate("Message");
          if (key === "contacts") navigation.navigate("Contacts");
          if (key === "profile") navigation.navigate("Profile");
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 45,
    backgroundColor: "#fff",
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 20,
  },

  headerAvatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },

  createGroupButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 42,
    borderRadius: 12,
    marginBottom: 10,
  },

  /* SEARCH */
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    height: 42,
    marginBottom: 15,
    width: "80%",
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
  },

  flatList_1: {
    flexGrow: 0,
    marginBottom: 10,
    paddingVertical: 5,
  },

  onlineUser: {
    width: 70,
    alignItems: "center",
    marginRight: 18,
    paddingHorizontal: 20,
  },

  onlineAvatar: {
    width: 65,
    height: 65,
    borderRadius: 50,
  },

  onlineName: {
    width: 70,
    textAlign: "center",
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

  messageContainer: {
    flexDirection: "row",
    marginBottom: 22,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  messageAvatar: {
    width: 65,
    height: 65,
    borderRadius: 50,
  },

  badge: {
    position: "absolute",
    left: 70,
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

  modalOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  inputBox: {
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "space-between",
  },

  userAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 12,
  },

  userName: {
    flex: 1,
    fontSize: 15,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },

  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },

  cancelText: {
    color: "#777",
    fontSize: 15,
  },

  createBtn: {
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  createText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

  /* Group avatar stack */
  groupAvatarWrapper: {
    width: 65,
    height: 65,
    position: "relative",
    marginRight: 12,
  },

  groupAvatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    position: "absolute",
    left: 0,
    top: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },

  groupAvatar2: {
    left: 20,
    top: 0,
  },
});
