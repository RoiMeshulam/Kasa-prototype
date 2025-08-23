import Constants from "expo-constants";

export const getServerUrl = (): string => {
  return Constants.expoConfig?.extra?.BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:8080";
};
