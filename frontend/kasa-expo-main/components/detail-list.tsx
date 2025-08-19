import { View, Text, Button, FlatList } from "react-native";
import React from "react";

type DetailListProps = {
  data: any[];
  text: string;
  count?: number;
  buttonTitle?: string;
};

export const DetailList = ({
  data,
  text,
  count = 5,
  buttonTitle,
}: DetailListProps) => {

  console.log({roi_data:data})
  return (
    <View className="mx-4">
      <FlatList
        ListHeaderComponent={
          <Text className="w-full p-4 rounded-lg bg-white text-black">
            {text}
          </Text>
        }
        ListHeaderComponentStyle={{
          borderBottomColor: "#d1d5db",
          borderBottomWidth: 1,
        }}
        className="bg-white rounded-lg"
        data={data.slice(0, count)}
        renderItem={({ item }: { item: any }) => (
          <View className="px-4 py-2 border-b border-gray-100 flex-row">
            <View className="flex-grow">
              <View className="flex-row text-base text-gray-300">
                <Text>{item.name}</Text>
              </View>
            </View>
            <View
              className={`w-8 h-8 flex items-center justify-center rounded-full`}
            >
              <Text className="text-black">{item.quantity}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          buttonTitle ? (
            <Button
              title={buttonTitle}
              color={"green"}
              onPress={() => {
                console.log("Show more Screen");
              }}
            />
          ) : null
        }
      />
    </View>
  );
};
