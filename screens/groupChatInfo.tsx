import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GroupInfoPage({ route, navigation }: any) {
  const { groupName, members } = route.params;

  const sampleImages = [
    "https://i.pravatar.cc/200?img=33",
    "https://i.pravatar.cc/200?img=12",
    "https://i.pravatar.cc/200?img=17",
    "https://i.pravatar.cc/200?img=24",
    "https://i.pravatar.cc/200?img=40",
    "https://i.pravatar.cc/200?img=16",
  ];

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông tin nhóm</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* GROUP INFO */}
      <View style={styles.groupInfo}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=55" }}
          style={styles.groupAvatar}
        />
        <Text style={styles.groupName}>{groupName}</Text>
        <Text style={styles.memberCount}>{members.length} thành viên</Text>
      </View>

      {/* MEMBERS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thành viên</Text>

        {members.map((m: any) => (
          <View key={m.id} style={styles.memberRow}>
            <Image source={{ uri: m.img }} style={styles.memberAvatar} />
            <Text style={styles.memberName}>{m.name}</Text>
          </View>
        ))}
      </View>

      {/* MEDIA SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kho ảnh</Text>

        <View style={styles.imgGrid}>
          {sampleImages.map((img, i) => (
            <Image key={i} source={{ uri: img }} style={styles.mediaImg} />
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.leaveBtn}>
        <Text style={styles.leaveText}>Rời nhóm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },

  groupInfo: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 8,
    borderColor: "#f2f2f2",
  },

  groupAvatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: 10,
  },

  groupName: { fontSize: 20, fontWeight: "bold" },

  memberCount: { fontSize: 14, color: "#666", marginTop: 3 },

  section: { padding: 15 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },

  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  memberAvatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 12,
  },

  memberName: { fontSize: 15 },

  imgGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  mediaImg: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 10,
  },

  leaveBtn: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 60,
  },

  leaveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
