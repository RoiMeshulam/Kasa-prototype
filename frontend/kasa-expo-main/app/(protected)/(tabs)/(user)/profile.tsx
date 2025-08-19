import { Header } from "@/components/header";
import { users } from "@/utils/DUMMY_DATA";
import { Link } from "expo-router";
import React from "react";
import {
  Alert,
  I18nManager,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useGlobalContext } from "@/store/globalContext";
import { useTranslation } from "react-i18next";
import { toggleLanguage } from "@/localization/i18n";

const ProfileScreen = () => {
  const { userInfo, userMonthlySummary } = useGlobalContext();
  const { t, i18n } = useTranslation();

  const onToggle = async () => {
    await toggleLanguage();
    // Expo Go may hot-reload. In standalone apps you might need to reload manually.
  };

  console.log(userMonthlySummary);
  return (
    <SafeAreaView className="mx-4 gap-y-1 flex">
      <Header />
      <View className={`bg-white rounded-lg shadow-sm `}>
        <View
          className={`"w-full flex-row justify-between p-4 text-black border-b border-gray-300"`}
        >
          <Text>{t("User details")}</Text>
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
          <View
            className={`flex-row text-base text-gray-300 p-1 gap-x-1 ${i18n.language === "he" ? "flex-row-reverse" : ""}`}
          >
            <Text className="font-semibold">{t("User name")}:</Text>
            <Text>{userInfo?.name}</Text>
          </View>
          <View
            className={`flex-row text-base text-gray-300 p-1 gap-x-1 ${i18n.language === "he" ? "flex-row-reverse" : ""}`}
          >
            <Text className="font-semibold">{t("Email")}:</Text>
            <Text>{userInfo?.email}</Text>
          </View>
          <View
            className={`flex-row text-base text-gray-300 p-1 gap-x-1 ${i18n.language === "he" ? "flex-row-reverse" : ""}`}
          >
            <Text className="font-semibold">{t("Phone")}:</Text>
            <Text>{userInfo?.phoneNumber}</Text>
          </View>
        </View>
      </View>

      <View className="flex items-center justify-center bg-gray-100 mt-5">
        <View className="w-full flex-row flex-wrap justify-between">
          <View className="w-[48%] aspect-square bg-green-500 rounded-lg items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-white">
              {userInfo?.balance}
            </Text>
            <Text className="text-white text-center">Balance</Text>
          </View>
          <View className="w-[48%] aspect-square bg-green-500 rounded-lg items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-white">
              {userMonthlySummary?.totalBalance}
            </Text>
            <Text className="text-white text-center">Balance this month</Text>
          </View>
          <View className="w-[48%] aspect-square bg-green-500 rounded-lg items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-white">
              {userMonthlySummary?.bottlesCount}
            </Text>
            <Text className="text-white text-center">Total bottles recycled this month</Text>
            
          </View>
          <View className="w-[48%] aspect-square bg-green-500 rounded-lg items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-white">
              {userMonthlySummary?.allTimeBottlesCount}
            </Text>
            <Text className="text-white text-center">Total bottles recycled</Text>
          </View>
          <View className="w-full gap-y-4 mt-4">
            <TouchableOpacity
              className="w-full bg-transparent p-4 rounded-lg border-blue-600 border"
              onPress={onToggle}
            >
              <Text className="text-blue-800 text-center font-semibold">
                {t("Language")}:{" "}
                {i18n.language === "he" ? t("Hebrew") : t("English")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full bg-red-500 p-4 rounded-lg"
              onPress={() => {
                console.log("Logout");
              }}
            >
              <Text className="text-white text-center font-semibold">
                {t("Logout")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
