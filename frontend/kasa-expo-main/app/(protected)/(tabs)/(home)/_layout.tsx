import { Stack } from "expo-router";

const HomeLayout = () => {
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
          title: "Scanner",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
