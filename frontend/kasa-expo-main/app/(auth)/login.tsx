import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image } from "react-native";
import { useGlobalContext } from "@/store/globalContext";
import { useRouter, Link } from "expo-router";
import { signInWithEmail } from "@/services/firebaseService";
import CustomAlert from "@/components/ui/CustomAlert";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUserInfo, setIsConnected } = useGlobalContext();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{
    title: string;
    message: string;
    type: "success" | "error" | undefined;
  }>({
    title: "",
    message: "",
    type: undefined,
  });

  const showCustomAlert = (
    title: string,
    message: string,
    type: "success" | "error"
  ) => {
    setAlertData({ title, message, type });
    setAlertVisible(true);
  };

  const handleLogin = () => {
    console.log(" i am in handle login");
    signInWithEmail(email, password, setUserInfo, setIsConnected, showCustomAlert, router);
  };

  return (
    <View className="flex-1 bg-gray-200 p-6">
      <CustomAlert
        visible={alertVisible}
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        onClose={() => setAlertVisible(false)}
      />

      <View className="flex-1 justify-center">
        <Image source={require("../../assets/images/logo.png")} className="w-[90%] aspect-square rounded-[30px] self-center" />
        <Text className="text-4xl font-black text-center mb-4 text-green-800">Recycle.Earn.Impact</Text>

        <Text className="text-xl font-bold mb-4 text-black">Login with your account</Text>

        <TextInput
          className="w-full p-4 border border-green-200 rounded-lg bg-white text-black"
          value={email}
          placeholder="Enter email"
          placeholderTextColor="#9CA3AF"
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          className="w-full p-4 border border-green-200 rounded-lg bg-white text-black mt-4"
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity className="w-full bg-green-600 p-4 rounded-lg mt-6" onPress={handleLogin}>
          <Text className="text-white text-center font-semibold">Sign In</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mt-6 gap-2">
          <Text className="text-gray-600">Don't have an account?</Text>
          <Link href="/(auth)/signup">
            <Text className="text-green-800 font-semibold ml-1">Sign up</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default SignInScreen;
