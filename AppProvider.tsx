import React from "react";
import { UserProvider } from "./contexts/UserContext";
import { FriendProvider } from "./contexts/FriendContext";

function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <FriendProvider>{children}</FriendProvider>
    </UserProvider>
  );
}

export default AppProvider;
