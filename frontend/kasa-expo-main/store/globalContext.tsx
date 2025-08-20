import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/apiServices";

interface SessionBottle { id: string; name: string; price: number; quantity: number; }
type SessionBottles = Record<string, SessionBottle>;

interface Session {
  sessionId: string;
  userId: string;
  machineId: string;
  status: "closed" | "open" | "pending";
  totalQuantity: number;
  balance: number;
  bottles: SessionBottles;
  createdAtISO: string;
  createdAtMs: number;
  endedAtISO?: string;
  endedAtMs?: number;
  machineName?: string;
}

interface UserInfo { uid: string; email: string | null; name: string | null; phoneNumber: string | null; balance: string | null; }

interface UserMonthlySummary {
  userId: string;
  year: number;
  month: number;
  sessionsCount: number;
  bottlesCount: number;
  totalBalance: number;
  fromMs: number;
  toMs: number;
  allTimeBottlesCount: number;
}

interface Bottle { id: string; name: string; }
interface Machine { id: string; name: string; location: string; }

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
  setRefreshSessions: React.Dispatch<React.SetStateAction<boolean>>;

}

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);

  const [userSessions, setUserSessions] = useState<Session[]>([]);
  const [userMonthlySummary, setUserMonthlySummary] = useState<UserMonthlySummary | null>(null);
  const [refreshSessions, setRefreshSessions] = useState(false);

  // ✅ Fetch קבוע – רק פעם אחת, לאחר כניסה או טעינת אפליקציה
  useEffect(() => {
    const fetchStaticData = async () => {
      if (!userInfo?.uid || !isConnected) return;

      try {
        const [bottlesRes, machinesRes] = await Promise.all([
          api.get<Bottle[]>("/api/bottles"),
          api.get<Machine[]>("/api/machines"),
        ]);

        setBottles(bottlesRes.data);
        setMachines(machinesRes.data);
      } catch (err) {
        console.error("❌ Failed to fetch static data:", err);
      }
    };

    fetchStaticData();
  }, [userInfo, isConnected]); // רק פעם אחת אחרי לוגין או שינוי חיבור

  // 🔄 Fetch דינמי – לאחר כל סשן
  useEffect(() => {
    const fetchDynamicData = async () => {
      if (!userInfo?.uid || !isConnected) return;

      try {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth() + 1;

        const [sessionsRes, summaryRes] = await Promise.all([
          api.get<Session[]>(`/api/sessions/user/${userInfo.uid}`),
          api.get<UserMonthlySummary>(`/api/sessions/user/${userInfo.uid}/summary`, { params: { year, month } }),
        ]);


        console.log(sessionsRes.data);
        console.log(summaryRes.data);
        // if (summaryRes.data.totalBalance !== undefined) {
        //   setUserInfo(prev =>
        //     prev ? { ...prev, balance: summaryRes.data.totalBalance.toString() } : null
        //   );
        // }

        console.log(userInfo);

        setUserSessions(sessionsRes.data);
        setUserMonthlySummary(summaryRes.data);


      } catch (err) {
        console.error("❌ Failed to fetch sessions or summary:", err);
      }
    };

    fetchDynamicData();
  }, [userInfo?.uid, isConnected, refreshSessions]); // ריפרש אחרי כל סשן



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
        setRefreshSessions,

      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
