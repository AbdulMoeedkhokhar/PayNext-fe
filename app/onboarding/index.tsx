import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setSkill } from "../../store/slices/onboardingSlice";

export default function SkillScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("");

  const handleNext = () => {
    if (!value.trim()) return;
    dispatch(setSkill(value.trim()));
    router.push("/onboarding/level");
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
            <View className="flex-1 h-1 rounded-full bg-slate-200" />
            <View className="flex-1 h-1 rounded-full bg-slate-200" />
            <View className="flex-1 h-1 rounded-full bg-slate-200" />
          </View>

          <Text className="text-3xl font-bold text-slate-900 mb-3">
            What skill do you want to master? 🎯
          </Text>
          <Text className="text-slate-500 text-base mb-10">
            Be specific — instead of "coding" try "React Native" or "Python for data science"
          </Text>

          <TextInput
            placeholder="e.g. React Native, Guitar, Spanish..."
            placeholderTextColor="#94a3b8"
            value={value}
            onChangeText={setValue}
            className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-lg text-slate-900"
          />

          <TouchableOpacity
            onPress={handleNext}
            disabled={!value.trim()}
            className={`p-5 rounded-2xl mt-8 ${value.trim() ? "bg-blue-600" : "bg-slate-200"}`}
          >
            <Text
              className={`text-center font-bold text-lg ${value.trim() ? "text-white" : "text-slate-400"}`}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}