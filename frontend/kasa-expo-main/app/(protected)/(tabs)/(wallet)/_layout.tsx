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
      <Stack.Screen
        name="fullList"
        options={{
          headerStyle: {
            backgroundColor: "#32a852",
          },
          headerTintColor: "#fff",
          title: "Edit Profile",
          headerBackTitle: 'Back'
        }}
      />
    </Stack>
  );
};

export default WalletLayout;
