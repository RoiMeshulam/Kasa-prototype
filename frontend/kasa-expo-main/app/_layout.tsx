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
import { I18nextProvider } from "react-i18next";
import i18n, { initI18n } from "@/localization/i18n";
import { useEffect, useState } from "react";
import { ActivityIndicator, I18nManager, View } from "react-native";
import * as Updates from "expo-updates";
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await initI18n();
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <I18nextProvider i18n={i18n} defaultNS={"translation"}>
        <GlobalProvider>
          <AuthProvider>
            <Stack>
              <Stack.Screen
                name="(protected)"
                options={{ headerShown: false, animation: "none" }}
              />
              <Stack.Screen
                name="(auth)"
                options={{ animation: "none", headerShown: false }}
              />
              {/* <Stack.Screen
                name="(auth)/login"
                options={{ animation: "none", headerShown: false }}
              /> */}
            </Stack>
            <StatusBar style="auto" />
          </AuthProvider>
        </GlobalProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
}
