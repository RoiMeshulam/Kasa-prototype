import { View, Text, TextInput, TextInputProps } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

type InputFieldProps = TextInputProps & {
  text?: string;
  icon?: React.ReactNode;
  validation?: string;
};

export const InputField = React.memo(
  ({ text, icon, validation, ...props }: InputFieldProps) => {
    return (
      <View className="my-2 gap-y-1">
        {text && <Text className="text-sm font-medium text-black">{text}</Text>}
        <View className="w-full flex-row p-4 border border-transparent focus:border-green-300 rounded-lg bg-white ">
          <View className="mr-2">{icon}</View>
          <TextInput className="flex-grow" autoCapitalize="none" {...props} />
        </View>
        {validation && (
          <Text className="text-xs text-red-500">{validation}</Text>
        )}
      </View>
    );
  }
);
