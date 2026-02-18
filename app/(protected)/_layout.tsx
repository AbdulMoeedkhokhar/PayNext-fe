import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/authContext";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setOnboardingComplete } from "../../store/slices/onboardingSlice";

export default function AppLayout() {
  const { session, loading } = useAuth();
  const dispatch = useAppDispatch();
  const isComplete = useAppSelector((state) => state.onboarding.isComplete);

  useEffect(() => {
    if (!session) return;
    if (isComplete !== null) return; // already checked, don't re-fetch
    
    supabase
      .from("user_skills")
      .select("id")
      .eq("user_id", session.user.id)
      .limit(1)
      .then(({ data }) => {
        dispatch(setOnboardingComplete(data ? data.length > 0 : false));
      });
  }, [session]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!session) return <Redirect href="/(public)/login" />;

  if (isComplete === null) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!isComplete) return <Redirect href="/onboarding" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}