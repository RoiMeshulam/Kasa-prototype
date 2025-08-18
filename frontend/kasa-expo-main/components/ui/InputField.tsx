import { View, Text, TextInput, TextInputProps, Platform } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type InputFieldProps = TextInputProps & {
  text?: string;
  icon?: React.ReactNode;
  validation?: string;
  search?: boolean;
};

export const InputField = React.memo(
  ({ text, icon, validation, search = false, ...props }: InputFieldProps) => {
    const { i18n } = useTranslation();
    return (
      <View
        className={`my-2 gap-y-1 ${!search && "shadow-sm"} ${i18n.language === "he" && "items-end mr-2"}`}
      >
        {text && <Text className="text-sm font-medium text-black">{text}</Text>}
        <View
          className={`w-full ${i18n.language === "he" ? "flex-row-reverse" : "flex-row"} android:p-1 ios:p-4 border border-transparent focus:border-green-300 rounded-lg bg-white items-center`}
        >
          <View className="mr-2">{icon}</View>
          <TextInput
            className={`${i18n.language === "he" && "text-right mr-2"} flex-grow`}
            autoCapitalize="none"
            style={{
              writingDirection: i18n.language === "he" ? "rtl" : "ltr",
            }}
            {...props}
          />
        </View>
        {validation && (
          <Text className={`text-xs text-red-500`}>{validation}</Text>
        )}
      </View>
    );
  }
);
