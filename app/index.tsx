// app/index.tsx
import { Redirect } from "expo-router";
import { useAuth } from "../context/authContext";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { session, loading } = useAuth();

  console.log("index:", { session: !!session, loading });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (session) return <Redirect href="/(protected)" />;

  return <Redirect href="/(public)/login" />;
}