import React, { useMemo, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";

import NotificationDropdown from "../components/ui/notification";
import TaskBar from "../components/TaskBar";
import { useRoute } from "@react-navigation/native";
import { useContextSelector } from "use-context-selector";
import { FriendContext } from "../contexts/FriendContext";
import { SocketContext } from "../contexts/socketContext";
import { ChatContext } from "../contexts/chatContext";
import { UserContext } from "../contexts/UserContext";
import { useFetchConversations } from "../hooks/useFetchConversations";
import { useFetchFriends } from "../hooks/useFetchFriends";
import {
  findOtherParticipant,
  convertConversationToChatItem,
  isValidConversation,
} from "../utils/conversationHelper";

type Props = {
  navigation: StackNavigationProp<any>;
};

export default function MessagePage({ navigation }: Props) {
  const [currentTab, setCurrentTab] = useState("messages");
  const [searchText, setSearchText] = useState("");
  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<any[]>([]);

  const route = useRoute();
  const routeToKey: Record<string, string> = {
    Home: "home",
    Message: "messages",
    Contacts: "contacts",
    Profile: "profile",
  };

  // Fetch conversations with hook
  const {
    conversations = [],
    isLoaded,
    loading: conversationLoading,
    error: conversationError,
    refetch: refetchConversations,
  } = useFetchConversations({
    autoFetch: true,
  });

  // Fetch friends with online status
  const {
    onlineFriends,
    isFriendOnline,
    refetch: refetchFriends,
  } = useFetchFriends({
    autoFetch: true,
  });

  // Refetch friends và conversations mỗi khi vô trang này
  useFocusEffect(
    React.useCallback(() => {
      refetchFriends();
      refetchConversations();
    }, [refetchFriends, refetchConversations])
  );

  // Get socket state for online indicator
  const { state: socketState } = useContextSelector(SocketContext, (v) => v);

  // Get current user info
  const { state: userState } = useContextSelector(UserContext, (v) => v);

  // Filter online users from friends list
  const onlineList = useMemo(() => {
    return onlineFriends.map((friend: any) => ({
      _id: friend._id,
      username: friend.username,
      avatarUrl: friend.avatarUrl || "https://i.pravatar.cc/100",
    }));
  }, [onlineFriends]);

  // Combine conversations with online status
  const chatList = useMemo(() => {
    // Phòng thủ: kiểm tra conversations có dữ liệu
    if (!Array.isArray(conversations) || conversations.length === 0) {
      return groups;
    }

    const directConversations = conversations
      .filter((convo: any) => {
        // Kiểm tra conversation có hợp lệ
        if (!isValidConversation(convo)) {
          console.warn("❌ Invalid conversation:", convo._id);
          return false;
        }

        // Phòng thủ: kiểm tra type của conversation
        if (convo.type && convo.type !== "direct") {
          return false;
        }

        return true;
      })
      .map((convo: any) => {
        // Sử dụng helper function để chuyển đổi conversation
        const chatItem = convertConversationToChatItem(
          convo,
          userState._id,
          isFriendOnline
        );

        if (chatItem) {
        } else {
          console.warn("❌ Failed to convert conversation:", convo._id);
        }

        return chatItem;
      })
      .filter((item: any) => item !== null); // Loại bỏ null items

    const finalList = [...groups, ...directConversations];

    return finalList;
  }, [conversations, groups, userState._id, isFriendOnline]);

  // Filter chats by search text
  const filteredChats = useMemo(() => {
    return chatList.filter((c: any) => {
      // Phòng thủ: kiểm tra c là object hợp lệ
      if (!c) return false;

      if (c.type === "group") {
        return (
          c.name?.toLowerCase().includes(searchText.toLowerCase()) ?? false
        );
      }

      // Cho direct chat: so sánh với name (đã được set từ otherParticipant.username)
      return c.name?.toLowerCase().includes(searchText.toLowerCase()) ?? false;
    });
  }, [searchText, chatList]);

  // Debug logging
  useEffect(() => {
    if (userState._id && conversations.length > 0) {
      if (chatList.length > 0) {
      }
    }
  }, [userState._id, conversations.length, chatList.length]);

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
        data={onlineList}
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
              <Image
                source={{ uri: item.avatarUrl }}
                style={styles.onlineAvatar}
              />
              <View style={styles.onlineDot} />
            </View>
            <Text style={styles.onlineName}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />

      {/* ========== CHATS ========== */}
      <Text style={styles.title}>CHATS</Text>

      {conversationLoading && !chatList.length ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={{ marginTop: 10, color: "#999" }}>
            Đang tải cuộc trò chuyện...
          </Text>
        </View>
      ) : chatList.length === 0 ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "#999" }}>Chưa có cuộc trò chuyện nào</Text>
          <Text style={{ color: "#999", fontSize: 12, marginTop: 5 }}>
            Hãy kết bạn để bắt đầu chat
          </Text>
        </View>
      ) : (
        <FlatList
          data={chatList}
          keyExtractor={(item, index) => item?._id || `chat-${index}`}
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
                onPress={() =>
                  // Truyền đúng params cho màn Detail/Chat
                  navigation.navigate("Detail", {
                    conversationId: item._id, // ID cuộc trò chuyện
                    user: item.otherUser, // Object user kia (để lấy tên/avatar header)
                  })
                }
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={{ uri: item.img }}
                    style={styles.messageAvatar}
                  />
                  {/* Online indicator */}
                  {item.isOnline && <View style={styles.onlineIndicator} />}
                </View>

                {/* Badge logic: chỉ hiện nếu > 0 */}
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

                  {/* Thêm style logic để in đậm nếu chưa đọc */}
                  <Text
                    style={[
                      styles.messageText,
                      item.badge > 0 && { fontWeight: "bold", color: "#000" },
                    ]}
                    numberOfLines={1}
                  >
                    {/* Helper đã xử lý logic text tin nhắn */}
                    {item.message}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

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
              data={onlineList}
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
                    members: onlineList.filter((u: any) =>
                      selectedUsers.includes(u._id)
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

  onlineIndicator: {
    width: 14,
    height: 14,
    backgroundColor: "#2ecc71",
    borderRadius: 50,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#fff",
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
