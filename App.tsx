import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Provider của react-native-paper
import { Provider as PaperProvider } from 'react-native-paper';

// Screens
import LoginScreen from './screens/login'; 
import RegisterScreen from './screens/register';
import HomeScreen from './screens/home';
import MessageScreen from './screens/messagePage';
import DetailChat from './screens/chatUI';
import ChatDesc from './screens/chatDesc';
import ContactScreen from './screens/contactUI';
import PhoneUIScreen from './screens/phoneUI';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>   {/* <<< THÊM DÒNG NÀY */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Message" component={MessageScreen} />
          <Stack.Screen name="Detail" component={DetailChat} />
          <Stack.Screen name="ChatDesc" component={ChatDesc} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Contacts" component={ContactScreen} />
          <Stack.Screen name="PhoneUI" component={PhoneUIScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
