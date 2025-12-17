import { type Socket } from "socket.io-client";

export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "connecting"
  | "error";

export interface TypingUser {
  userId: string;
  conversationId: string;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectionStatus: ConnectionStatus;
  typingUsers: TypingUser[];
  messageEvents: any[];
  friendStatusChanged?: any; // Trigger để refetch conversations
}

export type SocketAction =
  | { type: "SET_SOCKET"; payload: Socket }
  | { type: "CLEAR_SOCKET" }
  | { type: "SET_ONLINE_USERS"; payload: string[] }
  | { type: "SET_CONNECTION_STATUS"; payload: ConnectionStatus }
  | { type: "ADD_MESSAGE_EVENT"; payload: any }
  | { type: "USER_TYPING"; payload: TypingUser }
  | { type: "USER_STOPPED_TYPING"; payload: TypingUser }
  | { type: "FRIEND_STATUS_CHANGED"; payload: any }
  | { type: "FRIEND_ACCEPTED"; payload: any }
  | { type: "FRIEND_REMOVED"; payload: any }
  | { type: "CLEAR_MESSAGE_EVENTS" };

export const initialSocketState: SocketState = {
  socket: null,
  onlineUsers: [],
  connectionStatus: "disconnected",
  typingUsers: [],
  messageEvents: [],
};

export function socketReducer(
  state: SocketState = initialSocketState,
  action: SocketAction
): SocketState {
  switch (action.type) {
    case "SET_SOCKET":
      return { ...state, socket: action.payload };

    case "CLEAR_SOCKET":
      return initialSocketState;

    case "SET_ONLINE_USERS":
      return { ...state, onlineUsers: action.payload };

    case "SET_CONNECTION_STATUS":
      return { ...state, connectionStatus: action.payload };

    case "ADD_MESSAGE_EVENT":
      return {
        ...state,
        messageEvents: [...state.messageEvents, action.payload],
      };

    case "USER_TYPING":
      const { userId, conversationId } = action.payload;
      const alreadyTyping = state.typingUsers.some(
        (u) => u.userId === userId && u.conversationId === conversationId
      );
      if (!alreadyTyping) {
        return {
          ...state,
          typingUsers: [...state.typingUsers, action.payload],
        };
      }
      return state;

    case "USER_STOPPED_TYPING":
      return {
        ...state,
        typingUsers: state.typingUsers.filter(
          (u) =>
            !(
              u.userId === action.payload.userId &&
              u.conversationId === action.payload.conversationId
            )
        ),
      };

    case "CLEAR_MESSAGE_EVENTS":
      return { ...state, messageEvents: [] };

    case "FRIEND_STATUS_CHANGED":
      return { ...state, friendStatusChanged: action.payload };

    case "FRIEND_ACCEPTED":
      return { ...state, friendStatusChanged: action.payload };

    case "FRIEND_REMOVED":
      return { ...state, friendStatusChanged: action.payload };

    default:
      return state;
  }
}
