import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Button,
  FlatList,
} from "react-native";
import React from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { bottles_detailed } from "@/utils/DUMMY_DATA";
import { DetailList } from "@/components/detail-list";

const WalletDetailScreen = () => {
  const params = useLocalSearchParams();

  return (
    <SafeAreaView>
      <Link href=".." asChild>
        <Pressable className="m-3">
          <Ionicons name="close-circle" size={48} />
        </Pressable>
      </Link>
      <View className="flex gap-10 mt-5">
        <Text className="font-semibold text-2xl self-center">
          {params.location_name}
        </Text>
        <View className="flex items-center gap-3 mb-10">
          <Text className="font-thin">Balance</Text>
          <Text className="text-6xl font-bold">138.30</Text>
        </View>

        <DetailList data={bottles_detailed} text="Details:" />

        <View className="mx-8 gap-y-4">
          <View className="flex-row justify-between">
            <Text>Status</Text>
            <Text>{params.status}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text>Date</Text>
            <Text>{params.date}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text>Time</Text>
            <Text>{params.date}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WalletDetailScreen;
