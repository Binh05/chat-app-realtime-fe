import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react'; // Thêm useState
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import TaskBar from '../components/TaskBar'; // Thêm import TaskBar

const POSTS = [
  {
    id: '1',
    user: {
      name: 'Zepenllin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
      subtitle: 'Satellites',
      isFollowing: false,
    },
    content: "Binance Expands Account Statement Function. With our VIP and institutional clients in mind, we've upgraded the account statement function...",
    image: 'https://images.unsplash.com/photo-1621504450168-38f647319936?q=80&w=800',
    likes: 1900,
    likedBy: 'Huoge',
    responses: 150,
    responseAvatars: [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100',
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100',
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100',
    ]
  },
  // Thêm thêm posts nếu muốn
  {
    id: '2',
    user: {
      name: 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      subtitle: 'Tech News',
      isFollowing: true,
    },
    content: "React Native 0.74 released with new features and improvements!",
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800',
    likes: 850,
    likedBy: 'Bob',
    responses: 45,
    responseAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100',
    ]
  },
];

const PostItem = ({ item }: { item: any }) => (
  <View style={styles.postContainer}>
    
    {/* 1. Header bài viết (Avatar, Tên, Follow, Menu) */}
    <View style={styles.postHeader}>
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.user.name}</Text>
        <Text style={styles.userSubtitle}>{item.user.subtitle}</Text>
      </View>

      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followText}>
          {item.user.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={20} color="#000" />
      </TouchableOpacity>
    </View>

    {/* 2. Nội dung Text */}
    <Text style={styles.postContent} numberOfLines={3}>
      {item.content}
    </Text>

    {/* 3. Hình ảnh bài viết */}
    <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />

    {/* 4. Thanh hành động (Tim, Chat, Share, Add) */}
    <View style={styles.actionRow}>
      <View style={styles.leftActions}>
        <TouchableOpacity style={styles.actionIcon}>
          <Ionicons name="heart-outline" size={26} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIcon}>
          <Ionicons name="chatbubble-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIcon}>
          <Ionicons name="share-social-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity>
        <Ionicons name="add-circle-outline" size={28} color="#000" />
      </TouchableOpacity>
    </View>

    {/* 5. Số lượt Like */}
    <Text style={styles.likesText}>
      Liked by <Text style={styles.boldText}>{item.likedBy}</Text> and <Text style={styles.boldText}>others {item.likes.toLocaleString()}</Text>
    </Text>

    {/* 6. Phần Responses */}
    <View style={styles.responseRow}>
      <View style={styles.facepileContainer}>
        {item.responseAvatars.map((avatarUrl: string, index: number) => (
          <Image 
            key={index} 
            source={{ uri: avatarUrl }} 
            style={[
              styles.facepileAvatar, 
              { zIndex: 10 - index, marginLeft: index === 0 ? 0 : -10 }
            ]} 
          />
        ))}
      </View>
      <View style={styles.responseBadge}>
        <Text style={styles.responseText}>{item.responses} responses</Text>
      </View>
    </View>
  </View>
);

export default function HomeScreen() {
  const [currentTab, setCurrentTab] = useState('home'); // State cho TaskBar

  return (
    <View style={{ flex: 1 }}>
      {/* Phần nội dung HomeScreen */}
      <SafeAreaView style={styles.container}>
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
        <FlatList
          data={POSTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </SafeAreaView>

      {/* TaskBar ở dưới cùng */}
      <TaskBar current={currentTab} onChange={setCurrentTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
    paddingBottom: 70, // Thêm padding cho TaskBar
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 15,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    borderWidth: 1,
    borderColor: '#fff',
  },

  postContainer: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#F8F9FA',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  userSubtitle: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  followButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  followText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  menuButton: {
    padding: 4,
  },

  postContent: {
    fontSize: 15,
    color: '#111',
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#222',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 16,
  },
  
  likesText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 12,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },

  responseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facepileContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  facepileAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  responseBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  responseText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
});