import { Stack } from "expo-router";
import React from "react";

const UserLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="profile" />
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
};

export default UserLayout;
