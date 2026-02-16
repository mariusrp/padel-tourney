import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0A0A0A" },
          headerTintColor: "rgba(255,255,255,0.92)",
          headerTitleStyle: { fontWeight: "800" },
          contentStyle: { backgroundColor: "#0A0A0A" },
        }}
      >
        <Stack.Screen
          name="(modals)/format"
          options={{ presentation: "modal", title: "Format" }}
        />
        <Stack.Screen
          name="(modals)/points"
          options={{ presentation: "modal", title: "Points" }}
        />
      </Stack>
    </>
  );
}
