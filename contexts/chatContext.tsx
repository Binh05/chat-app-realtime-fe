import React, { ReactNode, useEffect, useCallback } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { usePersistedReducer } from "../utils/createPersistedReducer";
import { UserContext } from "./UserContext";
import { SocketContext } from "./socketContext";
import {
  chatReducer,
  ChatState,
  ChatAction,
  Conversation,
  Message,
} from "../reducers/chatReducer";

// 2. Initial State chuẩn
const initialState: ChatState = {
  conversations: [],
  messages: {},
  currentRoomId: null,
  isLoaded: false,
};

// 4. Context & Provider
export const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}>({
  state: initialState,
  dispatch: () => null,
});
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = usePersistedReducer(
    "CHAT_STATE",
    chatReducer,
    initialState
  );

  const { state: userState } = useContextSelector(UserContext, (v) => v);
  const { state: socketState } = useContextSelector(SocketContext, (v) => v);

  // Listen for new messages from socket
  useEffect(() => {
    if (!socketState?.socket) return;

    socketState.socket.on("new-message", (payload: any) => {
      const { message, conversation, unreadCounts } = payload;

      // Thêm message vào store
      if (message) {
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            id: message._id,
            roomId: message.conversationId,
            senderId: message.senderId,
            text: message.content,
            createdAt: message.createdAt,
            ...message,
          },
        });
      }

      // Cập nhật conversation
      if (conversation) {
        dispatch({
          type: "UPDATE_CONVERSATION",
          payload: conversation,
        });
      }

      // Cập nhật unread count
      if (unreadCounts && message?.conversationId) {
        dispatch({
          type: "UPDATE_UNREAD_COUNT",
          payload: {
            conversationId: message.conversationId,
            unreadCounts: unreadCounts,
          },
        });
      }
    });

    return () => {
      socketState.socket.off("new-message");
    };
  }, [socketState?.socket]);

  const value = { state, dispatch };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
