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
import { signupSchema, type SignupForm } from "../../validations/auth.validation";

export default function Signup() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = async (data: SignupForm) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.fullName } },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created! Please check your email to verify your account.");
    router.replace("/(public)/login");
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
            paddingHorizontal: 32,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-32 h-32 mx-auto mb-6 rounded-2xl"
            resizeMode="contain"
          />

          <View className="mb-10">
            <Text className="text-4xl font-bold text-slate-900">Create Account</Text>
            <Text className="text-slate-500 mt-2">Join us and start your journey</Text>
          </View>

          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-slate-700 font-semibold mb-2 ml-1">Full Name</Text>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="John Doe"
                  placeholderTextColor="#94a3b8"
                  textAlignVertical="center"
                  value={value}
                  onChangeText={onChange}
                  className="bg-slate-50 border border-slate-200 h-14 px-4 rounded-2xl text-lg text-slate-900"
                />
              )}
            />
            {errors.fullName && (
              <Text className="text-red-500 text-sm mt-1 ml-1">{errors.fullName.message}</Text>
            )}
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
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-slate-50 border border-slate-200 h-14 px-4 rounded-2xl text-lg text-slate-900"
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1 ml-1">{errors.email.message}</Text>
            )}
          </View>

          {/* Password */}
          <View className="mb-4">
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
            activeOpacity={0.8}
            className="bg-blue-600 p-5 rounded-2xl mt-6 shadow-lg shadow-blue-200"
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">Create Account</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8 pb-4">
            <Text className="text-slate-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/(public)/login")}>
              <Text className="text-blue-600 font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
