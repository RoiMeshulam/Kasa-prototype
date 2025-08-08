import { InputField } from "@/components/ui/InputField";
import { useGlobalContext } from "@/store/globalContext";
import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const EditProfileScreen = () => {
  const { userInfo, setUserInfo } = useGlobalContext();

  const [username, setUsername] = useState(userInfo?.name as string);
  const [emailAddress, setEmailAddress] = useState(userInfo?.email as string);
  const [phone, setPhone] = useState(userInfo?.phoneNumber as string);

  return (
    <SafeAreaView className="mx-4">
      <Text className="text-xl font-bold text-start my-8 text-black">
        Edit your user details
      </Text>

      <View className="gap-4">
        <InputField
          text="Username"
          autoCapitalize="none"
          value={username}
          placeholder="Enter your username"
          placeholderTextColor="#9CA3AF"
          onChangeText={setUsername}
        />
        <InputField
          text="Email"
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          onChangeText={setEmailAddress}
          keyboardType="email-address"
          // style={{textAlign:'right'}}
        />
        <InputField
          text="Phone"
          autoCapitalize="none"
          value={phone}
          placeholder="Enter your phone number"
          placeholderTextColor="#9CA3AF"
          // style={{textAlign:'right'}}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          className="w-full bg-transparent p-4 rounded-lg mt-6 border-green-600 border"
          onPress={
            () => {}
            // setUserInfo({
            //   uid: userInfo?.uid as string,
            //   balance: userInfo?.balance as string,
            //   email: emailAddress,
            //   phoneNumber: phone,
            //   name: username,
            // })
          }
        >
          <Text className="text-green-800 text-center font-semibold">
            Update
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
