import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useGlobalContext } from "@/store/globalContext";
import { useRouter, Link } from "expo-router";
import { signInWithEmail, signInWithGoogle } from "@/services/firebaseService";
import CustomAlert from "@/components/ui/CustomAlert";
import { InputField } from "@/components/ui/InputField";
import { AntDesign } from "@expo/vector-icons";
import { LoginFormValues, loginSchema } from "@/utils/loginSchema";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useTranslation } from "react-i18next";
import i18n from "@/localization/i18n";

const SignInScreen = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUserInfo, setIsConnected, isInitializing, userInfo, isConnected } = useGlobalContext();
  const { t } = useTranslation();

  const { values, errors, handleChange, validate, resetForm } =
    useFormValidation<LoginFormValues>(loginSchema, {
      email: "",
      password: "",
    });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{
    title: string;
    message: string;
    type: "success" | "error" | undefined;
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

  // 🔄 ניווט אוטומטי אם המשתמש כבר מחובר
  useEffect(() => {
    console.log("🏠 Login screen useEffect triggered");
    console.log("🏠 isInitializing:", isInitializing);
    console.log("🏠 userInfo exists:", !!userInfo);
    console.log("🏠 isConnected:", isConnected);
    
    if (!isInitializing && userInfo && isConnected) {
      console.log("🏠 User already logged in, navigating to home");
      router.replace("/(protected)/(tabs)/(home)");
    } else if (!isInitializing) {
      console.log("🏠 User not logged in, staying on login screen");
    }
  }, [isInitializing, userInfo, isConnected, router]);

  // 📺 הצגת מסך טעינה במהלך הבדיקה הראשונית
  if (isInitializing) {
    console.log("⏳ Showing loading screen - initializing...");
    return (
      <View className="flex-1 justify-center items-center bg-gray-200">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="mt-4 text-gray-600">{t("Loading...")}</Text>
      </View>
    );
  }

  const handleLogin = async () => {
    try {
      setLoading(true);
      const isValid = await validate();

      if (isValid) {
        console.log(" i am in handle login");
        console.log(values);

        await signInWithEmail(
          values.email,
          values.password,
          setUserInfo,
          setIsConnected,
          showCustomAlert,
          router
        );
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      resetForm();
      setLoading(false);
      return <View className="flex-1 justify-center items-center">Error</View>;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      console.log("🔐 Starting Google login...");
      
      await signInWithGoogle(
        setUserInfo,
        setIsConnected,
        showCustomAlert,
        router
      );
      
      setLoading(false);
    } catch (error) {
      console.error("❌ Google login error:", error);
      setLoading(false);
      showCustomAlert("שגיאה", "שגיאה בהתחברות עם Google. נסה שוב.", "error");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 bg-gray-200"
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          contentInsetAdjustmentBehavior="always"
        >
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
              className={`text-xl font-bold mb-4 text-black`}
            >
              {t("Login with your account")}
            </Text>

            <InputField
              text={t("Email Address")}
              value={values.email}
              placeholder={t("Enter your email")}
              onChangeText={(v) => handleChange("email", v)}
              icon={<AntDesign name="user" color={"#32a852"} size={24} />}
              keyboardType="email-address"
              editable={!loading}
              validation={errors.email}
            />

            <InputField
              text={t("Password")}
              value={values.password}
              placeholder={t("Enter password")}
              secureTextEntry
              onChangeText={(v) => handleChange("password", v)}
              icon={<AntDesign name="lock" color={"#32a852"} size={24} />}
              editable={!loading}
              validation={errors.password}
            />

            <TouchableOpacity
              className="w-full bg-green-600 p-4 rounded-lg mt-6"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size={"small"} color={"#fff"} />
              ) : (
                <Text className="text-white text-center font-semibold">
                  {t("Sign In")}
                </Text>
              )}
            </TouchableOpacity>

            {/* Google Sign-In Button */}
            <View className="flex-row items-center mt-6 mb-4">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500">{t("או")}</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            <TouchableOpacity
              className="w-full bg-white border border-gray-300 p-4 rounded-lg flex-row items-center justify-center"
              onPress={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size={"small"} color={"#4285f4"} />
              ) : (
                <>
                  <AntDesign name="google" size={20} color="#4285f4" style={{ marginRight: 8 }} />
                  <Text className="text-gray-700 font-semibold">
                    {t("Continue with Google")}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View
              className={`"flex-row" justify-center items-center mt-6 gap-2`}
            >
              <Text className="text-gray-600">{t("Don't have an account?")}</Text>
              <Link href="/(auth)/signup">
                <Text className="text-green-800 font-semibold ml-1">
                  {t("Sign Up")}
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;