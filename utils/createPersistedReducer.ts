import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

export function usePersistedReducer(key: any, reducer: any, initialState: any) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // Load state khi app mở
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(key);
      if (saved) {
        dispatch({ type: "__HYDRATE__", payload: JSON.parse(saved) });
      }
    })();
  }, []);

  // Save state mỗi khi thay đổi
  useEffect(() => {
    AsyncStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  const customDispatch = (action: any) => {
    if (action.type === "__HYDRATE__") {
      return reducer(initialState, action);
    }
    return dispatch(action);
  };

  return [state, customDispatch];
}
