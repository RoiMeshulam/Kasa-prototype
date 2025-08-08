import { Header } from "@/components/header";
import { users } from "@/utils/DUMMY_DATA";
import { Link } from "expo-router";
import React, { useContext } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import InfoCard from "../(home)/_components/info-card";
import { useGlobalContext } from "@/store/globalContext";

const ProfileScreen = () => {
  const { userInfo } = useGlobalContext();
  return (
    <SafeAreaView className="mx-4 gap-y-5">
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
            <Text>{userInfo?.name}</Text>
          </View>
          <View className="flex-row text-base text-gray-300 p-1 gap-x-1">
            <Text className="font-semibold">Email:</Text>
            <Text>{userInfo?.email}</Text>
          </View>
          <View className="flex-row text-base text-gray-300 p-1 gap-x-1">
            <Text className="font-semibold">Phone:</Text>
            <Text>{userInfo?.phoneNumber}</Text>
          </View>
        </View>
      </View>

      <View className="flex-1 items-center justify-center bg-gray-100">
        <View className="w-full flex-row flex-wrap justify-between">
          <View className="w-[48%] aspect-square bg-green-500 rounded-lg items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-white">
              {users[0].balance}
            </Text>
            <Text className="text-white">Total this month</Text>
          </View>
          <View className="w-[48%] aspect-square bg-green-500 rounded-lg items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-white">
              {users[0].balance}
            </Text>
            <Text className="text-white">Total this month</Text>
          </View>
          <View className="w-[48%] aspect-square bg-green-500 rounded-lg items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-white">
              {users[0].balance}
            </Text>
            <Text className="text-white">Total this month</Text>
          </View>
          <View className="w-[48%] aspect-square bg-green-500 rounded-lg items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-white">
              {users[0].balance}
            </Text>
            <Text className="text-white">Total this month</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
