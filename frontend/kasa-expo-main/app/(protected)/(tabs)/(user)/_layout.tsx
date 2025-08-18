import { Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

const UserLayout = () => {
  const { t } = useTranslation();
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
          title: t("Edit Profile"),
          headerBackTitle: t("Back")
        }}
      />
    </Stack>
  );
};

export default UserLayout;
