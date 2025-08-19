import { View, Text, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { InputField } from "@/components/ui/InputField";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "@/store/globalContext";
import { formatDateTime } from "@/utils/formatDate";

const FullListScreen = () => {
  const [value, setValue] = useState("");
  const { userSessions } = useGlobalContext();
  const { t, i18n } = useTranslation();



  return (
    <FlatList
      ListHeaderComponent={
        <InputField
          autoCapitalize="none"
          value={value}
          placeholder={t("Search")}
          placeholderTextColor="#9CA3AF"
          onChangeText={setValue}
          icon={<AntDesign name="search1" size={24} />}
          search
        />
      }
      ListHeaderComponentStyle={{
        borderBottomColor: "#d1d5db",
        borderBottomWidth: 1,
      }}
      className="bg-white rounded-lg"
      data={userSessions}
      renderItem={({ item }: { item: any }) => {
        const formatted = formatDateTime(item.endedAtISO); // <-- כאן הפורמט לכל פריט
      
        return (
          <Link
            href={{
              pathname: "/(protected)/(tabs)/(wallet)/[walletItem]",
              params: {
                walletItem: JSON.stringify(item),
              }
            }}
            asChild
          >
            <Pressable
              className={`px-4 py-2 border-b border-gray-100 ${i18n.language === "he" ? "flex-row-reverse" : "flex-row"}`}
            >
              <View
                className={`flex-grow ${i18n.language === "he" && "items-end"}`}
              >
                <Text className="font-semibold text-xl">
                  {item.machineName}
                </Text>
      
                <View className="flex-row text-base text-gray-300">
                  <Text>{formatted.date}</Text>
                  <Text> | </Text>
                  <Text>{formatted.time}</Text>
                  <Text> | </Text>
                  <Text>{item.status}</Text>
                </View>
              </View>
      
              <View
                className={`w-8 h-8 flex items-center justify-center rounded-full ${item.status === "closed" ? "bg-green-500" : "bg-red-500"}`}
              >
                <AntDesign
                  name={item.status === "closed" ? "check" : "close"}
                  color={"#fff"}
                />
              </View>
            </Pressable>
          </Link>
        );
      }}
      ListEmptyComponent={() => {
        return (
          <View className="h-full flex justify-center items-center">
            <Text className="text-lg">{t("No items found")}</Text>
          </View>
        );
      }}
    />
  );
};

export default FullListScreen;
