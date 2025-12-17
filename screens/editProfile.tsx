import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard, 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useContextSelector } from "use-context-selector";
import { UserContext } from "../contexts/UserContext";
import { api } from "../utils/api";
import { Snackbar } from "react-native-paper";
import LoadingInit from "../components/ui/loadingInit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProfileScreen({ navigation }: any) {
  const user = useContextSelector(UserContext, (v) => v.user);
  const setUser = useContextSelector(UserContext, (v) => v.setUser);

  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "Trust your feelings..."); 
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSave = async () => {
    if (!username.trim()) {
      setError("Tên không được để trống");
      return;
    }

    Keyboard.dismiss();

    try {
      setLoading(true);
      setError(null);

      const res = await api.put("/users/profile", {
        username: username,
        bio: bio, 
      });

      if (res.status === 200) {
        const updatedUser = { 
            ...user, 
            username: username, 
            bio: bio 
        };

        setUser(updatedUser);

        await AsyncStorage.setItem("USER_STATE", JSON.stringify(updatedUser));
        
        console.log("✅ Đã lưu thông tin mới vào máy:", updatedUser);

        setSuccess(true);
        setTimeout(() => {
            navigation.goBack();
        }, 1000); 
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Không thể cập nhật thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <TouchableOpacity 
            onPress={handleSave} 
            disabled={loading}
            style={styles.saveBtn}
        >
            {loading ? <LoadingInit width={20} /> : <Text style={styles.saveText}>Lưu</Text>}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          
          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatarUrl || "https://i.pravatar.cc/150?img=5" }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.changePhotoBtn}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Form Inputs */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên hiển thị</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Nhập tên của bạn"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tiểu sử (Bio)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Giới thiệu đôi chút về bản thân..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Feedback UI */}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={3000}
        style={{ backgroundColor: "#FF4444" }}
      >
        <Text style={{color: '#fff'}}>{error}</Text>
      </Snackbar>
      <Snackbar
        visible={success}
        onDismiss={() => setSuccess(false)}
        duration={3000}
        style={{ backgroundColor: "#4CAF50" }}
      >
        <Text style={{color: '#fff'}}>Cập nhật thành công!</Text>
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  saveBtn: { padding: 8 },
  saveText: { fontSize: 16, fontWeight: "bold", color: "#0077B6" },
  
  content: { padding: 20 },
  
  avatarContainer: { alignSelf: "center", marginBottom: 30, position: "relative" },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: "#F0F0F0" },
  changePhotoBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#0077B6",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },

  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: "#666", marginBottom: 8, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#FAFAFA",
  },
  textArea: {
    minHeight: 100,
  },
});