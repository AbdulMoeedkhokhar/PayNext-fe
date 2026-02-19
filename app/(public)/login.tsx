import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../lib/supabase";
import { loginSchema, type LoginForm } from "../../validations/auth.validation";

export default function Login() {
  const router = useRouter();
  const { session } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) alert(error.message);
  };

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 28,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Mark */}
          <View style={{ alignItems: "center", marginBottom: 48 }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: "#FFFFFF",
                letterSpacing: -1,
              }}
            >
              PayNext
            </Text>
            <Text style={{ color: "#6B7280", marginTop: 6, fontSize: 15 }}>
              Your AI-powered skill coach
            </Text>
          </View>

          {/* Card */}
          <View
            style={{
              backgroundColor: "#131318",
              borderRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: "#1E1E2E",
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: "#FFFFFF",
                marginBottom: 4,
              }}
            >
              Welcome back
            </Text>
            <Text style={{ color: "#6B7280", marginBottom: 28, fontSize: 14 }}>
              Sign in to continue your journey
            </Text>

            {/* Email */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  color: "#9CA3AF",
                  fontSize: 13,
                  fontWeight: "600",
                  marginBottom: 8,
                  letterSpacing: 0.5,
                }}
              >
                EMAIL
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="you@example.com"
                    placeholderTextColor="#374151"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={{
                      backgroundColor: "#0A0A0F",
                      borderWidth: 1,
                      borderColor: errors.email ? "#EF4444" : "#1E1E2E",
                      borderRadius: 14,
                      padding: 16,
                      color: "#FFFFFF",
                      fontSize: 16,
                    }}
                  />
                )}
              />
              {errors.email && (
                <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 6 }}>
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Password */}
            <View style={{ marginBottom: 28 }}>
              <Text
                style={{
                  color: "#9CA3AF",
                  fontSize: 13,
                  fontWeight: "600",
                  marginBottom: 8,
                  letterSpacing: 0.5,
                }}
              >
                PASSWORD
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#374151"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    style={{
                      backgroundColor: "#0A0A0F",
                      borderWidth: 1,
                      borderColor: errors.password ? "#EF4444" : "#1E1E2E",
                      borderRadius: 14,
                      padding: 16,
                      color: "#FFFFFF",
                      fontSize: 16,
                    }}
                  />
                )}
              />
              {errors.password && (
                <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 6 }}>
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={{
                backgroundColor: "#6C63FF",
                borderRadius: 14,
                padding: 18,
                alignItems: "center",
                shadowColor: "#6C63FF",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}>
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 28,
            }}
          >
            <Text style={{ color: "#6B7280" }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/(public)/signup")}>
              <Text style={{ color: "#6C63FF", fontWeight: "700" }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}