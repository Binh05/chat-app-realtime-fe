import { io, type Socket } from "socket.io-client";
import React, { useCallback, useEffect } from "react";
import { createContext } from "use-context-selector";
import { initialSocketState, socketReducer } from "../reducers/socketReducer";
import { useContextSelector } from "use-context-selector";
import { UserContext } from "./UserContext";

const baseURL = "http://192.168.1.5:5000"; // Update with your backend URL

export const SocketContext = createContext<any>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(socketReducer, initialSocketState);
  const { state: userState } = useContextSelector(UserContext, (v) => v);

  // Connect socket when user has token
  const connectSocket = useCallback(
    (token: string) => {
      // Avoid duplicate connections
      if (state.socket?.connected) {
        console.log("Socket already connected");
        return;
      }

      if (!token) {
        console.warn("No token provided for socket connection");
        return;
      }

      const newSocket = io(baseURL, {
        auth: { token },
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      // Connection events
      newSocket.on("connect", () => {
        console.log("Connected to socket server");
        dispatch({ type: "SET_CONNECTION_STATUS", payload: "connected" });
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from socket server");
        dispatch({ type: "SET_CONNECTION_STATUS", payload: "disconnected" });
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        dispatch({ type: "SET_CONNECTION_STATUS", payload: "error" });
      });

      // Online users list
      newSocket.on("online-users", (userIds: string[]) => {
        dispatch({ type: "SET_ONLINE_USERS", payload: userIds });
      });

      // New message - xử lý ở ChatContext
      // Socket chỉ forward payload đến ChatContext qua listener ở ChatProvider

      // User typing
      newSocket.on("user-typing", (data) => {
        dispatch({ type: "USER_TYPING", payload: data });
      });

      // User stopped typing
      newSocket.on("user-stopped-typing", (data) => {
        dispatch({ type: "USER_STOPPED_TYPING", payload: data });
      });

      // Friend status changed (unfriend, accept friend request, etc)
      newSocket.on("friend-status-changed", (data) => {
        dispatch({ type: "FRIEND_STATUS_CHANGED", payload: data });
      });

      // New friend accepted
      newSocket.on("friend-accepted", (data) => {
        dispatch({ type: "FRIEND_ACCEPTED", payload: data });
      });

      // Friend removed
      newSocket.on("friend-removed", (data) => {
        console.log("Friend removed:", data);
        dispatch({ type: "FRIEND_REMOVED", payload: data });
      });

      dispatch({ type: "SET_SOCKET", payload: newSocket });
    },
    [state.socket]
  );

  // Disconnect socket
  const disconnectSocket = useCallback(() => {
    if (state.socket) {
      state.socket.disconnect();
      dispatch({ type: "CLEAR_SOCKET" });
      console.log("Socket disconnected");
    }
  }, [state.socket]);

  // Join conversation room
  const joinConversation = useCallback(
    (conversationId: string) => {
      if (state.socket?.connected) {
        state.socket.emit("join-conversation", conversationId);
      }
    },
    [state.socket]
  );

  // Leave conversation room
  const leaveConversation = useCallback(
    (conversationId: string) => {
      if (state.socket?.connected) {
        state.socket.emit("leave-conversation", conversationId);
      }
    },
    [state.socket]
  );

  // Emit typing status
  const emitTyping = useCallback(
    (conversationId: string) => {
      if (state.socket?.connected) {
        state.socket.emit("typing", { conversationId });
      }
    },
    [state.socket]
  );

  // Emit stop typing
  const emitStopTyping = useCallback(
    (conversationId: string) => {
      if (state.socket?.connected) {
        state.socket.emit("stop-typing", { conversationId });
      }
    },
    [state.socket]
  );

  const value = {
    state,
    dispatch,
    connectSocket,
    disconnectSocket,
    joinConversation,
    leaveConversation,
    emitTyping,
    emitStopTyping,
    isConnected: state.socket?.connected ?? false,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
