import { useGlobalContext } from "@/store/globalContext";
import { Redirect, Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const ProtectedLayout = () => {
  const { isConnected } = useGlobalContext(); // שימוש ב־globalContext במקום AuthContext

  if (!isConnected) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default ProtectedLayout;
