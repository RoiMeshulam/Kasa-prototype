import Constants from "expo-constants";
import { Platform } from "react-native";

export const getServerUrl = (port = 8080): string => {
  const manifest: any = Constants.manifest || (Constants as any).manifest2;
  let host: string | undefined;

  if (manifest?.debuggerHost) {
    host = manifest.debuggerHost.split(":")[0]; // אוטומטי למחשב ב־Dev
  }

  if (!host) {
    // אם אין debuggerHost, fallback למשתנה סביבה או כתובת קבועה
    host = Platform.OS === "android" ? "10.0.0.9" : "localhost";
  }

  return `http://${host}:${port}`;
};
