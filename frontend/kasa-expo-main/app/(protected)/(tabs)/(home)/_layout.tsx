import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

const HomeLayout = () => {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="scannerScreen"
        options={{
          headerStyle: {
            backgroundColor: "#32a852",
          },
          headerTintColor: "#fff",
          title: t("Scanner"),
          headerBackTitle: t("Back"),
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
