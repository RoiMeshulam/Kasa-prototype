import { View, Text, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { InputField } from "@/components/ui/InputField";
import { transactions } from "@/utils/DUMMY_DATA";

const FullListScreen = () => {
  const [value, setValue] = useState("");
  const [filteredData, setFilteredData] = useState(transactions);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const results = transactions.filter((item) =>
        item.location_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(results);
    }, 300);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
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
      data={filteredData}
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
    />
  );
};

export default FullListScreen;
