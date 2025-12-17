import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  },
);