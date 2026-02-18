import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import {Link,useRouter} from "expo-router"
import {SafeAreaView} from "react-native-safe-area-context"

export default function signup(){
    const router = useRouter()
    const handleSignup = ()=>{
        router.replace("/(protected)")
    }
    return (
    <SafeAreaView className="flex-1 bg-white">
      {/* KeyboardAvoidingView prevents the keyboard from hiding our inputs.
        Behavior 'padding' is usually best for iOS.
      */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8">
          
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-32 h-32 mx-auto mb-6"
            resizeMode="contain"
          />
          {/* Header Section */}
          <View className="mt-12 mb-10">
            <Text className="text-4xl font-bold text-slate-900">Create Account</Text>
            <Text className="text-slate-500 mt-2">Join us and start your journey</Text>
          </View>

          {/* Form Section */}
          <View className="gap-y-4">
            <View>
              <Text className="text-slate-700 font-semibold mb-2 ml-1">Full Name</Text>
              <TextInput 
                placeholder="John Doe" 
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-lg"
              />
            </View>

            <View>
              <Text className="text-slate-700 font-semibold mb-2 ml-1">Email</Text>
              <TextInput 
                placeholder="email@example.com" 
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-lg"
              />
            </View>

            <View>
              <Text className="text-slate-700 font-semibold mb-2 ml-1">Password</Text>
              <TextInput 
                placeholder="••••••••" 
                secureTextEntry 
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-lg"
              />
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            onPress={handleSignup}
            activeOpacity={0.8}
            className="bg-blue-600 p-5 rounded-2xl mt-10 shadow-lg shadow-blue-200"
          >
            <Text className="text-white text-center font-bold text-lg">Create Account</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-row justify-center mt-auto mb-8 py-4">
            <Text className="text-slate-500">Already have an account? </Text>
            <Link href="/(public)/login" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-bold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}