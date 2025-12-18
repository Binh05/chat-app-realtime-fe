import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TaskBar from "../components/TaskBar";
import { useRoute } from "@react-navigation/native";
import { useContextSelector } from "use-context-selector";
import { UserContext } from "../contexts/UserContext";

const { width } = Dimensions.get("window");

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const user = useContextSelector(UserContext, (v) => v.state);
  const [currentTab, setCurrentTab] = useState("profile");
  const route = useRoute();
  const routeToKey: Record<string, string> = {
    Home: "home",
    Message: "messages",
    Contacts: "contacts",
    Profile: "profile",
  };

  return (
    <View style={styles.container}>
      {/* Header Area (Transparent overlay) */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Setting")}
            style={{ padding: 5, marginRight: 5 }}
          >
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Cover Image Wrapper */}
        <View style={styles.coverContainer}>
          <View style={styles.coverPlaceholder} />
        </View>

        {/* Main Content (White part) */}
        <View style={styles.contentContainer}>
          {/* Avatar (Floating) */}
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  user?.avatarUrl ??
                  "https://res.cloudinary.com/dyt536gfk/image/upload/v1765996624/avatar_e9pjjr.jpg",
              }}
              style={styles.avatar}
            />
          </View>

          {/* User Info */}
          <View style={styles.infoSection}>
            <Text style={styles.name}>{user?.username ?? "unknow"}</Text>
            <TouchableOpacity>
              <Text style={styles.bioLink}>Cập nhật giới thiệu bản thân</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="image-outline" size={20} color="#333" />
              <Text style={styles.actionBtnText}>Ảnh của tôi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="folder-open-outline" size={20} color="#333" />
              <Text style={styles.actionBtnText}>Kho khoảnh khắc</Text>
            </TouchableOpacity>
          </View>

          {/* --- CẬP NHẬT Ở ĐÂY: Post Input --- */}
          {/* Đổi từ View sang TouchableOpacity để bấm được */}
          <TouchableOpacity
            style={styles.postInputContainer}
            onPress={() => navigation.navigate("CreatePostProfile")}
          >
            <Text style={styles.placeholderText}>Bạn đang nghĩ gì?</Text>
            <Ionicons name="images-outline" size={24} color="#666" />
          </TouchableOpacity>

          {/* Timeline Feed */}
          <View style={styles.feedItem}>
            <View style={styles.dateTag}>
              <Text style={styles.dateText}>27 tháng 9</Text>
            </View>
            <Text style={styles.feedTitle}>Bài đăng gần đây</Text>

            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
              }}
              style={styles.feedImage}
            />

            <View style={styles.feedActions}>
              <View style={styles.feedLeftActions}>
                <TouchableOpacity style={styles.iconCircle}>
                  <Ionicons name="heart-outline" size={22} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconCircle}>
                  <Ionicons name="chatbubble-outline" size={22} color="#333" />
                </TouchableOpacity>
                <Text style={styles.commentCount}>36 bình luận</Text>
              </View>
              <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* --- MỚI: Hiển thị TaskBar ở dưới cùng --- */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Header Custom
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    paddingTop: 50,
  },
  iconBtn: { padding: 5 },
  headerActions: { flexDirection: "row", alignItems: "center" },

  // Cover & Shape
  coverContainer: { height: 220, backgroundColor: "#EFEFEF" },
  coverPlaceholder: { flex: 1, backgroundColor: "#E0E0E0" },

  contentContainer: {
    marginTop: -40,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    minHeight: 500,
  },

  // Avatar Logic
  avatarContainer: {
    alignSelf: "center",
    marginTop: -50,
    borderWidth: 4,
    borderColor: "#fff",
    borderRadius: 50,
  },
  avatar: { width: 90, height: 90, borderRadius: 45 },

  // Info
  infoSection: { alignItems: "center", marginTop: 10 },
  name: { fontSize: 22, fontWeight: "bold", color: "#222" },
  bioLink: { color: "#007AFF", marginTop: 5, fontWeight: "500" },

  // Buttons
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 15,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  actionBtnText: { marginLeft: 8, fontWeight: "600", color: "#333" },

  // Post Input
  postInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderText: { color: "#888" },

  // Feed
  feedItem: { marginTop: 25 },
  dateTag: {
    alignSelf: "flex-start",
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  dateText: { fontSize: 12, color: "#555", fontWeight: "bold" },
  feedTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  feedImage: { width: "100%", height: 180, borderRadius: 12 },

  feedActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  feedLeftActions: { flexDirection: "row", alignItems: "center" },
  iconCircle: { marginRight: 10, padding: 5 },
  commentCount: { color: "#333", fontWeight: "600", marginLeft: 5 },
});

export default ProfileScreen;
