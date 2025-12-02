import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State quản lý focus để đổi màu viền
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleRegister = () => {
    // 1. Kiểm tra dữ liệu
    if (!email || !phone || !password || !confirmPassword) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu nhập lại không khớp');
      return;
    }

    // 2. Xử lý đăng ký thành công (Giả lập)
    console.log('Register:', email, phone, password);
    
    Alert.alert('Thành công', 'Tạo tài khoản thành công!', [
      { 
        text: 'Đăng nhập ngay', 
        onPress: () => navigation.navigate('Login') 
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* --- HEADER --- */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Create an account so you can explore all the existing jobs
            </Text>
          </View>

          {/* --- FORM --- */}
          <View style={styles.formContainer}>
            
            {/* Input Email */}
            <TextInput
              style={[
                styles.input, 
                focusedInput === 'email' && styles.inputFocused
              ]}
              placeholder="Email"
              placeholderTextColor="#626262"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Input SĐT */}
            <TextInput
              style={[
                styles.input, 
                focusedInput === 'phone' && styles.inputFocused
              ]}
              placeholder="SĐT"
              placeholderTextColor="#626262"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocusedInput('phone')}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Input Password */}
            <TextInput
              style={[
                styles.input, 
                focusedInput === 'password' && styles.inputFocused
              ]}
              placeholder="Password"
              placeholderTextColor="#626262"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Input Confirm Password */}
            <TextInput
              style={[
                styles.input, 
                focusedInput === 'confirm' && styles.inputFocused
              ]}
              placeholder="Confirm Password"
              placeholderTextColor="#626262"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusedInput('confirm')}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Sign up Button */}
            <TouchableOpacity style={styles.signupButton} onPress={handleRegister}>
              <Text style={styles.signupButtonText}>Sign up</Text>
            </TouchableOpacity>

            {/* Link quay lại Login */}
            <TouchableOpacity 
              style={styles.loginLink} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>Already have an account</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  
  // Header Styles
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1F41BB', // Màu xanh chủ đạo
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 20, // Để text không bị tràn lề
    lineHeight: 20,
  },

  // Form Styles
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#F1F4FF', // Màu nền xanh nhạt
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#1F41BB', // Viền xanh khi focus
    backgroundColor: '#fff',
    shadowColor: '#1F41BB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  // Signup Button
  signupButton: {
    backgroundColor: '#1F41BB',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10, // Cách xa input cuối cùng một chút
    shadowColor: '#1F41BB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Login Link
  loginLink: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#494949',
    fontSize: 14,
    fontWeight: '600',
  },
});