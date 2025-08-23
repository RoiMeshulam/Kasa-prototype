import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";
import { auth } from "./firebase";
import { Router } from "expo-router";
import { getServerUrl } from "@/utils/network";
import log from "@/utils/logger";

// 📌 טיפוס למידע על המשתמש
interface UserInfo {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  name: string | null;
  balance: string | null;
}

const SOCKET_SERVER_URL = getServerUrl();
console.log(SOCKET_SERVER_URL);

// 📌 פונקציית בדיקת טוקן קיים
export const validateExistingToken = async (): Promise<UserInfo | null> => {
  try {
    log.debug("🔍 validateExistingToken: Starting validation...");
    
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      log.warn("🔍 validateExistingToken: No token found in storage");
      return null;
    }

    log.debug("🔍 validateExistingToken: Token found, length:", token.length);
    log.debug("🔍 validateExistingToken: Validating with server...");
    log.debug("🌐 Server URL:", SOCKET_SERVER_URL);
    
    // שליחת הטוקן לשרת לוולידציה
    const response = await axios.post(
      `${SOCKET_SERVER_URL}/api/users/validate-token`,
      { token },
      {
        timeout: 10000, // 10 seconds timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    log.info("✅ validateExistingToken: Server response received");
    log.debug("📊 Response data:", response.data);

    const { uid, email, name, phoneNumber, balance } = response.data;

    const userInfo: UserInfo = {
      uid,
      email,
      name,
      phoneNumber,
      balance,
    };

    log.info("✅ validateExistingToken: Token validation successful");
    return userInfo;

  } catch (error: any) {
    log.error("❌ validateExistingToken: Token validation failed");
    log.error("❌ Error details:", error?.response?.data || error.message);
    log.error("❌ Error status:", error?.response?.status);
    
    // מחיקת טוקן לא תקין
    log.debug("🗑️ Removing invalid token from storage");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userInfo");
    
    return null;
  }
};

// 📌 הפונקציה הראשית
export const signInWithEmail = async (
  email: string,
  password: string,
  setUserInfo: (user: UserInfo) => void,
  setIsConnected: (status: boolean) => void,
  showCustomAlert: (
    title: string,
    message: string,
    type: "success" | "error"
  ) => void,
  router: Router
): Promise<void> => {
  try {
    if (!email.trim() || !password) {
      showCustomAlert("שגיאה", "אנא מלא את כל השדות", "error");
      return;
    }

    log.debug("🔐 Signing in with email and password...");
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    const token = await user.getIdToken();
    log.info("✅ Firebase sign-in successful:", user.uid);

    // 📡 שליחת הטוקן לשרת לקבלת מידע נוסף
    try {
      log.debug("📡 Sending token to server...");
      const response = await axios.post(
        `${SOCKET_SERVER_URL}/api/users/signin`,
        { token }
      );

      log.debug("📊 Server response:", response.data);

      const { uid, email, name, phoneNumber, balance } = response.data;

      const userInfo: UserInfo = {
        uid,
        email,
        name,
        phoneNumber,
        balance,
      };

      // 🧠 שמירת טוקן ופרטי משתמש בלוקאל סטורג'
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));

      // 🎯 עדכון סטייט
      setUserInfo(userInfo);
      setIsConnected(true);
      
      showCustomAlert("הצלחה", `ברוך הבא ${name || email}!`, "success");
      router.replace("/(protected)/(tabs)/(home)");
    } catch (error: any) {
      log.error("❌ Server error during sign-in:", error);
      const msg =
        error?.response?.data?.message || "שגיאה בעת התחברות לשרת. נסה שוב.";
      showCustomAlert("שגיאה", msg, "error");
    }
  } catch (error: any) {
    log.error("❌ Firebase login error:", error.code, error.message);

    let errorMessage = "פרטי ההתחברות שגויים או שקרתה תקלה";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "המשתמש לא נמצא";
        break;
      case "auth/wrong-password":
        errorMessage = "סיסמה שגויה";
        break;
      case "auth/invalid-email":
        errorMessage = "אימייל לא תקין";
        break;
    }

    showCustomAlert("שגיאה", errorMessage, "error");
  }
};

// 📌 פונקציית התנתקות
export const signOutUser = async (
  showCustomAlert: (
    title: string,
    message: string,
    type: "success" | "error"
  ) => void,
  router: Router
): Promise<void> => {
  try {
    console.log("🔐 Signing out user...");
    
    // 🔥 התנתקות מ-Firebase
    await signOut(auth);
    
    // 🗑️ מחיקת מידע מ-AsyncStorage
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userInfo");
    
    console.log("✅ Logout successful");
    showCustomAlert("הצלחה", "התנתקת בהצלחה", "success");
    
    // 🔄 ניווט לעמוד הלוגין
    router.replace("/(auth)/login");
    
  } catch (error: any) {
    console.error("❌ Logout error:", error);
    showCustomAlert("שגיאה", "שגיאה בעת התנתקות. נסה שוב.", "error");
  }
};