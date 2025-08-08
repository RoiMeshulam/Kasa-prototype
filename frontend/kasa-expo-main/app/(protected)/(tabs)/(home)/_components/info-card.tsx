import React from "react";
import { Text, View } from "react-native";

type InfoCardProps = {
  amount: string;
  title: string;
  money?: boolean;
};

const InfoCard = ({ amount, title, money = false }: InfoCardProps) => {
  return (
    <View
      className="gap-y-2"
      // className="flex-1 bg-white py-2 px-3 rounded-lg justify-center items-center gap-2 w-full"
    >
      <Text className="text-4xl font-bold">
        {amount} {money ? "$" : "Bottels"}
      </Text>
      <Text className="text-md">{title}</Text>
    </View>
  );
};

export default InfoCard;
