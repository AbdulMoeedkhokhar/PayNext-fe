import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setGoal, resetOnboarding, setOnboardingComplete } from "../../store/slices/onboardingSlice";
import { supabase } from "../../lib/supabase";

export default function GoalScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const onboarding = useAppSelector((state) => state.onboarding);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
  if (!value.trim()) return;
  setLoading(true);

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("user_skills").insert({
    user_id: user?.id,
    skill: onboarding.skill,
    level: onboarding.level,
    daily_minutes: onboarding.dailyMinutes,
    goal: value.trim(),
  });

  setLoading(false);

  if (error) {
    alert("Something went wrong. Please try again.");
    return;
  }

  dispatch(setGoal(value.trim()));
  dispatch(setOnboardingComplete(true)); // ← set BEFORE navigating
  dispatch(resetOnboarding());
  router.replace("/(protected)");
};

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32, paddingVertical: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress */}
          <View className="flex-row gap-x-2 mb-12">
            <View className="flex-1 h-1 rounded-full bg-blue-600" />
            <View className="flex-1 h-1 rounded-full bg-blue-600" />
            <View className="flex-1 h-1 rounded-full bg-blue-600" />
            <View className="flex-1 h-1 rounded-full bg-blue-600" />
          </View>

          <Text className="text-3xl font-bold text-slate-900 mb-3">
            What's your goal? 🏆
          </Text>
          <Text className="text-slate-500 text-base mb-10">
            Where do you want to be in 3 months? Be as specific as possible.
          </Text>

          <TextInput
            placeholder="e.g. Build and ship my first React Native app to the App Store..."
            placeholderTextColor="#94a3b8"
            value={value}
            onChangeText={setValue}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-lg text-slate-900 min-h-36"
          />

          <TouchableOpacity
            onPress={handleFinish}
            disabled={!value.trim() || loading}
            className={`p-5 rounded-2xl mt-8 ${value.trim() && !loading ? "bg-blue-600" : "bg-slate-200"}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                className={`text-center font-bold text-lg ${value.trim() ? "text-white" : "text-slate-400"}`}
              >
                Build My Roadmap 🚀
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}