import { AuthContext } from "@/store/authContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const ProtectedLayout = () => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Redirect href={"/login"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default ProtectedLayout;
