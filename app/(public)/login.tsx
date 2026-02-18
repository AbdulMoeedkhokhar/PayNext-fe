import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Link, useRouter } from "expo-router";

export default function login() {
  const router = useRouter();
  const handleLogin = () => {
    router.replace("/(protected)");
  };
  return (
    <View className="flex-1 bg-white px-8 justify-center">
      <Image
        source={require("../../assets/images/logo.png")}
        className="w-32 h-32 mx-auto mb-6"
        resizeMode="contain"
      />
      <View className="mb-10">
        <Text className="text-4xl font-bold text-slate-900">Welcome Back</Text>
        <Text className="text-slate-500 mt-2">Login to Continue</Text>
      </View>
      <View className="space-y-4">
        <TextInput
          placeholder="Email"
          className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-lg"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          className="bg-slate-50 border border-slate-200 p-4 rounded-2xl mt-4 text-lg"
        />
      </View>
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-600 p-5 rounded-2xl mt-8 shadow-lg shadow-blue-200"
      >
        <Text className="text-white text-center font-bold text-lg">Sign In</Text>
      </TouchableOpacity>
      <View className="flex-row justify-center mt-8">
        <Text className="text-slate-400">Don't Have an Account?</Text>
        <Link href="/(public)/signup" asChild>
          <TouchableOpacity>
            <Text className="text-blue-600 font-bold">Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
