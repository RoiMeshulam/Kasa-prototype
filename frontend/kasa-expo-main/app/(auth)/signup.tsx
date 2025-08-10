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

const SOCKET_SERVER_URL = "http://10.0.0.9:8080";
// Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";
// Platform.OS === "android" ? "http://10.0.0.9:8080" : "http://localhost:8080"; // for emulator expo

const SignUpScreen = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

        <Text className="text-xl font-bold text-start mb-4 text-black">
          Create your account
        </Text>

        <View className="gap-4">
          <InputField
            text="Name"
            value={values.name}
            placeholder="Enter your name"
            onChangeText={(v) => handleChange("name", v)}
            editable={!loading}
            validation={errors.name}
          />

          <InputField
            text="Phone Number"
            value={values.phone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            onChangeText={(v) => handleChange("phone", v)}
            editable={!loading}
            validation={errors.phone}
          />

          <InputField
            text="Email"
            value={values.email}
            placeholder="Enter email"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(v) => handleChange("email", v)}
            editable={!loading}
            validation={errors.email}
          />

          <InputField
            text="Password"
            value={values.password}
            placeholder="Enter password"
            secureTextEntry
            onChangeText={(v) => handleChange("password", v)}
            editable={!loading}
            validation={errors.password}
          />

          <InputField
            text="Confirm Password"
            value={values.confirmPassword}
            placeholder="Confirm password"
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
                Sign Up
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center items-center mt-6 gap-2">
          <Text className="text-gray-600">Have an account?</Text>
          <Link href="/(auth)/login">
            <Text className="text-green-800 font-semibold ml-1">Sign in</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
