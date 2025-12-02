import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import đúng component LoginScreen
//import LoginScreen from '../screens/LoginScreen';  // Đường dẫn ĐÚNG
// Hoặc nếu file login.tsx của bạn ở thư mục screens
import LoginScreen from '../screens/login';  // Tên file là login.tsx

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}  // Đảm bảo đây là component, không phải string
          options={{ headerShown: false }}  // Có thể ẩn header
        />
        {/* Các screen khác */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}