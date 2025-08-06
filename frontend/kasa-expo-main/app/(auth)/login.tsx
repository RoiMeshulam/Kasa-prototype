import { AuthContext } from "@/store/authContext";
import { Link } from "expo-router";
import React, { useContext } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const SignInScreen = () => {
  const { logIn, isLoggedIn } = useContext(AuthContext);

  return (
    <View className="flex-1 bg-gray-200 p-6">
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

        <Text className="text-xl font-bold text-start mb-4 text-black">
          Login with your account
        </Text>

        <View className="gap-4">
          <View>
            <Text className="text-sm font-medium text-gray-300 mb-1">
              Email
            </Text>
            <TextInput
              className="w-full p-4 border border-green-200 rounded-lg bg-white text-black"
              autoCapitalize="none"
              value={"emailAddress"}
              placeholder="Enter email"
              placeholderTextColor="#9CA3AF"
              // style={{textAlign:'right'}}
              // onChangeText={setEmailAddress}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-300 mb-1">
              Password
            </Text>
            <TextInput
              className="w-full p-4 border border-green-200 rounded-lg bg-white text-black"
              value={"password"}
              placeholder="Enter password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={true}
              // onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            className="w-full bg-green-600 p-4 rounded-lg mt-6"
            onPress={logIn}
          >
            <Text className="text-white text-center font-semibold">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center items-center mt-6 gap-2">
          <Text className="text-gray-600">Don't have an account?</Text>
          <Link href="/(auth)/signup">
            <Text className="text-green-800 font-semibold ml-1">Sign up</Text>
          </Link>
        </View>
        <View className="h-px bg-gray-300 my-4 w-full" />
        <View>
          <TouchableOpacity
            className="w-full bg-transparent p-4 rounded-lg mt-6 border-green-600 border"
            onPress={logIn}
          >
            <Text className="text-green-800 text-center font-semibold">
              Sign In with Phone
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignInScreen;
