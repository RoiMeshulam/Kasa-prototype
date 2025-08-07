import { Stack } from "expo-router";
import React from "react";

const WalletLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="wallet" options={{ headerShown: false }} />
      <Stack.Screen
        name="[walletItem]"
        options={{ headerShown: false, animation: "slide_from_bottom" }}
      />
    </Stack>
  );
};

export default WalletLayout;
