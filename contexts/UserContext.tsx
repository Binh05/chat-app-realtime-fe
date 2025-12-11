import React from "react";
import { createContext } from "use-context-selector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userReducer, initialUserState } from "../reducers/userReducer";

export const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(userReducer, initialUserState);

  React.useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("USER_STATE");
      if (saved) {
        dispatch({ type: "__HYDRATE__", payload: JSON.parse(saved) });
      }
    })();
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem("USER_STATE", JSON.stringify(state));
  }, [state]);

  const setUser = (data: any) => dispatch({ type: "SET_USER", payload: data });

  const clearUser = () => dispatch({ type: "CLEAR_USER" });

  return (
    <UserContext.Provider
      value={{
        state,
        setUser,
        clearUser,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
