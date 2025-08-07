import { MachineProvider } from "@/store/machineContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <MachineProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="machine" options={{ headerBackTitle: "Back" }} />
        <Stack.Screen name="action" options={{ headerBackTitle: "Back" }} />
      </Stack>
    </MachineProvider>
  );
}
