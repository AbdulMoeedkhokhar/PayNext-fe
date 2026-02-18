import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const isAuthenticated = false;
  if (!isAuthenticated) {
    return <Redirect href="/(public)/login" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
