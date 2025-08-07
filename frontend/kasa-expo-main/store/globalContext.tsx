import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SOCKET_SERVER_URL ="http://10.0.0.9:8080"
//   Platform.OS === "android" ? "http://10.0.0.9:8080" : "http://localhost:8080";

interface Bottle {
  id: string;
  name: string;
  // כל שדה נוסף
}

interface Machine {
  id: string;
  location: string;
  // כל שדה נוסף
}

interface UserInfo {
  uid: string;
  email: string | null;
  name: string | null;
  phoneNumber: string | null;
  balance: string | null;
}

interface GlobalContextType {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo | null) => void;
  isConnected: boolean;
  setIsConnected: (val: boolean) => void;
  bottles: Bottle[];
  machines: Machine[];
}

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const [bottlesRes, machinesRes] = await Promise.all([
          axios.get(`${SOCKET_SERVER_URL}/api/bottles`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${SOCKET_SERVER_URL}/api/machines`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log(bottlesRes.data);
        console.log(machinesRes.data);
        console.log(userInfo);
        setBottles(bottlesRes.data);
        setMachines(machinesRes.data);
      } catch (error) {
        console.error("❌ Failed to fetch bottles or machines:", error);
      }
    };

    if (userInfo && isConnected) {
      fetchData();
    }
  }, [userInfo, isConnected]);

  return (
    <GlobalContext.Provider
      value={{
        userInfo,
        setUserInfo,
        isConnected,
        setIsConnected,
        bottles,
        machines,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
