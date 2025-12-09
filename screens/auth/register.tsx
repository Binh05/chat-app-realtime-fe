import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../utils/api";
import * as Haptics from "expo-haptics";
import Loading from "../../components/ui/loading";

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!username || !phone || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setError(null);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      setLoading(true);

      const res = await api.post("/auth/signup", {
        username,
        phone,
        password,
      });

      if (res.status === 200) {
        setLoading(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        navigation.navigate("Login");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Đã xảy ra lỗi. Hãy thử lại.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const onDismissSnackBar = () => setError(null);

  return (
    <SafeAreaView style={styles.container}>
      {loading && <Loading />}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- HEADER --- */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Create an account so you can explore all the existing jobs
            </Text>
          </View>

          {/* --- FORM --- */}
          <View style={styles.formContainer}>
            {/* Input username */}
            <TextInput
              style={[
                styles.input,
                focusedInput === "username" && styles.inputFocused,
              ]}
              placeholder="Username"
              placeholderTextColor="#626262"
              keyboardType="default"
              value={username}
              onChangeText={setUsername}
              onFocus={() => setFocusedInput("username")}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Input SĐT */}
            <TextInput
              style={[
                styles.input,
                focusedInput === "phone" && styles.inputFocused,
              ]}
              placeholder="SĐT"
              placeholderTextColor="#626262"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocusedInput("phone")}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Input Password */}
            <TextInput
              style={[
                styles.input,
                focusedInput === "password" && styles.inputFocused,
              ]}
              placeholder="Password"
              placeholderTextColor="#626262"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Input Confirm Password */}
            <TextInput
              style={[
                styles.input,
                focusedInput === "confirm" && styles.inputFocused,
              ]}
              placeholder="Confirm Password"
              placeholderTextColor="#626262"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusedInput("confirm")}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Sign up Button */}
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleRegister}
            >
              <Text style={styles.signupButtonText}>Sign up</Text>
            </TouchableOpacity>

            {/* Link quay lại Login */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login")}
              disabled={loading}
            >
              <Text style={styles.loginLinkText}>Already have an account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Snackbar
          visible={!!error}
          onDismiss={onDismissSnackBar}
          duration={3000}
          style={[styles.snackbar, { backgroundColor: "#FF4444" }]}
        >
          <Text>{error}</Text>
        </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  snackbar: {},
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },

  // Header Styles
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1F41BB", // Màu xanh chủ đạo
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    paddingHorizontal: 20, // Để text không bị tràn lề
    lineHeight: 20,
  },

  // Form Styles
  formContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "#F1F4FF", // Màu nền xanh nhạt
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: "#1F41BB", // Viền xanh khi focus
    backgroundColor: "#fff",
    shadowColor: "#1F41BB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  // Signup Button
  signupButton: {
    backgroundColor: "#1F41BB",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10, // Cách xa input cuối cùng một chút
    shadowColor: "#1F41BB",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  // Login Link
  loginLink: {
    marginTop: 30,
    alignItems: "center",
  },
  loginLinkText: {
    color: "#494949",
    fontSize: 14,
    fontWeight: "600",
  },
});
