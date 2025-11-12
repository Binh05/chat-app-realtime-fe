import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="stream" options={{ title: "Stream" }} />
      <Tabs.Screen name="messages" options={{ title: "Messages" }} />
      <Tabs.Screen name="contact" options={{ title: "Contacts" }} />
      <Tabs.Screen name="profile" options={{ title: "Profiles" }} />
    </Tabs>
  );
}
