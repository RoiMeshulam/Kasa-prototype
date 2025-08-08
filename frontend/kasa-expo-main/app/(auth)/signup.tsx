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

const SOCKET_SERVER_URL = "http://10.0.0.9:8080";
// Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";
// Platform.OS === "android" ? "http://10.0.0.9:8080" : "http://localhost:8080"; // for emulator expo

const SignUpScreen = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState<{
    title: string;
    message: string;
    type?: "success" | "error";
  }>({
    title: "",
    message: "",
    type: undefined,
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const showCustomAlert = (
    title: string,
    message: string,
    type: "success" | "error"
  ) => {
    setAlertData({ title, message, type });
    setAlertVisible(true);
  };

  const resetForm = () => {
    setNewUser({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    });
  };

  const handleNewUserClick = async () => {
    setLoading(true);
    const { name, email, password, confirmPassword, phoneNumber } = newUser;

    if (!name || !email || !password || !confirmPassword) {
      showCustomAlert("שגיאה", "אנא מלא את כל השדות הנדרשים", "error");
      return;
    }

    if (password !== confirmPassword) {
      showCustomAlert("שגיאה", "הסיסמאות לא תואמות", "error");
      return;
    }

    try {
      await axios.post(`${SOCKET_SERVER_URL}/api/users/signup`, {
        name,
        email,
        password,
        phoneNumber,
      });
      console.log("good");

      showCustomAlert("הצלחה", "נרשמת בהצלחה!", "success");
      resetForm();
      setLoading(false);
    } catch (error: any) {
      console.log("bad");
      console.error("Registration error:", error);
      const msg =
        error?.response?.data?.message || "שגיאה בעת ניסיון הרשמה. נסה שוב";
      showCustomAlert("שגיאה", msg, "error");
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
            value={newUser.name}
            placeholder="Enter your name"
            onChangeText={(text: any) =>
              setNewUser((prev) => ({ ...prev, name: text }))
            }
            editable={!loading}
          />

          <InputField
            text="Phone Number"
            value={newUser.phoneNumber}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            onChangeText={(text) =>
              setNewUser((prev) => ({ ...prev, phoneNumber: text }))
            }
            editable={!loading}
          />

          <InputField
            text="Email"
            value={newUser.email}
            placeholder="Enter email"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(text) =>
              setNewUser((prev) => ({ ...prev, email: text }))
            }
            editable={!loading}
          />

          <InputField
            text="Password"
            value={newUser.password}
            placeholder="Enter password"
            secureTextEntry
            onChangeText={(text) =>
              setNewUser((prev) => ({ ...prev, password: text }))
            }
            editable={!loading}
          />

          <InputField
            text="Confirm Password"
            value={newUser.confirmPassword}
            placeholder="Confirm password"
            secureTextEntry
            onChangeText={(text) =>
              setNewUser((prev) => ({ ...prev, confirmPassword: text }))
            }
            editable={!loading}
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
