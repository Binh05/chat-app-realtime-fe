import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Provider as PaperProvider } from "react-native-paper";

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
import ProfileScreen from "./screens/profile";
import AppProvider from "./AppProvider";
import { useContextSelector } from "use-context-selector";
import { UserContext } from "./contexts/UserContext";
import SettingScreen from "./screens/setting";
import { CreatePostProfile } from "./screens/createPostProfile";
import EditProfile from "./screens/editProfile"
const Stack = createStackNavigator();

function AppContent() {
  const user = useContextSelector(UserContext, (v) => v.state);
  return (
    <PaperProvider>
      {/* <<< THÊM DÒNG NÀY */}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {user?.token ? (
            <>
              <Stack.Screen name="Message" component={MessageScreen} />
              <Stack.Screen name="Detail" component={DetailChat} />
              <Stack.Screen name="ChatDesc" component={ChatDesc} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Contacts" component={ContactScreen} />
              <Stack.Screen name="PhoneUI" component={PhoneUIScreen} />
              <Stack.Screen name="GroupChat" component={GroupChatPage} />
              <Stack.Screen name="GroupInfo" component={GroupInfoPage} />
              <Stack.Screen name="Setting" component={SettingScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="EditProfile" component={EditProfile} />
              <Stack.Screen
                name="CreatePostProfile"
                component={CreatePostProfile}
                options={{ presentation: "modal" }}
              />
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
