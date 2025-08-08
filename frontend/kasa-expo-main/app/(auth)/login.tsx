import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useGlobalContext } from "@/store/globalContext";
import { useRouter, Link } from "expo-router";
import { signInWithEmail } from "@/services/firebaseService";
import CustomAlert from "@/components/ui/CustomAlert";
import { InputField } from "@/components/ui/InputField";
import { AntDesign } from "@expo/vector-icons";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUserInfo, setIsConnected } = useGlobalContext();

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
  }, []);

  const emailIcon = useMemo(
    () => <AntDesign name="user" color={"#32a852"} size={24} />,
    []
  );

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

  const handleLogin = async () => {
    try {
      setLoading(true);
      console.log(" i am in handle login");
      await signInWithEmail(
        email,
        password,
        setUserInfo,
        setIsConnected,
        showCustomAlert,
        router
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      return <View className="flex-1 justify-center items-center">Error</View>;
    }
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
        <View className="gap-3 mb-12">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-[90%] aspect-square rounded-[30px] self-center"
          />
          <Text className="text-4xl font-black text-center mb-4 text-green-800">
            Recycle.Earn.Impact
          </Text>
        </View>

        <Text className="text-xl font-bold mb-4 text-black">
          Login with your account
        </Text>

        <InputField
          text="Email Address"
          value={email}
          placeholder="Enter email"
          onChangeText={handleEmailChange}
          icon={emailIcon}
          keyboardType="email-address"
          editable={!loading}
        />

        <InputField
          text="Password"
          value={password}
          placeholder="Enter password"
          secureTextEntry
          onChangeText={handlePasswordChange}
          icon={<AntDesign name="lock" color={"#32a852"} size={24} />}
          editable={!loading}
        />

        <TouchableOpacity
          className="w-full bg-green-600 p-4 rounded-lg mt-6"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size={"small"} color={"#fff"} />
          ) : (
            <Text className="text-white text-center font-semibold">
              Sign In
            </Text>
          )}
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
