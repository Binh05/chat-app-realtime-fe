import React from "react";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from "./contexts/chatContext";
import { FriendProvider } from "./contexts/FriendContext";
import { SocketProvider } from "./contexts/socketContext";
import { FeedProvider } from "./contexts/feedContext";

function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SocketProvider>
        <FriendProvider>
          <FeedProvider>
            <ChatProvider>{children}</ChatProvider>
          </FeedProvider>
        </FriendProvider>
      </SocketProvider>
    </UserProvider>
  );
}

export default AppProvider;
