import {
  Button,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Header } from "@/components/header";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { InputField } from "@/components/ui/InputField";
import { useGlobalContext } from "@/store/globalContext";
import { transactions } from "@/utils/DUMMY_DATA";

export default function WalletScreen() {
  const [value, setValue] = useState("");
  const router = useRouter();
  const { userInfo } = useGlobalContext();

  return (
    <SafeAreaView>
      <Header />
      <View className="flex items-center gap-3 mb-12">
        <Text className="font-thin">Balance</Text>
        <View className="flex-row items-end">
          <Text className="text-xs">$</Text>
          <Text className="text-6xl font-bold">
            {Number(userInfo?.balance).toFixed(2)}
          </Text>
        </View>
      </View>
      <View className="mx-4">
        <FlatList
          ListHeaderComponent={
            <InputField
              autoCapitalize="none"
              value={value}
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
              onChangeText={setValue}
              icon={<AntDesign name="search1" size={24} />}
            />
          }
          ListHeaderComponentStyle={{
            borderBottomColor: "#d1d5db",
            borderBottomWidth: 1,
          }}
          className="bg-white rounded-lg"
          data={transactions.slice(0, 5)}
          renderItem={({ item }: { item: any }) => (
            <Link
              href={{
                pathname: "/(protected)/(tabs)/(wallet)/[walletItem]",
                params: item,
              }}
              asChild
            >
              <Pressable className="px-4 py-2 border-b border-gray-100 flex-row">
                <View className="flex-grow">
                  <Text className="font-semibold text-xl">
                    {item.location_name}
                  </Text>
                  <View className="flex-row text-base text-gray-300">
                    <Text>{item.date}</Text>
                    <Text> | </Text>
                    <Text>{item.status}</Text>
                  </View>
                </View>
                <View
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${item.status === "הצלחה" ? "bg-green-500" : "bg-red-500"}`}
                >
                  <AntDesign
                    name={item.status === "הצלחה" ? "check" : "close"}
                    color={"#fff"}
                  />
                </View>
              </Pressable>
            </Link>
          )}
          ListEmptyComponent={() => {
            return (
              <View className="h-full flex justify-center items-center">
                <Text className="text-lg">No items found</Text>
              </View>
            );
          }}
          ListFooterComponent={
            <Button
              title="Show more"
              color={"green"}
              onPress={() => {
                router.push({
                  pathname: "/(protected)/(tabs)/(wallet)/fullList",
                });
              }}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}
