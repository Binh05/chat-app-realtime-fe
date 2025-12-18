import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import TaskBar from "../components/TaskBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContextSelector } from "use-context-selector";
import { FeedContext } from "../contexts/feedContext";
import { useFetchFeeds } from "../hooks/useFetchFeeds";
import { useToggleLikeFeed } from "../hooks/useToggleLikeFeed";

const POSTS = [
  {
    id: "1",
    user: {
      name: "Zepenllin",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
      subtitle: "Satellites",
      isFollowing: false,
    },
    content:
      "Binance Expands Account Statement Function. With our VIP and institutional clients in mind, we've upgraded the account statement function...",
    image:
      "https://images.unsplash.com/photo-1621504450168-38f647319936?q=80&w=800",
    likes: 1900,
    likedBy: "Huoge",
    responses: 150,
    responseAvatars: [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100",
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100",
    ],
  },
  // Thêm thêm posts nếu muốn
  {
    id: "2",
    user: {
      name: "Alice Johnson",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
      subtitle: "Tech News",
      isFollowing: true,
    },
    content: "React Native 0.74 released with new features and improvements!",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800",
    likes: 850,
    likedBy: "Bob",
    responses: 45,
    responseAvatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
    ],
  },
];

const PostItem = ({ item, userId }: { item: any; userId: string }) => {
  const { toggleLike, loading: likeLoading } = useToggleLikeFeed();
  const [isLiked, setIsLiked] = useState(
    item.likeBy?.includes?.(userId) ?? false
  );

  const handleLike = async () => {
    setIsLiked((prev: any) => !prev);
    await toggleLike(item._id || item.id);
  };

  return (
    <View style={[styles.postContainer]}>
      {/* 1. Header */}
      <View style={styles.postHeader}>
        <Image
          source={{
            uri:
              item.user?.avatarURL ||
              "https://res.cloudinary.com/dyt536gfk/image/upload/v1765996624/avatar_e9pjjr.jpg",
          }}
          style={styles.avatar}
        />

        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.createdBy?.username ?? "user"}
          </Text>
        </View>

        {/* <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followText}>
            {item.user.isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 2. Content */}
      <Text style={styles.postContent} numberOfLines={3}>
        {item.title}
      </Text>

      {/* 3. Image */}
      {item.content && (
        <Image
          source={{ uri: item.content }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {/* 4. Actions */}
      <View style={styles.actionRow}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={handleLike}
            disabled={likeLoading}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={26}
              color={isLiked ? "#FF3B30" : "#000"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionIcon}>
            <Ionicons name="chatbubble-outline" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionIcon}>
            <Ionicons name="share-social-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <Ionicons name="add-circle-outline" size={28} color="#000" />
      </View>

      {/* 5. Likes */}
      <Text style={styles.likesText}>
        Liked by <Text style={styles.boldText}>{item.likeCounts || 0}</Text>{" "}
        people
      </Text>
    </View>
  );
};

export default function HomeScreen({ navigation }: any) {
  const [currentTab, setCurrentTab] = useState("home");
  const [page, setPage] = useState(1);
  const { loading, error, refetch } = useFetchFeeds(page, 10, undefined, true);
  const state = useContextSelector(FeedContext, (context) => context.state);
  const feeds = state?.feeds || [];
  const userId = useContextSelector(
    FeedContext,
    (context) => context.state?.userId || ""
  );

  const { total } = state;

  const handleLoadMore = () => {
    if (loading) return;

    if (feeds.length >= total) return;

    setPage((prev) => prev + 1);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Phần nội dung HomeScreen */}
      <SafeAreaView style={[styles.container]}>
        <StatusBar barStyle="dark-content" />

        {/* HEADER TỔNG (Sticky) */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={26} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Feeds</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="filter-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={24} color="#000" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* DANH SÁCH BÀI VIẾT */}
        {loading ? (
          <View style={[styles.centerContainer]}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Failed to load feeds</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : feeds.length > 0 ? (
          <FlatList
            data={feeds}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <PostItem item={item} userId={userId} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 0 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <View style={styles.centerContainer}>
            <Text>Chưa có bài đăng nào</Text>
          </View>
        )}
      </SafeAreaView>

      {/* TaskBar ở dưới cùng */}
      <TaskBar
        current={currentTab}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    paddingBottom: 70,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginLeft: 15,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    borderWidth: 1,
    borderColor: "#fff",
  },

  postContainer: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: "#F8F9FA",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  userSubtitle: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "500",
  },
  followButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  followText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  menuButton: {
    padding: 4,
  },

  postContent: {
    fontSize: 15,
    color: "#111",
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#222",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    marginRight: 16,
  },

  likesText: {
    fontSize: 13,
    color: "#444",
    marginBottom: 12,
  },
  boldText: {
    fontWeight: "bold",
    color: "#000",
  },

  responseRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  facepileContainer: {
    flexDirection: "row",
    marginRight: 10,
  },
  facepileAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  responseBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  responseText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 70,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
