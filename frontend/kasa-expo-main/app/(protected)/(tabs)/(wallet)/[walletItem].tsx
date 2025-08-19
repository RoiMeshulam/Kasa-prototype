import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Button,
  FlatList,
} from "react-native";
import React from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { bottles_detailed } from "@/utils/DUMMY_DATA";
import { DetailList } from "@/components/detail-list";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "@/store/globalContext";
import { formatDateTime } from "@/utils/formatDate";

const WalletDetailScreen = () => {
  const params = useLocalSearchParams();
  const { t, i18n } = useTranslation();

  
 
  const session = params.walletItem ? JSON.parse(params.walletItem as string) : null;
  const { date, time } = formatDateTime(session.endedAtISO);
  console.log({session:session});
  console.log({paramsWallet:params.walletItem});
  console.log(JSON.stringify(session, null, 2));

  
  

  return (
    <SafeAreaView style={{paddingTop:20}}>
      <Link href=".." dismissTo asChild>
        <Pressable className="m-3">
          <Ionicons name="close-circle" size={48} />
        </Pressable>
      </Link>
      <View className="flex gap-10 mt-5">
        <Text className="font-semibold text-2xl self-center">
          {session.machineName}
        </Text>
        <View className="flex items-center gap-3 mb-10">
          <Text className="font-thin">{t("Accumulated")}</Text>
          <Text className="text-6xl font-bold">138.30</Text>
        </View>

        <DetailList data={session.bottles ? Object.values(session.bottles) : []} text={`${t("Details")}:`} count={session.bottles ? Object.keys(session.bottles).length : 0}/>

        <View className="mx-8 gap-y-4">
          <View className="flex-row justify-between">
            <Text>{t("Status")}</Text>
            <Text>{session.status}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text>{t("Date")}</Text>
            <Text>{date}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text>{t("Time")}</Text>
            <Text>{time}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WalletDetailScreen;
