import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setLevel } from "../../store/slices/onboardingSlice";

const levels = [
  {
    id: "beginner",
    label: "Beginner",
    emoji: "🌱",
    description: "Just starting out, little to no experience",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    emoji: "🔥",
    description: "Some experience, want to level up",
  },
  {
    id: "advanced",
    label: "Advanced",
    emoji: "⚡",
    description: "Experienced, want to go deeper",
  },
];

type Level = "beginner" | "intermediate" | "advanced";

export default function LevelScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<Level | null>(null);

  const handleNext = () => {
    if (!selected) return;
    dispatch(setLevel(selected));
    router.push("/onboarding/time");
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-8 pt-10">
      {/* Progress */}
      <View className="flex-row gap-x-2 mb-12">
        <View className="flex-1 h-1 rounded-full bg-blue-600" />
        <View className="flex-1 h-1 rounded-full bg-blue-600" />
        <View className="flex-1 h-1 rounded-full bg-slate-200" />
        <View className="flex-1 h-1 rounded-full bg-slate-200" />
      </View>

      <Text className="text-3xl font-bold text-slate-900 mb-3">
        What's your current level? 📊
      </Text>
      <Text className="text-slate-500 text-base mb-10">
        Be honest — this helps us set the right pace for you
      </Text>

      <View className="gap-y-4">
        {levels.map((level) => {
          const isSelected = selected === level.id;
          return (
            <TouchableOpacity
              key={level.id}
              onPress={() => setSelected(level.id as Level)}
              className={`p-5 rounded-2xl border-2 flex-row items-center gap-x-4 ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <Text className="text-3xl">{level.emoji}</Text>
              <View className="flex-1">
                <Text
                  className={`font-bold text-lg ${
                    isSelected ? "text-blue-600" : "text-slate-900"
                  }`}
                >
                  {level.label}
                </Text>
                <Text className="text-slate-500 text-sm">{level.description}</Text>
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