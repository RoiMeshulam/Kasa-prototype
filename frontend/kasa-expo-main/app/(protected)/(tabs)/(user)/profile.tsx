import { Header } from "@/components/header";
import { users } from "@/utils/DUMMY_DATA";
import { Link } from "expo-router";
import React, { useState } from "react";
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
import { signOutUser } from "@/services/firebaseService";
import { useRouter } from "expo-router";
import CustomAlert from "@/components/ui/CustomAlert";

const ProfileScreen = () => {
  const { userInfo, userMonthlySummary, logout } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const [isTogglingLanguage, setIsTogglingLanguage] = useState(false);
  const router = useRouter();
  
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{
    title: string;
    message: string;
    type: "success" | "error" | undefined;
  }>({
    title: "",
    message: "",
    type: undefined,
  });

  const showCustomAlert = (
    title: string,
    message: string,
    type: "success" | "error"
  ) => {
    setAlertData({ title, message, type });
    setAlertVisible(true);
  };

  const handleLogout = async () => {
    Alert.alert(
      t("Logout"),
      t("Are you sure you want to logout?"),
      [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        {
          text: t("Logout"),
          style: "destructive",
          onPress: async () => {
            logout();
            await signOutUser(showCustomAlert, router);
          },
        },
      ]
    );
  };

  const onToggle = async () => {
    if (isTogglingLanguage) return;

    try {
      setIsTogglingLanguage(true);
      await toggleLanguage();
    } catch (error) {
      console.error("Error toggling language:", error);
      Alert.alert(t("Error"), t("Failed to change language"));
    } finally {
      setIsTogglingLanguage(false);
    }
  };

  console.log(userMonthlySummary);
  return (
    <SafeAreaView className="mx-4 gap-y-1 flex">
      <CustomAlert
        visible={alertVisible}
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        onClose={() => setAlertVisible(false)}
      />
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
            className={`flex-row text-base text-gray-300 p-1 gap-x-1`}
          >
            <Text className="font-semibold">{t("User name")}:</Text>
            <Text>{userInfo?.name}</Text>
          </View>
          <View
            className={`flex-row text-base text-gray-300 p-1 gap-x-1`}
          >
            <Text className="font-semibold">{t("Email")}:</Text>
            <Text>{userInfo?.email}</Text>
          </View>
          <View
            className={`flex-row text-base text-gray-300 p-1 gap-x-1`}
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
              ₪{(Number(userInfo?.balance) || 0).toFixed(2)}
            </Text>
            <Text className="text-white text-center">{t("Balance")}</Text>
          </View>
          <View className="w-[48%] aspect-square bg-green-500 rounded-lg items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-white">
              ₪{(Number(userMonthlySummary?.totalBalance) || 0).toFixed(2)}
            </Text>
            <Text className="text-white text-center">{t("Balance this month")}</Text>
          </View>
          <View className="w-[48%] aspect-square bg-green-500 rounded-lg items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-white">
              {(Number(userMonthlySummary?.bottlesCount) || 0).toFixed(2)}
            </Text>
            <Text className="text-white text-center">{t("Total bottles recycled this month")}</Text>
          </View>
          <View className="w-[48%] aspect-square bg-green-500 rounded-lg items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-white">
              {(Number(userMonthlySummary?.allTimeBottlesCount) || 0).toFixed(2)}
            </Text>
            <Text className="text-white text-center">{t("Total bottles recycled")}</Text>
          </View>
          <View className="w-full gap-y-4 mt-4">
            <TouchableOpacity
              className={`w-full bg-transparent p-4 rounded-lg border-blue-600 border ${isTogglingLanguage ? "opacity-50" : ""}`}
              onPress={onToggle}
              disabled={isTogglingLanguage}
            >
              <Text className="text-blue-800 text-center font-semibold">
                {isTogglingLanguage
                  ? t("Changing language...")
                  : `${t("Language")}: ${
                      i18n.language === "he" ? t("Hebrew") : t("English")
                    }`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full bg-red-500 p-4 rounded-lg"
              onPress={handleLogout}
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
