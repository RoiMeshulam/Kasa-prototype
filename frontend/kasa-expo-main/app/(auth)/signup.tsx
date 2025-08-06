import { Link } from "expo-router";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const SignUpScreen = () => {
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
          Create you account
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
            // onPress={onSignInPress}
          >
            <Text className="text-white text-center font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center items-center mt-6 gap-2">
          <Text className="text-gray-600">Have an account?</Text>
          <Link href="/(auth)/login">
            <Text className="text-green-800 font-semibold ml-1">Sign in</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
