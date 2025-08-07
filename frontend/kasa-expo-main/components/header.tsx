import { View, Text } from "react-native";

export const Header = () => {
  return (
    <View className="gap-1 flex items-center my-12 ">
      <Text className="text-4xl font-black text-center text-green-800">
        RecycleMate
      </Text>
      <Text className="text-3xl font-light text-center mb-4 text-green-600">
        Gamify Your Recycling
      </Text>
    </View>
  );
};
