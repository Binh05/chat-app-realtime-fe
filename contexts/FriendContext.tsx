import { createContext } from "use-context-selector";
import React, { useReducer } from "react";
import {
  Friend,
  friendReducer,
  initialFriendState,
  received,
  Send,
} from "../reducers/friendReducer";

export const FriendContext = createContext<any>(null);

export const FriendProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(friendReducer, initialFriendState);

  const setFriends = (data: any[]) =>
    dispatch({ type: "SET_FRIENDS", payload: data });

  const setNotFriends = (data: any[]) =>
    dispatch({ type: "SET_NOTFRIENDS", payload: data });

  const setSends = (data: any[]) =>
    dispatch({ type: "SET_SENDS", payload: data });

  const addFriend = (friend: any) =>
    dispatch({ type: "ADD_FRIEND", payload: friend });

  const removeFriend = (id: number) =>
    dispatch({ type: "REMOVE_FRIEND", payload: id });

  const setReceiveds = (data: received[]) =>
    dispatch({ type: "SET_RECEIVEDS", payload: data });

  const addSend = (send: Send) => dispatch({ type: "ADD_SEND", payload: send });

  const removeSend = (id: string) =>
    dispatch({ type: "REMOVE_SEND", payload: id });

  const addNotFriend = (friend: Friend) =>
    dispatch({ type: "ADD_NOTFRIEND", payload: friend });

  const removeNotFriend = (id: string) =>
    dispatch({ type: "REMOVE_NOTFRIEND", payload: id });

  const clearFriends = () => dispatch({ type: "CLEAR" });

  return (
    <FriendContext.Provider
      value={{
        state,
        setFriends,
        setNotFriends,
        setSends,
        addFriend,
        removeFriend,
        clearFriends,
        dispatch,
        setReceiveds,
        addSend,
        removeSend,
        addNotFriend,
        removeNotFriend,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};
