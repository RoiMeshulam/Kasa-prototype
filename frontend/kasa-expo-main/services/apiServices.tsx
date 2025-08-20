// services/apiService.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getServerUrl } from "@/utils/network";

const SOCKET_SERVER_URL = getServerUrl(8080); // Base URL לכל ה־API

const api = axios.create({
  baseURL: SOCKET_SERVER_URL,
  timeout: 10000,
});

// Interceptor לטוקן
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;