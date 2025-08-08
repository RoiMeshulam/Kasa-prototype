import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Link } from "expo-router";
import { users } from "../../../../utils/DUMMY_DATA";
import InfoCard from "./_components/info-card";
import { AntDesign } from "@expo/vector-icons";
import { useGlobalContext } from "@/store/globalContext";

export default function HomeScreen() {
  const { userInfo } = useGlobalContext();

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <ScrollView>
        <View className=" gap-8 mt-10 mx-4">
          <Text className="text-4xl font-black text-center mb-4 text-green-800">
            Recycle.Earn.Impact
          </Text>

          <Text className="text-3xl text-black/90 font-light mb-3">{`Welcome, ${userInfo?.name}`}</Text>
          <View className="flex items-center justify-center">
            <View className="w-full flex-row flex-nowrap justify-between">
              <View className="w-[48%] aspect-square bg-white rounded-xl items-center justify-center">
                <InfoCard
                  amount={users[0].bottles_total.toString()}
                  title={"Recycied This Mounth"}
                />
              </View>
              <View className="w-[48%] aspect-square bg-white rounded-xl items-center justify-center">
                <InfoCard
                  amount={Number(userInfo?.balance).toFixed(2)}
                  title={"Total Earned"}
                  money
                />
              </View>
            </View>
          </View>
          <Link
            href={"/(protected)/(tabs)/(home)/scanner"}
            className="bg-green-500 rounded-md py-8 items-center justify-center"
            asChild
          >
            <Pressable className="flex-row gap-x-2">
              <AntDesign name="scan1" size={20} color={"#fff"} />
              <Text className="text-xl text-white font-bold">Scan Bottle</Text>
            </Pressable>
          </Link>

          <Link href={"/map"} asChild>
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
