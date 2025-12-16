export interface Friend {
  _id: string;
  username: string;
  avatarUrl: string;
  phone: string;
}

export interface received {
  _id: string;
  from: Friend;
  to: string;
}

export interface Send {
  _id: string;
  from: string;
  to: Friend;
}

interface FriendState {
  friends: Friend[];
  notFriends: Friend[];
  sends: Send[];
  receiveds: received[];
}

export const initialFriendState: FriendState = {
  friends: [],
  notFriends: [],
  sends: [],
  receiveds: [],
};

export function friendReducer(state: FriendState, action: any): FriendState {
  switch (action.type) {
    case "SET_FRIENDS":
      return { ...state, friends: action.payload };

    case "SET_NOTFRIENDS":
      return { ...state, notFriends: action.payload };

    case "SET_SENDS":
      return { ...state, sends: action.payload };

    case "ADD_FRIEND":
      return {
        ...state,
        friends: [...state.friends, action.payload],
        sends: state.sends.filter((f) => f._id !== action.payload.id),
      };
    case "SET_RECEIVEDS":
      return {
        ...state,
        receiveds: action.payload,
      };
    case "REMOVE_FRIEND":
      return {
        ...state,
        friends: state.friends.filter((f) => f._id !== action.payload),
      };
    case "ADD_SEND":
      return { ...state, sends: [...state.sends, action.payload] };

    case "REMOVE_SEND":
      return {
        ...state,
        sends: state.sends.filter((s) => s._id !== action.payload),
      };

    case "ADD_NOTFRIEND":
      return {
        ...state,
        notFriends: [...state.notFriends, action.payload],
      };

    case "REMOVE_NOTFRIEND":
      return {
        ...state,
        notFriends: state.notFriends.filter((u) => u._id !== action.payload),
      };

    case "CLEAR":
      return initialFriendState;

    default:
      return state;
  }
}
