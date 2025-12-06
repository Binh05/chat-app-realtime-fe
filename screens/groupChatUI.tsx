import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GroupChatPage({ route, navigation }: any) {
  const { groupName, members } = route.params;

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "Reese",
      text: "Hello Team!",
      time: "10:20",
      self: false,
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    {
      id: "2",
      sender: "You",
      text: "Chào mọi người 👋",
      time: "10:21",
      self: true,
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: "3",
      sender: "Laura",
      text: "Ngày mai họp lúc 8h nha!",
      time: "10:22",
      self: false,
      avatar: "https://i.pravatar.cc/150?img=15",
    },
  ]);

  const [text, setText] = useState("");

  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "You",
      text,
      time: "Now",
      self: true,
      avatar: "https://i.pravatar.cc/150?img=5",
    };

    setMessages([...messages, newMessage]);
    setText("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* ================== HEADER ================== */}

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={25} color="#333" />
          </TouchableOpacity>

          <View>
            <Text style={styles.groupName}>{groupName}</Text>
            <Text style={styles.memberList}>
              {members.map((m: { name: any }) => m.name).join(", ")}
            </Text>
          </View>

          {/* Avatar stack */}
          <View style={styles.avatarStack}>
            {members
              .slice(0, 3)
              .map(
                (
                  m: { id: React.Key | null | undefined; img: any },
                  i: number
                ) => (
                  <Image
                    key={m.id}
                    source={{ uri: m.img }}
                    style={[styles.stackAvatar, { left: i * 15 }]}
                  />
                )
              )}
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("GroupInfo", { groupName, members })
            }
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* ================== CHAT LIST ================== */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 15, paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageRow,
                item.self ? styles.selfRow : styles.otherRow,
              ]}
            >
              {!item.self && (
                <Image source={{ uri: item.avatar }} style={styles.msgAvatar} />
              )}

              <View style={styles.bubble}>
                {!item.self && (
                  <Text style={styles.senderName}>{item.sender}</Text>
                )}
                <Text style={styles.msgText}>{item.text}</Text>
                <Text style={styles.msgTime}>{item.time}</Text>
              </View>
            </View>
          )}
        />

        {/* ================== INPUT BAR ================== */}
        <View style={styles.inputBar}>
          <TouchableOpacity>
            <Ionicons name="add" size={30} color="#3498db" />
          </TouchableOpacity>

          <TextInput
            placeholder="Tin nhắn..."
            style={styles.input}
            value={text}
            onChangeText={setText}
          />

          <TouchableOpacity onPress={sendMessage}>
            <Ionicons name="send" size={26} color="#3498db" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  /* HEADER */
  header: {
    paddingTop: 45,
    paddingBottom: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    justifyContent: "space-between",
  },

  groupName: { fontSize: 18, fontWeight: "bold" },
  memberList: { fontSize: 12, color: "#555" },

  avatarStack: {
    flexDirection: "row",
    width: 70,
    height: 30,
    marginRight: 10,
  },

  stackAvatar: {
    width: 30,
    height: 30,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    position: "absolute",
  },

  /* MESSAGE ROW */
  messageRow: {
    flexDirection: "row",
    marginBottom: 12,
    maxWidth: "80%",
  },

  selfRow: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },

  otherRow: {
    alignSelf: "flex-start",
  },

  msgAvatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginRight: 8,
  },

  bubble: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    minWidth: 80,
    maxWidth: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  senderName: { fontSize: 12, color: "#3498db", marginBottom: 3 },

  msgText: { fontSize: 15, color: "#333" },

  msgTime: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
    alignSelf: "flex-end",
  },

  /* INPUT BAR */
  inputBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#eee",
    marginHorizontal: 10,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 15,
  },
});
