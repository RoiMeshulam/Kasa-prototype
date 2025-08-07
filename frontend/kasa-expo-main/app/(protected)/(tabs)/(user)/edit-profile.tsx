import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EditProfileScreen = () => {
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <SafeAreaView className="mx-4">
      <Text className="text-xl font-bold text-start my-8 text-black">
        Edit your user details
      </Text>

      <View className="gap-4">
        <View className="gap-4">
          <View>
            <Text className="text-sm font-medium text-gray-900 mb-1">
              Username
            </Text>
            <TextInput
              className="w-full p-4 rounded-lg bg-white text-black"
              autoCapitalize="none"
              value={username}
              placeholder="user"
              placeholderTextColor="#9CA3AF"
              // style={{textAlign:'right'}}
              onChangeText={setUsername}
            />
          </View>
        </View>
        <View className="gap-4">
          <View>
            <Text className="text-sm font-medium text-gray-900 mb-1">
              Email
            </Text>
            <TextInput
              className="w-full p-4 rounded-lg bg-white text-black"
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              placeholderTextColor="#9CA3AF"
              // style={{textAlign:'right'}}
              onChangeText={setEmailAddress}
            />
          </View>
        </View>
        <View className="gap-4">
          <View>
            <Text className="text-sm font-medium text-gray-900 mb-1">
              Phone
            </Text>
            <TextInput
              className="w-full p-4 rounded-lg bg-white text-black"
              autoCapitalize="none"
              value={phone}
              placeholder="Enter email"
              placeholderTextColor="#9CA3AF"
              // style={{textAlign:'right'}}
              onChangeText={setPhone}
            />
          </View>
        </View>

        <TouchableOpacity
          className="w-full bg-transparent p-4 rounded-lg mt-6 border-green-600 border"
          onPress={() => {}}
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
