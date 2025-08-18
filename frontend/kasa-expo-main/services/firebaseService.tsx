import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";
import { auth } from "./firebase";
import { Router } from "expo-router";

// 📌 טיפוס למידע על המשתמש
interface UserInfo {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  name: string | null;
  balance: string | null;
}

// 📌 כתובת השרת לפי הפלטפורמה (ל־Emulator)
const SOCKET_SERVER_URL ="http://10.0.0.8:8080"
  Platform.OS === "android"
    // ? "http://10.0.0.8:8080"
    // : "http://localhost:8080";

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

    console.log("🔐 Signing in with email and password...");
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    const token = await user.getIdToken();
    console.log("✅ Firebase sign-in successful:", user.uid);

    // 📡 שליחת הטוקן לשרת לקבלת מידע נוסף
    try {
      const response = await axios.post(
        `${SOCKET_SERVER_URL}/api/users/signin`,
        { token }
      );

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
      console.error("❌ Server error during sign-in:", error);
      const msg =
        error?.response?.data?.message || "שגיאה בעת התחברות לשרת. נסה שוב.";
      showCustomAlert("שגיאה", msg, "error");
    }
  } catch (error: any) {
    console.error("❌ Firebase login error:", error.code, error.message);

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
