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
import { useAppDispatch } from "../store/hooks";
import { setSkill } from "../store/slices/onboardingSlice";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 28,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress */}
          <View style={{ flexDirection: "row", gap: 6, marginBottom: 48 }}>
            {[true, false, false, false].map((active, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 99,
                  backgroundColor: active ? "#6C63FF" : "#1E1E2E",
                }}
              />
            ))}
          </View>

          <Text style={{ color: "#6B7280", fontSize: 13, fontWeight: "600", letterSpacing: 1, marginBottom: 12 }}>
            STEP 1 OF 4
          </Text>
          <Text style={{ fontSize: 30, fontWeight: "800", color: "#FFFFFF", letterSpacing: -0.5, marginBottom: 12 }}>
            What skill do you want to master?
          </Text>
          <Text style={{ color: "#6B7280", fontSize: 15, marginBottom: 40, lineHeight: 22 }}>
            Be specific — "React Native" beats "coding". The more precise, the better your tasks.
          </Text>

          <TextInput
            placeholder="e.g. React Native, Guitar, Spanish..."
            placeholderTextColor="#374151"
            value={value}
            onChangeText={setValue}
            style={{
              backgroundColor: "#131318",
              borderWidth: 1,
              borderColor: value.trim() ? "#6C63FF" : "#1E1E2E",
              borderRadius: 16,
              padding: 18,
              color: "#FFFFFF",
              fontSize: 16,
              marginBottom: 16,
            }}
          />

          <View style={{ marginTop: "auto", paddingTop: 40 }}>
            <TouchableOpacity
              onPress={handleNext}
              disabled={!value.trim()}
              style={{
                backgroundColor: value.trim() ? "#6C63FF" : "#131318",
                borderRadius: 16,
                padding: 18,
                alignItems: "center",
                borderWidth: 1,
                borderColor: value.trim() ? "#6C63FF" : "#1E1E2E",
                shadowColor: "#6C63FF",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: value.trim() ? 0.35 : 0,
                shadowRadius: 12,
              }}
            >
              <Text
                style={{
                  color: value.trim() ? "#FFFFFF" : "#374151",
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                Continue →
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}