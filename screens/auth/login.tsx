import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "../../components/ui/loading";
import * as Haptics from "expo-haptics";
import { api } from "../../utils/api";
import { Snackbar } from "react-native-paper";
import { useContextSelector } from "use-context-selector";
import { UserContext } from "../../contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }: any) {
  const setUser = useContextSelector(UserContext, (v) => v.setUser);
  
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!phone || !password) {
      setError("Vui lòng nhập số điện thoại và mật khẩu");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setError(null);
    Keyboard.dismiss();

    try {
      setLoading(true);
      const res = await api.post("/auth/signin", {
        phone,
        password,
      });

      if (res.status === 200) {
        const { accessToken, _id, username, phone, avatarUrl } = res.data;

        setUser({ _id, username, phone, token: accessToken, avatarUrl });

        setLoading(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        navigation.replace("Home"); 
      }
    } catch (err: any) {
      console.error("Lỗi đăng nhập:", err);

      const serverMessage = err.response?.data?.message;
      setError(serverMessage || "Đăng nhập thất bại. Vui lòng thử lại.");
      
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
          keyboardShouldPersistTaps="handled"
        >
          {/* --- HEADER --- */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Login here</Text>
            <Text style={styles.subtitle}>
              Welcome back you’ve been missed!
            </Text>
          </View>

          {/* --- FORM --- */}
          <View style={styles.formContainer}>
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
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot your password?</Text>
            </TouchableOpacity>

            {/* Sign in Button */}
            <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin}
                disabled={loading}
            >
              <Text style={styles.loginButtonText}>Sign in</Text>
            </TouchableOpacity>

            {/* Link đăng ký */}
            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate("Register")}
              disabled={loading}
            >
              <Text style={styles.registerText}>Create new account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Snackbar
          visible={!!error}
          onDismiss={onDismissSnackBar}
          duration={3000}
          style={[styles.snackbar, { backgroundColor: "#FF4444" }]}
        >
          <Text style={{color: '#fff'}}>{error}</Text>
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
    position: "relative"
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
    color: "#1F41BB",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    maxWidth: "80%",
  },
  // Form Styles
  formContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "#F1F4FF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: "#1F41BB",
    backgroundColor: "#fff",
    shadowColor: "#1F41BB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  // Forgot Password
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotText: {
    color: "#1F41BB",
    fontSize: 14,
    fontWeight: "600",
  },
  // Login Button
  loginButton: {
    backgroundColor: "#1F41BB",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#1F41BB",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  // Register Link
  registerLink: {
    marginTop: 30,
    alignItems: "center",
  },
  registerText: {
    color: "#494949",
    fontSize: 14,
    fontWeight: "600",
  },
  /*snackbar: {
    marginBottom: 20,
    marginHorizontal: 16,
    borderRadius: 8,
  },*/
});