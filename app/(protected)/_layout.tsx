import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/authContext";
import { ActivityIndicator, View } from "react-native";

export default function AppLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!session) return <Redirect href="/(public)/login" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}