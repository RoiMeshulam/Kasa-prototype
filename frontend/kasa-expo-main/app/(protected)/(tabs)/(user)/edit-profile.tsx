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
import { updateUserProfile } from "@/services/userServices";
import CustomAlert from "@/components/ui/CustomAlert";

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

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{
    title: string;
    message: string;
    type?: "success" | "error";
  }>({
    title: "",
    message: "",
    type: undefined,
  });

  const showAlert = (title: string, message: string, type: "success" | "error") => {
    setAlertData({ title, message, type });
    setAlertVisible(true);
  };

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
  
      const updatedUserResponse = await updateUserProfile(userInfo.uid, {
        name: values.name,
        email: values.email,
        phoneNumber: values.phone,
      });
      
      // ✅ קח את הנתונים מה־data
      const updatedUser = updatedUserResponse.data;
      // 🔹 עדכון ה-GlobalContext עם המידע המוחזר מהשרת
      setUserInfo({
        ...userInfo,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        balance: updatedUser.balance ?? userInfo.balance,
      });
  
      showAlert(
        t("Success"),
        t("Profile updated successfully"),
        "success"
      );
      setLoading(false);
    } catch (error: any) {
      showAlert(
        "שגיאה", // או t("Error") אם אתה רוצה תרגום
        error.response?.data?.error || error.message,
        "error"
      );
    
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="mx-4">
      <Text
        className={`text-xl font-bold text-start my-8 text-black`}
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
      <CustomAlert
          visible={alertVisible}
          title={alertData.title}
          message={alertData.message}
          type={alertData.type}
          onClose={() => setAlertVisible(false)}
        />
    </SafeAreaView>
  );
};

export default EditProfileScreen;
