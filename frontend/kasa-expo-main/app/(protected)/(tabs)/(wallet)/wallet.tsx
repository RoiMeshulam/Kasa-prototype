import {
  Button,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { transactions } from "../../../../utils/DUMMY_DATA";
import { Link } from "expo-router";
import { Header } from "@/components/header";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

export default function WalletScreen() {
  const [value, setValue] = useState("");

  return (
    <SafeAreaView>
      <Header />
      <View className="flex items-center gap-3 mb-12">
        <Text className="font-thin">Balance</Text>
        <Text className="text-6xl font-bold">138.30</Text>
      </View>
      <View className="mx-4">
        <FlatList
          ListHeaderComponent={
            <TextInput
              className="w-full p-4 rounded-lg bg-white text-black"
              autoCapitalize="none"
              value={value}
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
              onChangeText={setValue}
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
                  {/* <Text className="text-white">X</Text> */}
                  <AntDesign
                    name={item.status === "הצלחה" ? "check" : "close"}
                    color={"#fff"}
                  />
                </View>
              </Pressable>
            </Link>
          )}
          ListFooterComponent={
            <Button
              title="Show more"
              color={"green"}
              onPress={() => {
                console.log("Show more Screen");
              }}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}
