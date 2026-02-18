import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setDailyMinutes } from "../../store/slices/onboardingSlice";

const timeOptions = [
  { label: "15 min", minutes: 15, emoji: "⚡", description: "Quick daily habit" },
  { label: "30 min", minutes: 30, emoji: "🎯", description: "Steady progress" },
  { label: "1 hour", minutes: 60, emoji: "🔥", description: "Serious commitment" },
  { label: "2 hours+", minutes: 120, emoji: "🚀", description: "Fast track mastery" },
];

export default function TimeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<number | null>(null);

  const handleNext = () => {
    if (!selected) return;
    dispatch(setDailyMinutes(selected));
    router.push("/onboarding/goal");
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-8 pt-10">
      {/* Progress */}
      <View className="flex-row gap-x-2 mb-12">
        <View className="flex-1 h-1 rounded-full bg-blue-600" />
        <View className="flex-1 h-1 rounded-full bg-blue-600" />
        <View className="flex-1 h-1 rounded-full bg-blue-600" />
        <View className="flex-1 h-1 rounded-full bg-slate-200" />
      </View>

      <Text className="text-3xl font-bold text-slate-900 mb-3">
        How much time per day? ⏰
      </Text>
      <Text className="text-slate-500 text-base mb-10">
        Consistency beats intensity — pick what you can actually stick to
      </Text>

      <View className="gap-y-4">
        {timeOptions.map((option) => {
          const isSelected = selected === option.minutes;
          return (
            <TouchableOpacity
              key={option.minutes}
              onPress={() => setSelected(option.minutes)}
              className={`p-5 rounded-2xl border-2 flex-row items-center gap-x-4 ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <Text className="text-3xl">{option.emoji}</Text>
              <View className="flex-1">
                <Text
                  className={`font-bold text-lg ${
                    isSelected ? "text-blue-600" : "text-slate-900"
                  }`}
                >
                  {option.label}
                </Text>
                <Text className="text-slate-500 text-sm">{option.description}</Text>
              </View>
              {isSelected && (
                <View className="w-6 h-6 rounded-full bg-blue-600 items-center justify-center">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={handleNext}
        disabled={!selected}
        className={`p-5 rounded-2xl mt-10 ${selected ? "bg-blue-600" : "bg-slate-200"}`}
      >
        <Text
          className={`text-center font-bold text-lg ${selected ? "text-white" : "text-slate-400"}`}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}