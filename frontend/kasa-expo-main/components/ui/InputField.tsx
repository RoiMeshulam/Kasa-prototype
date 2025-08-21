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
    const isRTL = i18n.language === "he";
    
    return (
      <View
        className={`my-2 gap-y-1 ${!search && "shadow-sm"}`}
      >
        {text && <Text className="text-sm font-medium text-black">{text}</Text>}
        <View
          className={`w-full flex-row android:p-1 ios:p-4 border border-transparent focus:border-green-300 rounded-lg bg-white items-center ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <View className={isRTL ? "ml-2" : "mr-2"}>{icon}</View>
          <TextInput
            className={`flex-grow`}
            autoCapitalize="none"
            style={{
              writingDirection: isRTL ? "rtl" : "ltr",
              textAlign: isRTL ? "right" : "left",
            }}
            {...props}
          />
        </View>
        {validation && (
          <Text className={`text-xs text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{validation}</Text>
        )}
      </View>
    );
  }
);
