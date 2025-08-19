// services/apiService.ts
import axios from "axios";
import { Platform } from "react-native";

const SOCKET_SERVER_URL ="http://10.0.0.9:8080"
  // Platform.OS === "android"
  //   ? "http://10.0.0.9:8080"
  //   : "http://localhost:8080";

export const fetchBottles = async () => {
  const response = await axios.get(`${SOCKET_SERVER_URL}/api/bottles`);
  return response.data;
};

export const fetchMachines = async () => {
  const response = await axios.get(`${SOCKET_SERVER_URL}/api/machines`);
  return response.data;
};


export async function updateUser(userId: string, data: { name?: string; email?: string; phoneNumber?: string }) {
  // const token = await getToken();
  console.log(userId);
  const res = await axios.put(`${SOCKET_SERVER_URL}/api/users/updateUser/${userId}`, data);
  return res.data;
}