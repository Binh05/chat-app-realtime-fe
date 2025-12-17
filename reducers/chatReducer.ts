export type Conversation = {
  _id: string;
  type: "direct" | "group";
  participants: any[];
  lastMessage?: any;
  unreadCounts?: Record<string, number>;
  [key: string]: any;
};

export type Message = {
  id: string;
  roomId: string;
  senderId: string;
  text: string;
  createdAt: string;
  [key: string]: any;
};

export type ChatState = {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  currentRoomId: string | null;
  isLoaded: boolean;
};

const initialState: ChatState = {
  conversations: [],
  messages: {},
  currentRoomId: null,
  isLoaded: false,
};

export type ChatAction =
  | { type: "__HYDRATE__"; payload: any }
  | { type: "SET_CONVERSATIONS"; payload: Conversation[] }
  | { type: "UPDATE_CONVERSATION"; payload: Conversation }
  | {
      type: "UPDATE_UNREAD_COUNT";
      payload: { conversationId: string; unreadCounts: Record<string, number> };
    }
  | { type: "SET_CURRENT_ROOM"; payload: string }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_MESSAGES"; payload: { roomId: string; messages: Message[] } };

export const chatReducer = (
  state: ChatState = initialState,
  action: ChatAction | any
): ChatState => {
  if (action.type === "__HYDRATE__") {
    return {
      ...action.payload,
      conversations: action.payload.conversations || [],
      isLoaded: false,
    };
  }

  switch (action.type) {
    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.payload, isLoaded: true };

    case "UPDATE_CONVERSATION":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c._id === action.payload._id ? { ...c, ...action.payload } : c
        ),
      };

    case "UPDATE_UNREAD_COUNT":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c._id === action.payload.conversationId
            ? { ...c, unreadCounts: action.payload.unreadCounts }
            : c
        ),
      };

    case "SET_CURRENT_ROOM":
      return { ...state, currentRoomId: action.payload };

    case "SET_MESSAGES":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: action.payload.messages,
        },
      };

    case "ADD_MESSAGE":
      const roomId = action.payload.roomId;
      const roomMessages = state.messages[roomId] || [];

      // Tránh duplicate messages
      if (roomMessages.some((m) => m.id === action.payload.id)) {
        return state;
      }

      return {
        ...state,
        messages: {
          ...state.messages,
          [roomId]: [...roomMessages, action.payload],
        },
      };

    default:
      return state;
  }
};
