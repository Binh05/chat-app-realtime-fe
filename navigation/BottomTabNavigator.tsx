import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet } from "react-native";

import LoginScreen from "../screens/auth/login";
import RegisterScreen from "../screens/auth/register";
import HomeScreen from "../screens/home";
import MessageScreen from "../screens/messagePage";
import ContactsScreen from "../screens/chatUI";
import ProfileScreen from "../screens/chatDesc";
import TaskBar from "../components/TaskBar";
import MessagePage from "../screens/messagePage";
import MessageDetailPage from "../screens/chatUI";
import SettingScreen from "../screens/setting";

const Stack = createNativeStackNavigator();

function MainTabs() {
  const [currentTab, setCurrentTab] = useState("home");

  const renderScreen = () => {
    switch (currentTab) {
      case "home":
        return <HomeScreen />;
      case "messages":
        return <MessageDetailPage />;
      case "contacts":
        return <ContactsScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      <TaskBar current={currentTab} onChange={setCurrentTab} />
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
