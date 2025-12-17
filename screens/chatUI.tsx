import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useContextSelector } from "use-context-selector";
import { ChatContext } from "../contexts/chatContext";
import { UserContext } from "../contexts/UserContext";
import { useFetchMessages } from "../hooks/useFetchMessages";
import { useSendMessage } from "../hooks/useSendMessage";
import { useMarkAsRead } from "../hooks/useMarkAsRead";
import Noti from "../components/ui/noti";
import { format } from "date-fns";

export default function MessageDetailPage({
  navigation,
  route,
  conversationId: initialConversationId,
}: any) {
  // Get conversationId từ route params hoặc props
  const conversationId = route?.params?.conversationId || initialConversationId;

  // Get current user
  const { state: userState } = useContextSelector(UserContext, (v) => v);

  // Get chat state để lấy messages
  const { state: chatState } = useContextSelector(ChatContext, (v) => v);

  // Fetch messages từ API
  const { loading } = useFetchMessages(conversationId, true);

  // Get messages của conversation này từ store
  const messages = useMemo(() => {
    const allMessages = chatState.messages[conversationId] || [];

    // Format messages để hiển thị
    return allMessages.map((msg: any) => {
      const isSent = msg.senderId === userState._id;

      return {
        id: msg._id || msg.id,
        type: isSent ? "sent" : "received",
        message: msg.text || msg.content || msg.message,
        time: format(msg.createdAt, "HH:mm"),

        senderId: msg.senderId,
        status: isSent ? "Đã gửi" : undefined,
      };
    });
  }, [chatState.messages, conversationId, userState._id]);

  // Use send message hook
  const { sendMessage, sending } = useSendMessage();

  // Use mark as read hook
  const { markAsRead } = useMarkAsRead();

  const [noti, setNoti] = useState<{
    message: string | null;
    type: "success" | "error";
  }>({ message: "", type: "success" });

  // FlatList ref for auto-scroll
  const flatListRef = React.useRef<FlatList>(null);

  // Mark as read when entering conversation
  useFocusEffect(
    React.useCallback(() => {
      if (conversationId) {
        markAsRead(conversationId);
      }
    }, [conversationId])
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const [showEmoji, setShowEmoji] = React.useState(false);
  const [text, setText] = React.useState("");

  const onDismissSnackBar = () => setNoti({ message: null, type: "success" });

  const handleSendMessage = async () => {
    try {
      if (!text.trim()) {
        setNoti({ message: "Lỗi, Vui lòng nhập tin nhắn", type: "error" });
        return;
      }

      const result = await sendMessage(
        conversationId,
        otherUser?._id || otherUser?.id,
        text
      );
    } catch (error: any) {
      setNoti({
        message:
          error.response?.data?.message ||
          error.message ||
          "Gửi tin nhắn thất bại",
        type: "error",
      });
    } finally {
      setText("");
      setShowEmoji(false);
    }
  };

  const emojis = [
    "😀",
    "😁",
    "😂",
    "🤣",
    "😊",
    "😍",
    "😘",
    "😎",
    "🤔",
    "😢",
    "😭",
    "😡",
    "👍",
    "👎",
    "🙏",
    "💖",
    "🔥",
    "🎉",
  ];

  // Get other user info từ route params
  const otherUser = route?.params?.user || {
    username: "User",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
  };

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color="#333333ff"
          onPress={() => navigation.goBack()}
        ></Ionicons>
        <Image
          source={{
            uri: otherUser?.avatarUrl || "https://i.pravatar.cc/150?img=47",
          }}
          style={styles.headerAvatar}
          resizeMode="cover"
        />

        <View>
          <Text style={styles.headerName}>{otherUser?.username || "User"}</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>

        <View style={styles.headerIcons}>
          <Ionicons
            name="call-outline"
            size={24}
            color="#333333ff"
            onPress={() => navigation.navigate("PhoneUI")}
          />
          <Ionicons
            name="videocam-outline"
            size={26}
            color="#333"
            style={{ marginLeft: 20 }}
          />
          <Ionicons
            name="ellipsis-vertical"
            size={22}
            color="#333"
            style={{ marginLeft: 20 }}
            onPress={() => navigation.navigate("ChatDesc")}
          />
        </View>
      </View>

      {/* ================= MESSAGE LIST ================= */}
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={{ marginTop: 10, color: "#999" }}>
            Đang tải tin nhắn...
          </Text>
        </View>
      ) : messages.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#999" }}>Chưa có tin nhắn nào</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 15 }}
          onContentSizeChange={() => {
            // Auto scroll khi content size thay đổi
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageRow,
                item.type === "sent" && { justifyContent: "flex-end" },
              ]}
            >
              {/* On left message: show avatar */}
              {item.type === "received" && (
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?img=47" }}
                  style={styles.smallAvatar}
                />
              )}

              <View
                style={[
                  styles.bubble,
                  item.type === "sent" ? styles.bubbleRight : styles.bubbleLeft,
                ]}
              >
                {item.message && (
                  <Text style={styles.messageText}>{item.message}</Text>
                )}

                <Text style={styles.time}>{item.time}</Text>

                {item.status && (
                  <Text style={styles.statusText}>{item.status}</Text>
                )}
              </View>
            </View>
          )}
        />
      )}

      {showEmoji && (
        <View style={styles.emojiBox}>
          <FlatList
            data={emojis}
            numColumns={8}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.emojiItem}
                onPress={() => {
                  setText(text + item);
                }}
              >
                <Text style={{ fontSize: 28 }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* ================= INPUT BAR ================= */}
      <View style={styles.inputBar}>
        <Ionicons
          name="happy-outline"
          size={26}
          color="#999"
          onPress={() => setShowEmoji(!showEmoji)}
        />
        <TextInput
          placeholder="Write a message..."
          style={styles.input}
          placeholderTextColor="#aaa"
          value={text} // <-- liên kết state
          onChangeText={setText} // <-- cập nhật state khi gõ
        />

        <Ionicons
          name="image-outline"
          size={26}
          color="#999"
          style={{ marginHorizontal: 10 }}
        />
        <TouchableOpacity
          style={styles.sendBtn}
          disabled={sending || !text.trim()}
          onPress={handleSendMessage}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={22} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      <Noti
        message={noti.message}
        onDismissSnackBar={onDismissSnackBar}
        type={noti.type}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerAvatar: { width: 45, height: 45, borderRadius: 50, marginRight: 12 },
  headerName: { fontSize: 18, fontWeight: "600" },
  onlineRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  onlineDot: {
    width: 10,
    height: 10,
    backgroundColor: "#2ecc71",
    borderRadius: 50,
    marginRight: 5,
  },
  onlineText: { fontSize: 13, color: "#2ecc71" },
  headerIcons: {
    flexDirection: "row",
    marginLeft: "auto",
    alignItems: "center",
  },

  /* MESSAGES */
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 15,
  },

  smallAvatar: {
    width: 34,
    height: 34,
    borderRadius: 50,
    marginRight: 8,
  },

  bubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 15,
  },
  bubbleLeft: {
    backgroundColor: "#f7f7f7",
    borderTopLeftRadius: 0,
  },
  bubbleRight: {
    backgroundColor: "#3D8BFF",
    borderTopRightRadius: 0,
  },

  senderName: {
    color: "#d88400",
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 13,
  },
  messageText: {
    color: "#333",
    fontSize: 15,
    lineHeight: 20,
  },

  time: {
    fontSize: 12,
    marginTop: 8,
    color: "#999",
    alignSelf: "flex-end",
  },

  statusText: {
    marginTop: 3,
    fontSize: 11,
    color: "#999",
    alignSelf: "flex-end",
  },

  /* IMAGES GRID */
  imageGrid: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chatImage: {
    width: 140,
    height: 110,
    borderRadius: 10,
  },

  /* INPUT BAR */
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
  },

  sendBtn: {
    backgroundColor: "#3D8BFF",
    width: 42,
    height: 42,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  emojiBox: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    maxHeight: 250,
  },
  emojiItem: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "12.5%", // 8 emojis trên 1 dòng
  },
});
