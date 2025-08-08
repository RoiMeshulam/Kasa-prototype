import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/store/authContext";
import { GlobalProvider } from "@/store/globalContext";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "react-native-reanimated";
import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GlobalProvider>
        <AuthProvider>
          <Stack>
            <Stack.Screen
              name="(protected)"
              options={{ headerShown: false, animation: "none" }}
            />
            <Stack.Screen
              name="(auth)/login"
              options={{ animation: "none", headerShown: false }}
            />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </GlobalProvider>
    </ThemeProvider>
  );
}
