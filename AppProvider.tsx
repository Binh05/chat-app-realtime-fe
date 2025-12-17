import React from "react";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from "./contexts/chatContext";
import { FriendProvider } from "./contexts/FriendContext";
import { SocketProvider } from "./contexts/socketContext";

function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SocketProvider>
        <FriendProvider>
          <ChatProvider>{children}</ChatProvider>
        </FriendProvider>
      </SocketProvider>
    </UserProvider>
  );
}

export default AppProvider;
