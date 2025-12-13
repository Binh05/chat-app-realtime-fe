import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../utils/api";
import * as Haptics from "expo-haptics";
import { Snackbar } from "react-native-paper";
import LoadingInit from "../components/ui/loadingInit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContextSelector } from "use-context-selector";
import { UserContext } from "../contexts/UserContext";

interface SettingScreenProps {
  navigation: any;
}

const SettingScreen: React.FC<SettingScreenProps> = ({ navigation }) => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const clearUser = useContextSelector(UserContext, (v) => v.clearUser);

  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };

  // --- MỚI: Hàm quay về màn hình Home ---
  const navigateToHome = () => {
    navigation.navigate("Home");
    // Hoặc dùng navigation.goBack() nếu muốn quay lại trang trước đó bất kỳ
  };

  const handlePressPlaceholder = (featureName: string) => {
    Alert.alert("Thông báo", `Tính năng ${featureName} đang được phát triển!`);
  };

  const SettingItem = ({
    icon,
    label,
    onPress,
    isLast = false,
  }: {
    icon: any;
    label: string;
    onPress?: () => void;
    isLast?: boolean;
  }) => (
    <>
      <TouchableOpacity style={styles.rowItem} onPress={onPress}>
        <View style={styles.rowLeft}>
          <Ionicons name={icon} size={22} color="#333" />
          <Text style={styles.label}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
      {!isLast && <View style={styles.divider} />}
    </>
  );

  const signOut = async () => {
    try {
      setLoading(true);
      await api.post("/auth/signout");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Đã xảy ra lỗi. Hãy thử lại.");
    } finally {
      clearUser();
      await AsyncStorage.removeItem("USER_STATE");
      setLoading(false);
    }
  };

  const onDismissSnackBar = () => setError(null);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* --- ĐÃ SỬA: Nút Home có thể bấm được --- */}
        <TouchableOpacity style={styles.backButton} onPress={navigateToHome}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#0077B6"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.headerTitle}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Card - Điểm chạm để sang Profile */}
        <TouchableOpacity style={styles.userCard} onPress={navigateToProfile}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=5" }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Adina Nurrahma</Text>
            <Text style={styles.userBio}>
              Trust your feelings, be a good human being.
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Ionicons
            name="settings-outline"
            size={24}
            color="#333"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.sectionTitle}>Cài đặt chung</Text>
        </View>

        {/* Group 1: Tài khoản */}
        <View style={styles.groupContainer}>
          <SettingItem
            icon="chatbox-ellipses-outline"
            label="Tin nhắn chờ"
            onPress={() => handlePressPlaceholder("Tin nhắn chờ")}
          />
          <SettingItem
            icon="people-outline"
            label="Phân loại bạn bè"
            isLast={true}
            onPress={() => handlePressPlaceholder("Phân loại")}
          />
        </View>

        {/* Group 2: Hệ thống */}
        <View style={styles.groupContainer}>
          <SettingItem
            icon="create-outline"
            label="Chỉnh sửa thông tin"
            onPress={navigateToProfile}
          />

          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={22} color="#333" />
              <Text style={styles.label}>Thông báo</Text>
            </View>
            <Switch
              value={isNotificationEnabled}
              onValueChange={setIsNotificationEnabled}
              trackColor={{ false: "#767577", true: "#00B4D8" }}
              thumbColor={isNotificationEnabled ? "#fff" : "#f4f3f4"}
            />
          </View>
          <View style={styles.divider} />

          <SettingItem
            icon="language-outline"
            label="Ngôn ngữ"
            isLast={true}
            onPress={() => handlePressPlaceholder("Ngôn ngữ")}
          />
        </View>

        {/* Group 3: Bảo mật & Giao diện */}
        <View style={styles.groupContainer}>
          <SettingItem
            icon="shield-checkmark-outline"
            label="Bảo mật"
            onPress={() => handlePressPlaceholder("Bảo mật")}
          />
          <SettingItem
            icon="color-palette-outline"
            label="Giao diện (Theme)"
            isLast={true}
            onPress={() => handlePressPlaceholder("Theme")}
          />
        </View>

        {/* Group 4: Hỗ trợ */}
        <View style={styles.groupContainer}>
          <SettingItem
            icon="help-circle-outline"
            label="Trợ giúp & Hỗ trợ"
            onPress={() => handlePressPlaceholder("Trợ giúp")}
          />
          <SettingItem
            icon="chatbubble-outline"
            label="Liên hệ với chúng tôi"
            onPress={() => handlePressPlaceholder("Liên hệ")}
          />
          <SettingItem
            icon="lock-closed-outline"
            label="Chính sách quyền riêng tư"
            isLast={true}
            onPress={() => handlePressPlaceholder("Chính sách")}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={signOut}
          disabled={loading}
        >
          {loading ? (
            <LoadingInit width={"100%"} />
          ) : (
            <Text style={styles.logoutText}>Đăng xuất</Text>
          )}
        </TouchableOpacity>
        <Snackbar
          visible={!!error}
          onDismiss={onDismissSnackBar}
          duration={3000}
          style={[styles.snackbar, { backgroundColor: "#FF4444" }]}
        >
          <Text>{error}</Text>
        </Snackbar>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    marginBottom: 20,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#F2F4F8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  // --- MỚI: Style cho nút Home ---
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0077B6",
  },
  searchBtn: {
    padding: 5,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#00B4D8",
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0077B6",
  },
  userBio: {
    fontSize: 13,
    color: "#6c757d",
    marginTop: 4,
  },
  arrowContainer: {
    backgroundColor: "#00B4D8",
    padding: 5,
    borderRadius: 15,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
    paddingLeft: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  groupContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginLeft: 15,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 37,
  },

  logoutButton: {
    marginTop: 10,
    backgroundColor: "#FFE5E5",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "#FF4757",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SettingScreen;
