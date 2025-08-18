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
import { useTranslation } from "react-i18next";

export default function WalletScreen() {
  const [value, setValue] = useState("");
  const router = useRouter();
  const { userInfo } = useGlobalContext();
  const { t, i18n } = useTranslation();

  const filteredData = transactions.filter((item) =>
    item.location_name.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <SafeAreaView className="bg-gray-100 h-full">
      <Header />
      <View className="flex items-center gap-3 mb-12">
        <Text className="font-thin">{t("Balance")}</Text>
        <View className="flex-row items-end">
          <Text className="text-lg text-green-600">$</Text>
          <Text className="text-6xl font-bold">
            {Number(userInfo?.balance).toFixed(2)}
          </Text>
        </View>
      </View>
      <View className="mx-4 shadow-md android:shadow-black android:shadow-2xl">
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
          data={filteredData.slice(0, 5)}
          renderItem={({ item }: { item: any }) => (
            <Link
              href={{
                pathname: "/(protected)/(tabs)/(wallet)/[walletItem]",
                params: item,
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
              <View className="flex-1 h-full flex justify-center items-center">
                <Text className="text-lg p-4">{t("No items found")}</Text>
              </View>
            );
          }}
          ListFooterComponent={
            <Button
              title={t("Show more")}
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
