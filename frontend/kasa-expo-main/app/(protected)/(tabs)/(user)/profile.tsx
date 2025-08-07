import { Header } from "@/components/header";
import { users } from "@/utils/DUMMY_DATA";
import { Link } from "expo-router";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import InfoCard from "../(home)/_components/info-card";

const ProfileScreen = () => {
  return (
    <SafeAreaView className="mx-4">
      <Header />
      <View className=" bg-white rounded-lg">
        <View className="w-full p-4 text-black border-b border-gray-300 flex-row justify-between">
          <Text>User details</Text>
          <Link
            href={"/(protected)/(tabs)/(user)/edit-profile"}
            push
            prefetch
            asChild
          >
            <Entypo name="pencil" size={16} />
          </Link>
        </View>

        <View className="px-4 py-2 border-b border-gray-100 flex">
          <View className="flex-row text-base text-gray-300 p-1 gap-x-1">
            <Text className="font-semibold">User name:</Text>
            <Text>{users[0].name}</Text>
          </View>
          <View className="flex-row text-base text-gray-300 p-1 gap-x-1">
            <Text className="font-semibold">Email:</Text>
            <Text>{users[0].phone_or_email}</Text>
          </View>
          <View className="flex-row text-base text-gray-300 p-1 gap-x-1">
            <Text className="font-semibold">Phone:</Text>
            <Text>{users[0].id_device}</Text>
          </View>
        </View>
      </View>
      <View className="grid grid-cols-2 gap-4 mt-5">
        <View className="p-3 bg-white rounded-lg flex items-center space-y-2">
          <Text className="text-2xl font-bold">{users[0].balance}</Text>
          <Text>Total this month</Text>
        </View>
        <View className="p-3 bg-white rounded-lg flex items-center space-y-2">
          <Text className="text-2xl font-bold">{users[0].balance}</Text>
          <Text>Total this month</Text>
        </View>
        <View className="p-3 bg-white rounded-lg flex items-center space-y-2">
          <Text className="text-2xl font-bold">{users[0].balance}</Text>
          <Text>Total this month</Text>
        </View>
        <View className="p-3 bg-white rounded-lg flex items-center space-y-2">
          <Text className="text-2xl font-bold">{users[0].balance}</Text>
          <Text>Total this month</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
