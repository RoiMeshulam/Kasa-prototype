import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";
import { auth } from "./firebase";
import { Router } from "expo-router";
import { getServerUrl } from "@/utils/network";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';

// 📌 טיפוס למידע על המשתמש
interface UserInfo {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  name: string | null;
  balance: string | null;
}

const SOCKET_SERVER_URL = getServerUrl();
const ENVIRONMENT = process.env.EXPO_PUBLIC_ENVIRONMENT || 'production';

console.log('🔧 Current Environment:', ENVIRONMENT);
console.log('🌐 Server URL:', SOCKET_SERVER_URL);

// Axios interceptors (לוגים)
axios.interceptors.request.use(
  (config) => {
    console.log('📡 Axios Request:', { url: config.url, method: config.method, data: config.data, headers: config.headers });
    return config;
  },
  (error) => {
    console.log('❌ Axios Request Error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log('✅ Axios Response:', { status: response.status, statusText: response.statusText, data: response.data });
    return response;
  },
  (error) => {
    console.log('❌ Axios Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });
    return Promise.reject(error);
  }
);

// -------- Google Sign-In: קונפיג חד-פעמי --------
export const configureGoogleSignIn = () => {
  // עבור Firebase Authentication - צריך Web Client ID (לא Android)
  const fromExtraWeb = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const fromEnvWeb = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const webClientId = fromExtraWeb || fromEnvWeb;

  if (!webClientId) {
    console.error("❌ Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (app.json extra / env)");
    console.log("📋 Available env vars:", {
      fromEnvWeb: fromEnvWeb ? fromEnvWeb.slice(0, 12) + '...' : undefined,
      fromExtraWeb: fromExtraWeb ? fromExtraWeb.slice(0, 12) + '...' : undefined
    });
    return;
  }

  console.log('✅ Google Sign-In configured with webClientId:', webClientId);
  console.log('🔧 Using Web Client ID for Firebase Authentication');
  
  GoogleSignin.configure({
    webClientId: webClientId, // Web Client ID נדרש לFirebase Auth
    offlineAccess: false,
    forceCodeForRefreshToken: false,
    hostedDomain: undefined,
  });
};

// -------- Token Validation --------
export const validateExistingToken = async (): Promise<UserInfo | null> => {
  try {
    console.log("🔍 validateExistingToken: Starting validation...");
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.warn("🔍 validateExistingToken: No token found in storage");
      return null;
    }
    if (!SOCKET_SERVER_URL) {
      console.error("❌ validateExistingToken: Server URL is undefined");
      throw new Error("Server URL not configured");
    }

    const response = await axios.post(
      `${SOCKET_SERVER_URL}/api/users/validate-token`,
      { token },
      { timeout: 10000, headers: { 'Content-Type': 'application/json' } }
    );

    const { uid, email, name, phoneNumber, balance } = response.data;
    const userInfo: UserInfo = { uid, email, name, phoneNumber, balance };
    console.log("✅ validateExistingToken: OK");
    return userInfo;
  } catch (error: any) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || '';
    console.error("❌ validateExistingToken failed:", status, msg || error.message);

    // 🧠 מוחקים רק אם ברור שהטוקן לא תקין
    if (status === 401 || status === 403 || /invalid/i.test(msg)) {
      console.log("🗑️ Removing invalid token from storage");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userInfo");
    } else {
      console.log("⚠️ Network/Server error during validation — keeping token for retry");
    }
    return null;
  }
};

// -------- Email/Password Sign-In --------
export const signInWithEmail = async (
  email: string,
  password: string,
  setUserInfo: (user: UserInfo) => void,
  setIsConnected: (status: boolean) => void,
  showCustomAlert: (title: string, message: string, type: "success" | "error") => void,
  router: Router
): Promise<void> => {
  try {
    if (!email.trim() || !password) {
      showCustomAlert("שגיאה", "אנא מלא את כל השדות", "error");
      return;
    }
    if (!SOCKET_SERVER_URL) {
      console.error("❌ signInWithEmail: Server URL is undefined");
      showCustomAlert("שגיאה", "שגיאת הגדרות שרת. אנא פנה למפתח.", "error");
      return;
    }

    console.log("🔐 Signing in with email/password...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    const response = await axios.post(`${SOCKET_SERVER_URL}/api/users/signin`, { token });
    const { uid, name, phoneNumber, balance } = response.data as UserInfo;
    const userInfo: UserInfo = { uid, email: response.data.email, name, phoneNumber, balance };

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));

    setUserInfo(userInfo);
    setIsConnected(true);
    showCustomAlert("הצלחה", `ברוך הבא ${name || email}!`, "success");
    router.replace("/(protected)/(tabs)/(home)");
  } catch (error: any) {
    console.error("❌ Firebase login error:", error.code, error.message);
    let errorMessage = "פרטי ההתחברות שגויים או שקרתה תקלה";
    switch (error.code) {
      case "auth/user-not-found": errorMessage = "המשתמש לא נמצא"; break;
      case "auth/wrong-password": errorMessage = "סיסמה שגויה"; break;
      case "auth/invalid-email":  errorMessage = "אימייל לא תקין"; break;
    }
    showCustomAlert("שגיאה", errorMessage, "error");
  }
};

// -------- Google Sign-In (Native, Dev Client) --------
let googleInFlight = false;

export const signInWithGoogle = async (
  setUserInfo: (user: UserInfo) => void,
  setIsConnected: (status: boolean) => void,
  showCustomAlert: (title: string, message: string, type: "success" | "error") => void,
  router: Router
) => {
  if (googleInFlight) {
    console.log('⏳ Google sign-in already in progress; ignoring duplicate tap.');
    return;
  }
  googleInFlight = true;

  try {
    console.log("🔐 Starting Google sign-in (native)...");
    
    // ודא שGoogle Sign-In מוגדר
    configureGoogleSignIn();
    
    if (!SOCKET_SERVER_URL) {
      showCustomAlert("שגיאה", "שגיאת הגדרות שרת.", "error");
      return;
    }

    // ודא שקראת configureGoogleSignIn() פעם אחת בעליית האפליקציה
    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }

    // התחברות ומעבר ל-Firebase
    const googleRes = await GoogleSignin.signIn();
    console.log(googleRes);
    if (!googleRes.data?.idToken) {
      showCustomAlert("שגיאה", "לא התקבל ID Token מ-Google", "error");
      return;
    }
    const credential = GoogleAuthProvider.credential(googleRes.data.idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const firebaseToken = await userCredential.user.getIdToken();

    // שרת
    const response = await axios.post(
      `${SOCKET_SERVER_URL}/api/users/signin`,
      { token: firebaseToken },
      { timeout: 10000 }
    );

    const { uid, email, name, phoneNumber, balance } = response.data as UserInfo;
    const userInfoData: UserInfo = { uid, email, name, phoneNumber, balance };

    await AsyncStorage.setItem("token", firebaseToken);
    await AsyncStorage.setItem("userInfo", JSON.stringify(userInfoData));

    setUserInfo(userInfoData);
    setIsConnected(true);
    showCustomAlert("הצלחה", `ברוך הבא ${name || email}!`, "success");
    router.replace("/(protected)/(tabs)/(home)");
  } catch (error: any) {
    console.error('❌ Google sign-in error:', error);
    let errorMessage = 'שגיאה בהתחברות עם Google';
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      errorMessage = 'ההתחברות בוטלה';
    } else if (error.code === statusCodes.IN_PROGRESS) {
      errorMessage = 'התחברות בתהליך';
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      errorMessage = 'Google Play Services לא זמין/דורש עדכון';
    }
    // 12500 / DEVELOPER_ERROR לרוב מצביע על SHA-1 חסר/שגוי ב-Firebase/GCP
    showCustomAlert('שגיאה', errorMessage, 'error');
  } finally {
    googleInFlight = false;
  }
};
