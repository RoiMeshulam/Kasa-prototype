import i18n from "@/localization/i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

type InfoCardProps = {
  amount: string;
  title: string;
  money?: boolean;
};

const InfoCard = ({ amount, title, money = false }: InfoCardProps) => {
  const { t } = useTranslation();

  return (
    <View
      className="gap-y-2"
      // className="flex-1 bg-white py-2 px-3 rounded-lg justify-center items-center gap-2 w-full"
    >
      <View
        className={`${i18n.language === "he" ? "flex-row-reverse" : "flex-row"} gap-x-1 items-end`}
      >
        <Text className="text-6xl font-bold">{amount}</Text>
        <Text
          className={`text-2xl font-bold ${money ? "text-green-600" : "text-blue-400"} mb-1`}
        >
          {money ? "$" : t("Bottels")}
        </Text>
      </View>
      <Text className="text-lg text-center">{title}</Text>
    </View>
  );
};

export default InfoCard;
