import React, { ReactNode, useEffect } from "react";
import { createContext } from "use-context-selector";
import { usePersistedReducer } from "../utils/createPersistedReducer";
import {
  feedReducer,
  FeedState,
  FeedAction,
  Feed,
} from "../reducers/feedReducer";
import { useContextSelector } from "use-context-selector";
import { UserContext } from "./UserContext";

// Initial State
const initialState: FeedState = {
  feeds: [],
  isLoaded: false,
  currentFeed: null,
  total: 0,
  page: 1,
  limit: 10,
};

// Context
export const FeedContext = createContext<{
  state: FeedState;
  dispatch: React.Dispatch<FeedAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider
export const FeedProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = usePersistedReducer(
    "FEED_STATE",
    feedReducer,
    initialState
  );
  const userState = useContextSelector(UserContext, (ctx) => ctx.state);

  useEffect(() => {
    if (userState?.user?._id && state.userId !== userState.user._id) {
      dispatch({
        type: "SET_FEEDS",
        payload: {
          feeds: [],
          total: 0,
          page: 1,
          limit: 10,
          userId: userState.user._id,
        } as any,
      });
    }
  }, [userState?.user?._id]);

  const value = {
    state: {
      ...state,
      userId: userState?.user?._id || state.userId,
    },
    dispatch,
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
};
