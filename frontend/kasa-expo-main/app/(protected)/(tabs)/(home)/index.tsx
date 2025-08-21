import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Link } from "expo-router";
import InfoCard from "./_components/info-card";
import { AntDesign } from "@expo/vector-icons";
import { useGlobalContext } from "@/store/globalContext";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const { userInfo, userMonthlySummary } = useGlobalContext();
  const { t, i18n } = useTranslation();

  console.log({ userMonthlySummary: userMonthlySummary });
  console.log({ userInfo: userInfo });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        <View className=" gap-8 mt-10 mx-4 android:mt-20">
          <Text className="text-4xl font-black text-center mb-4 text-green-800">
            Recycle.Earn.Impact
          </Text>

          <View
            className={`flex-row gap-x-2 shadow-sm`}
          >
            <Text className="text-3xl text-green-600 font-light mb-3">{`${t("Welcome")},`}</Text>
            <Text className="text-3xl text-black/90 font-extralight mb-3">{`${userInfo?.name}`}</Text>
          </View>

          <View className="flex items-center justify-center">
            <View className="w-full flex-row flex-nowrap justify-between">
              <View className="w-[48%] aspect-square bg-white rounded-xl items-center justify-center border border-gray-400 ">
                <InfoCard
                  amount={(userMonthlySummary?.bottlesCount ?? 0).toString()}
                  title={t("Recycled This Month")}
                />
              </View>
              <View className="w-[48%] aspect-square bg-white rounded-xl items-center justify-center border border-gray-400">
                <InfoCard
                  amount={Number(userInfo?.balance).toFixed(2)}
                  title={t("Total Earned")}
                  money
                />
              </View>
            </View>
          </View>
          <Link
            href={"/(protected)/(tabs)/(home)/scannerScreen"}
            className="bg-green-500 rounded-md py-4 text-center shadow-lg android:shadow-black"
            asChild
          >
            <Pressable className="flex-row gap-x-2 justify-center items-center">
              <AntDesign name="scan1" size={20} color={"#fff"} />
              <Text className="text-xl text-white font-bold">
                {t("Scan Bottle")}
              </Text>
            </Pressable>
          </Link>

          <Link href={"/map"} asChild className="shadow-sm">
            <Pressable>
              <Image
                source={require("../../../../assets/images/map.png")}
                className="w-full rounded-[30px] self-center border-2 border-white"
              />
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
