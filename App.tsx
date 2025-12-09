import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAppSelector } from "./hooks/hook";
// Import Provider của react-native-paper
import { Provider as PaperProvider } from "react-native-paper";

// Screens
import LoginScreen from "./screens/auth/login";
import RegisterScreen from "./screens/auth/register";
import HomeScreen from "./screens/home";
import MessageScreen from "./screens/messagePage";
import DetailChat from "./screens/chatUI";
import ChatDesc from "./screens/chatDesc";
import ContactScreen from "./screens/contactUI";
import PhoneUIScreen from "./screens/phoneUI";
import GroupChatPage from "./screens/groupChatUI";
import GroupInfoPage from "./screens/groupChatInfo";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ProfileScreen from "./screens/profile";
const Stack = createStackNavigator();

function AppContent() {
  const user = useAppSelector((state) => state.user);
  return (
    <PaperProvider>
      {/* <<< THÊM DÒNG NÀY */}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Message"
          screenOptions={{ headerShown: false }}
        >
          {!user?.token ? (
            <>
              <Stack.Screen name="Message" component={MessageScreen} />
              <Stack.Screen name="Detail" component={DetailChat} />
              <Stack.Screen name="ChatDesc" component={ChatDesc} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Contacts" component={ContactScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="PhoneUI" component={PhoneUIScreen} />
              <Stack.Screen name="GroupChat" component={GroupChatPage} />
              <Stack.Screen name="GroupInfo" component={GroupInfoPage} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
