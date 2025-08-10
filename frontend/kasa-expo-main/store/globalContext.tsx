import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SOCKET_SERVER_URL = "http://10.0.0.9:8080";
// Platform.OS === "android" ? "http://10.0.0.9:8080" : "http://localhost:8080";

interface Bottle {
  id: string;
  name: string;
  // שדות נוספים אם יש
}

interface Machine {
  id: string;
  location: string;
  // שדות נוספים אם יש
}

/** מבנה בקבוק בתוך סשן (צד שרת מחזיר אובייקט של בקבוקים לפי id) */
interface SessionBottle {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

/** bottles הוא Record של id -> SessionBottle */
type SessionBottles = Record<string, SessionBottle>;

/** מבנה סשן כפי שנשמר ב-RTDB/מוחזר מה-API */
interface Session {
  sessionId: string;
  machineId: string;
  userId: string;
  balance: number;          // מספר מעוגל לשתי ספרות
  totalQuantity: number;
  bottles: SessionBottles;  // אובייקט ולא מערך
  status: "active" | "closed";
  // סגורים:
  createdAt?: number;       // ms epoch (persisted)
  endedAt?: number;         // ms epoch (persisted)
  // פעילים (כשנקרא /api/sessions/:id על סשן פתוח):
  createdAtMs?: number;
  createdAtISO?: string | null;
}

interface UserInfo {
  uid: string;
  email: string | null;
  name: string | null;
  phoneNumber: string | null;
  balance: string | null; // אם תרצה מספר, שנה ל-number | null
}

interface UserMonthlySummary {
  userId: string;
  year: number;
  month: number;                 // 1..12
  sessionsCount: number;
  totalBottles: number;
  totalBalance: number;          // סכום חודשי מעוגל
  byBottle: Record<
    string,
    { id: string; name: string; price: number; quantity: number; totalAmount: number }
  >;
  range: { fromMs: number; toMs: number };
}

interface GlobalContextType {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo | null) => void;
  isConnected: boolean;
  setIsConnected: (val: boolean) => void;
  bottles: Bottle[];
  machines: Machine[];
  userSessions: Session[];
  setUserSessions: (sessions: Session[]) => void;
  userMonthlySummary: UserMonthlySummary | null;
  setUserMonthlySummary: (s: UserMonthlySummary | null) => void;
}

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [userSessions, setUserSessions] = useState<Session[]>([]);
  const [userMonthlySummary, setUserMonthlySummary] = useState<UserMonthlySummary | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token || !userInfo?.uid) return;

        const now = new Date();
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth() + 1; // 1..12

        const [bottlesRes, machinesRes, userSessionsRes, summaryRes] = await Promise.all([
          axios.get(`${SOCKET_SERVER_URL}/api/bottles`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${SOCKET_SERVER_URL}/api/machines`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<Session[]>(
            `${SOCKET_SERVER_URL}/api/sessions/user/${userInfo.uid}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get<UserMonthlySummary>(
            `${SOCKET_SERVER_URL}/api/sessions/user/${userInfo.uid}/summary`,
            { headers: { Authorization: `Bearer ${token}` }, params: { year, month } }
          ),
        ]);

        setBottles(bottlesRes.data);
        setMachines(machinesRes.data);
        setUserSessions(userSessionsRes.data); // ✅ שם משתנה אחר\
        setUserMonthlySummary(summaryRes.data);
        console.log(bottlesRes.data);
        console.log(machinesRes.data);
        console.log(userSessionsRes.data);
        console.log(summaryRes.data);
      } catch (error) {
        console.error("❌ Failed to fetch app data:", error);
      }
    };

    if (isConnected) {
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
        userSessions,
        setUserSessions,
        userMonthlySummary,          
        setUserMonthlySummary,       
      }}
    >
      {children}
    </GlobalContext.Provider>

  );
};

export const useGlobalContext = () => useContext(GlobalContext);
