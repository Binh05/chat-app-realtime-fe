export type Feed = {
  _id: string;
  createdBy: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  title: string;
  content?: string;
  likeCounts: number;
  likeBy: Array<{
    _id: string;
    username: string;
    avatarUrl?: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type FeedState = {
  feeds: Feed[];
  isLoaded: boolean;
  currentFeed: Feed | null;
  total: number;
  page: number;
  limit: number;
  userId?: string;
};

const initialState: FeedState = {
  feeds: [],
  isLoaded: false,
  currentFeed: null,
  total: 0,
  page: 1,
  limit: 10,
};

export type FeedAction =
  | { type: "__HYDRATE__"; payload: any }
  | {
      type: "SET_FEEDS";
      payload: {
        feeds: Feed[];
        total: number;
        page: number;
        limit: number;
        userId?: string;
      };
    }
  | { type: "ADD_FEED"; payload: Feed }
  | { type: "UPDATE_FEED"; payload: Feed }
  | { type: "DELETE_FEED"; payload: string }
  | { type: "TOGGLE_LIKE_FEED"; payload: Feed }
  | { type: "SET_CURRENT_FEED"; payload: Feed | null }
  | { type: "APPEND_FEEDS"; payload: Feed[] };

export const feedReducer = (
  state: FeedState = initialState,
  action: FeedAction | any
): FeedState => {
  if (action.type === "__HYDRATE__") {
    return {
      ...action.payload,
      isLoaded: false,
    };
  }

  switch (action.type) {
    case "SET_FEEDS":
      const { feeds, page, total, limit } = action.payload;
      return {
        ...state,
        feeds: page === 1 ? feeds : [...state.feeds, ...feeds],
        total,
        page,
        limit,
        isLoaded: true,
      };

    case "ADD_FEED":
      return {
        ...state,
        feeds: [action.payload, ...state.feeds],
        total: state.total + 1,
      };

    case "UPDATE_FEED":
      return {
        ...state,
        feeds: state.feeds.map((f) =>
          f._id === action.payload._id ? action.payload : f
        ),
        currentFeed:
          state.currentFeed?._id === action.payload._id
            ? action.payload
            : state.currentFeed,
      };

    case "DELETE_FEED":
      return {
        ...state,
        feeds: state.feeds.filter((f) => f._id !== action.payload),
        total: state.total - 1,
        currentFeed:
          state.currentFeed?._id === action.payload ? null : state.currentFeed,
      };

    case "TOGGLE_LIKE_FEED":
      return {
        ...state,
        feeds: state.feeds.map((f) =>
          f._id === action.payload._id ? action.payload : f
        ),
        currentFeed:
          state.currentFeed?._id === action.payload._id
            ? action.payload
            : state.currentFeed,
      };

    case "SET_CURRENT_FEED":
      return {
        ...state,
        currentFeed: action.payload,
      };

    case "APPEND_FEEDS":
      return {
        ...state,
        feeds: [...state.feeds, ...action.payload],
      };

    default:
      return state;
  }
};
