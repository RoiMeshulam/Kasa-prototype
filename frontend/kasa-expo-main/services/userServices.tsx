// services/userService.ts
import api from "./apiServices";

// טיפוסים
interface UserInfo {
    uid: string;
    email: string | null;
    name: string | null;
    phoneNumber: string | null;
    balance: string | null; // אם תרצה מספר, שנה ל-number | null
}

export interface Session {
    sessionId: string;
    userId: string;
    machineId: string;
    status: "closed" | "open" | "pending";
    totalQuantity: number;
    balance: number;
    bottles: Record<string, any>;
    createdAtISO: string;
    createdAtMs: number;
    endedAtISO?: string;
    endedAtMs?: number;
}

export interface UserMonthlySummary {
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

// 🔹 פונקציות
export const fetchCurrentUser = () => api.get<UserInfo>("/users/me");

export const updateUserProfile = (userId: string, data: Partial<UserInfo>) =>
    api.put<UserInfo>(`/api/users/updateUser/${userId}`, data);

export const fetchUserSessions = (userId: string) =>
    api.get<Session[]>(`/api/sessions/user/${userId}`);

export const fetchUserMonthlySummary = (userId: string, year: number, month: number) =>
    api.get<UserMonthlySummary>(`/api/sessions/user/${userId}/summary`, { params: { year, month } });