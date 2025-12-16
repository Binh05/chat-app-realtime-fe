import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.1.5:5000/v1",
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const userState = await AsyncStorage.getItem("USER_STATE");

  if (userState) {
    const { token } = JSON.parse(userState);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
