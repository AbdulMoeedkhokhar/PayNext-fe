import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../lib/supabase";
import { loginSchema, type LoginForm } from "../../validations/auth.validation";

export default function Login() {
  const router = useRouter();
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
    if (error) {
      alert(error.message);
    }
    // No manual navigation — AuthContext listener handles redirect
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-32 h-32 mx-auto mb-6 rounded-2xl"
            resizeMode="contain"
          />

          <View className="mb-10">
            <Text className="text-4xl font-bold text-slate-900">Welcome Back</Text>
            <Text className="text-slate-500 mt-2">Login to Continue</Text>
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-slate-700 font-semibold mb-2 ml-1">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="email@example.com"
                  placeholderTextColor="#94a3b8"
                  textAlignVertical="center"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="bg-slate-50 border border-slate-200 h-14 px-4 rounded-2xl text-lg text-slate-900"
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1 ml-1">{errors.email.message}</Text>
            )}
          </View>

          {/* Password */}
          <View className="mb-2">
            <Text className="text-slate-700 font-semibold mb-2 ml-1">Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  textAlignVertical="center"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  className="bg-slate-50 border border-slate-200 h-14 px-4 rounded-2xl text-lg text-slate-900"
                />
              )}
            />
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1 ml-1">{errors.password.message}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-blue-600 p-5 rounded-2xl mt-8 shadow-lg shadow-blue-200"
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8">
            <Text className="text-slate-400">Don't Have an Account? </Text>
            <TouchableOpacity onPress={() => router.replace("/(public)/signup")}>
              <Text className="text-blue-600 font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
