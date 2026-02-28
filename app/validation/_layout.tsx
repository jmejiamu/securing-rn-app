import { Stack } from "expo-router";

export default function RootLayoutValidation() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
