/*import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

function TempLoginScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Screen - Placeholder</Text>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={TempLoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 1. Import KHÔNG có ngoặc nhọn
import LoginScreen from './screens/login'; 
import RegisterScreen from './screens/register';
import MessageScreen from './screens/messagePage';
import DetailChat from './screens/chatUI';
import ChatDesc from './screens/chatDesc';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        
        {/* 2. Kiểm tra kỹ biến component={LoginScreen} phải có màu (đã được import) */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={MessageScreen} />
        <Stack.Screen name="Detail" component={DetailChat} />
        <Stack.Screen name="ChatDesc" component={ChatDesc} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}