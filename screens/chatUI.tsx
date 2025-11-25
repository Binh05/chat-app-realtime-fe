import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function MessageDetailPage({ navigation }: any) {
  const messages = [
    {
      id: 1,
      type: "received",
      sender: "Ellen Lambert",
      message: "Chào cậu, làm quen nhé!",
      time: "16.04",
      images: [],
    },
    {
      id: 2,
      type: "received",
      images: [
        "https://picsum.photos/300/200",
        "https://picsum.photos/300/201",
        "https://picsum.photos/300/202",
      ],
      time: "16.04",
    },
    {
      id: 3,
      type: "sent",
      message:
        "That's very nice place! You guys made a very good decision. Can't wait to go on vacation!",
      time: "16.04",
      status: "Đã gửi",
    },
  ];

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
          source={{ uri: "https://i.pravatar.cc/150?img=47" }}
          style={styles.headerAvatar}
          resizeMode="cover"
        />

        <View>
          <Text style={styles.headerName}>Ellen Lambert</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>

        <View style={styles.headerIcons}>
          <Ionicons name="call-outline" size={24} color="#333333ff" />
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
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 15 }}
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
              {item.sender && (
                <Text style={styles.senderName}>{item.sender}</Text>
              )}

              {item.message && (
                <Text style={styles.messageText}>{item.message}</Text>
              )}

              {/* Images grid */}
              {/* {item.images?.length > 0 && (
                <View style={styles.imageGrid}>
                  {item.images.map((img, index) => (
                    <Image key={index} source={{ uri: img }} style={styles.chatImage} />
                  ))}
                </View>
              )} */}

              <Text style={styles.time}>{item.time}</Text>

              {item.status && (
                <Text style={styles.statusText}>{item.status}</Text>
              )}
            </View>
          </View>
        )}
      />

      {/* ================= INPUT BAR ================= */}
      <View style={styles.inputBar}>
        <Ionicons name="happy-outline" size={26} color="#999" />

        <TextInput
          placeholder="Write a message..."
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        <Ionicons
          name="image-outline"
          size={26}
          color="#999"
          style={{ marginHorizontal: 10 }}
        />

        <TouchableOpacity style={styles.sendBtn}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
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
});
