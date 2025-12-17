
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.100.7:5000/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  },
);

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
