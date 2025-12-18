import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useCreateFeed } from "../hooks/useCreateFeed";
import { useContextSelector } from "use-context-selector";
import { UserContext } from "../contexts/UserContext";

export const CreatePostProfile = ({ navigation }: { navigation: any }) => {
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { createFeed, loading, error } = useCreateFeed();
  const { state: user } = useContextSelector(UserContext, (v) => v);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    try {
      const res = await createFeed(postText, selectedImage);
      if (res) {
        Alert.alert("Thành công", "Đã đăng bài");
        navigation.goBack();
      }
    } catch {
      Alert.alert("Lỗi", error || "Không thể đăng bài");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo bài viết</Text>
        <TouchableOpacity
          onPress={handlePost}
          disabled={loading || (!postText && !selectedImage)}
          style={[
            styles.postButton,
            { opacity: loading || (!postText && !selectedImage) ? 0.5 : 1 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Đăng</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.userInfoContainer}>
        <Image
          source={{
            uri: "https://res.cloudinary.com/dyt536gfk/image/upload/v1765996624/avatar_e9pjjr.jpg",
          }}
          style={styles.avatar}
        />
        <View style={styles.userInfoText}>
          <Text style={styles.userName}>{user?.username}</Text>
          <View style={styles.privacyBadge}>
            <Ionicons name="earth" size={12} color="#666" />
            <Text style={styles.privacyText}>Công khai</Text>
          </View>
        </View>
      </View>

      <ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Bạn đang nghĩ gì?"
          multiline
          value={postText}
          onChangeText={setPostText}
        />

        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
            />
            <TouchableOpacity
              style={styles.removeImageBtn}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close-circle" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.toolbarContainer}>
          <TouchableOpacity style={styles.toolbarItem} onPress={pickImage}>
            <Ionicons name="images-outline" size={24} color="#4CAF50" />
            <Text style={styles.toolbarLabel}>Ảnh/Video</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolbarItem}>
            <Ionicons name="person-add-outline" size={24} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarItem}>
            <Ionicons name="happy-outline" size={24} color="#FFC107" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarItem}>
            <Ionicons name="location-outline" size={24} color="#FF5722" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  postButton: {
    backgroundColor: "#0077B6",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  postButtonText: { color: "#fff", fontWeight: "bold" },
  input: {
    padding: 15,
    fontSize: 18,
    minHeight: 120,
  },
  imagePreviewContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 300,
  },
  removeImageBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  // toolbarContainer: {
  //   padding: 12,
  //   borderTopWidth: 1,
  //   borderColor: "#eee",
  // },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  avatar: { width: 46, height: 46, borderRadius: 23 },
  userInfoText: { marginLeft: 10 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#222" },
  privacyBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 2,
    gap: 4,
  },
  privacyText: { fontSize: 12, color: "#666", fontWeight: "500" },

  toolbarContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  toolbarItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    padding: 5,
  },
  toolbarLabel: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});

export default CreatePostProfile;
