import { Stack } from "expo-router";
import React from "react";

const UserLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit-profile"
        options={{
          headerStyle: {
            backgroundColor: "#32a852",
          },
          headerTintColor: "#fff",
          title: "Edit Profile",
        }}
      />
    </Stack>
  );
};

export default UserLayout;
