import { InputField } from "@/components/ui/InputField";
import { useFormValidation } from "@/hooks/useFormValidation";
import i18n from "@/localization/i18n";
import { useGlobalContext } from "@/store/globalContext";
import { ProfileFormValues, profileSchema } from "@/utils/profileSchema";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { updateUser } from "@/services/apiServices";

const EditProfileScreen = () => {
  const { userInfo, setUserInfo } = useGlobalContext();
  const { t } = useTranslation();
  const { values, errors, handleChange, validate, resetForm } =
    useFormValidation<ProfileFormValues>(profileSchema, {
      name: userInfo?.name as string,
      phone: userInfo?.phoneNumber as string,
      email: userInfo?.email as string,
    });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const isValid = await validate();
      if (!isValid) {
        setLoading(false);
        return;
      }
  
      if (!userInfo?.uid) {
        throw new Error("User ID missing");
      }
  
      // 🔹 שליחת הבקשה לשרת
      const updatedUser = await updateUser(userInfo.uid, {
        name: values.name,
        email: values.email,
        phoneNumber: values.phone,
      });
  
      // 🔹 עדכון ה-GlobalContext עם המידע המוחזר מהשרת
      setUserInfo({
        uid: userInfo.uid,
        balance: updatedUser.balance, // אם השרת מחזיר balance
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
      });
  
      console.log("✅ User updated:", updatedUser);
      setLoading(false);
    } catch (error: any) {
      console.error("❌ Error updating user:", error);
      alert(error.response?.data?.error || error.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="mx-4">
      <Text
        className={`text-xl font-bold text-start my-8 text-black ${i18n.language === "he" && "self-end"}`}
      >
        {t("Edit your user details")}
      </Text>

      <View className="gap-4">
        <InputField
          text={t("User name")}
          autoCapitalize="none"
          value={values.name}
          placeholder={t("Enter your username")}
          placeholderTextColor="#9CA3AF"
          onChangeText={(v) => handleChange("name", v)}
          validation={errors.name}
        />
        <InputField
          text={t("Email")}
          autoCapitalize="none"
          value={values.email}
          placeholder={t("Enter your email")}
          placeholderTextColor="#9CA3AF"
          onChangeText={(v) => handleChange("email", v)}
          keyboardType="email-address"
          validation={errors.email}
          // style={{textAlign:'right'}}
        />
        <InputField
          text={t("Phone")}
          autoCapitalize="none"
          value={values.phone}
          placeholder={t("Enter your phone number")}
          placeholderTextColor="#9CA3AF"
          // style={{textAlign:'right'}}
          onChangeText={(v) => handleChange("phone", v)}
          keyboardType="phone-pad"
          validation={errors.phone}
        />

        <TouchableOpacity
          className="w-full bg-transparent p-4 rounded-lg mt-6 border-green-600 border"
          onPress={handleSubmit}
        >
          {loading ? (
            <ActivityIndicator size={"small"} color={"#fff"} />
          ) : (
            <Text className="text-green-800 text-center font-semibold">
              {t("Update")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
