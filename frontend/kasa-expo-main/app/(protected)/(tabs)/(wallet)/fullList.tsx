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

  // Get language direction
  const isRTL = i18n.dir() === 'rtl';

  const filteredSessions = userSessions
  .filter((session: any) => {
    const searchLower = value.toLowerCase();
    return (
      session.machineName.toLowerCase().includes(searchLower) ||
      session.status.toLowerCase().includes(searchLower)
      // אפשר להוסיף עוד שדות אם רוצים לחפש לפי כל דבר
    );
  })
  .slice(0, 5); // אם אתה רוצה להגביל ל־5



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
      data={filteredSessions}
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
              className={`px-4 py-2 border-b border-gray-100 flex-row`}
            >
              {isRTL && (
                <View
                  className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${item.status === "closed" ? "bg-green-500" : "bg-red-500"}`}
                >
                  <AntDesign
                    name={item.status === "closed" ? "check" : "close"}
                    color={"#fff"}
                  />
                </View>
              )}
              <View
                className={`flex-grow ${isRTL ? 'items-end' : 'items-start'}`}
              >
                <Text className={`font-semibold text-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  {item.machineName}
                </Text>
      
                <View className={`flex-row text-base text-gray-300 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Text>{formatted.date}</Text>
                  <Text> | </Text>
                  <Text>{formatted.time}</Text>
                  <Text> | </Text>
                  <Text>{item.status}</Text>
                </View>
              </View>
              {!isRTL && (
                <View
                  className={`w-8 h-8 flex items-center justify-center rounded-full ml-3 ${item.status === "closed" ? "bg-green-500" : "bg-red-500"}`}
                >
                  <AntDesign
                    name={item.status === "closed" ? "check" : "close"}
                    color={"#fff"}
                  />
                </View>
              )}
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
