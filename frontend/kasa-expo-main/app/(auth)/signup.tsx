import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import CustomAlert from "@/components/ui/CustomAlert";
import axios from "axios";
import { InputField } from "@/components/ui/InputField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { formSchema, FormValues } from "@/utils/formSchema";
import { useTranslation } from "react-i18next";
import i18n from "@/localization/i18n";

const SOCKET_SERVER_URL = "http://10.0.0.8:8080";
// Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";
// Platform.OS === "android" ? "http://10.0.0.9:8080" : "http://localhost:8080"; // for emulator expo

const SignUpScreen = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const { values, errors, handleChange, validate, resetForm } =
    useFormValidation<FormValues>(formSchema, {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [alertData, setAlertData] = useState<{
    title: string;
    message: string;
    type?: "success" | "error";
  }>({
    title: "",
    message: "",
    type: undefined,
  });

  const showCustomAlert = (
    title: string,
    message: string,
    type: "success" | "error"
  ) => {
    setAlertData({ title, message, type });
    setAlertVisible(true);
  };

  const handleNewUserClick = async () => {
    try {
      setLoading(true);
      const isValid = await validate();

      if (isValid) {
        await axios.post(`${SOCKET_SERVER_URL}/api/users/signup`, {
          name: values.name,
          email: values.email,
          password: values.password,
          phoneNumber: values.phone,
        });
        console.log("good");

        showCustomAlert("הצלחה", "נרשמת בהצלחה!", "success");
      }
      setLoading(false);
    } catch (error: any) {
      console.log("bad");
      console.error("Registration error:", error);
      const msg =
        error?.response?.data?.message || "שגיאה בעת ניסיון הרשמה. נסה שוב";
      showCustomAlert("שגיאה", msg, "error");
      resetForm();
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-200 p-6">
      {/* 🔔 Custom Alert Modal */}
      <CustomAlert
        visible={alertVisible}
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        onClose={() => setAlertVisible(false)}
      />

      <View className="flex-1 justify-center">
        <View className="gap-3 mb-12">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-[90%] aspect-square rounded-[30px] self-center"
          />
          <Text className="text-4xl font-black text-center mb-4 text-green-800">
            Recycle.Earn.Impact
          </Text>
        </View>

        <Text
          className={`text-xl font-bold mb-4 text-black ${i18n.language === "he" && "self-end"}`}
        >
          {t("Create your account")}
        </Text>

        <View className="gap-1">
          <InputField
            text={t("User name")}
            value={values.name}
            placeholder="Enter your name"
            onChangeText={(v) => handleChange("name", v)}
            editable={!loading}
            validation={errors.name}
          />

          <InputField
            text={t("Phone")}
            value={values.phone}
            placeholder={t("Enter your phone number")}
            keyboardType="phone-pad"
            onChangeText={(v) => handleChange("phone", v)}
            editable={!loading}
            validation={errors.phone}
          />

          <InputField
            text={t("Email")}
            value={values.email}
            placeholder={t("Enter your email")}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(v) => handleChange("email", v)}
            editable={!loading}
            validation={errors.email}
          />

          <InputField
            text={t("Password")}
            value={values.password}
            placeholder={t("Enter password")}
            secureTextEntry
            onChangeText={(v) => handleChange("password", v)}
            editable={!loading}
            validation={errors.password}
          />

          <InputField
            text={t("Confirm Password")}
            value={values.confirmPassword}
            placeholder={t("Confirm Password")}
            secureTextEntry
            onChangeText={(v) => handleChange("confirmPassword", v)}
            editable={!loading}
            validation={errors.confirmPassword}
          />

          <TouchableOpacity
            className="w-full bg-green-600 p-4 rounded-lg mt-6"
            onPress={handleNewUserClick}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size={"small"} color={"#fff"} />
            ) : (
              <Text className="text-white text-center font-semibold">
                {t("Sign Up")}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View
          className={`${i18n.language === "he" ? "flex-row-reverse" : "flex-row"} justify-center items-center mt-6 gap-2`}
        >
          <Text className="text-gray-600">{t("Have an account?")}</Text>
          <Link href="/(auth)/login">
            <Text className="text-green-800 font-semibold ml-1">
              {t("Sign In")}
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
