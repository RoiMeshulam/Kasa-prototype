import { InputField } from "@/components/ui/InputField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useGlobalContext } from "@/store/globalContext";
import { ProfileFormValues, profileSchema } from "@/utils/profileSchema";
import { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const EditProfileScreen = () => {
  const { userInfo, setUserInfo } = useGlobalContext();
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
      if (isValid) {
        console.log("Success", "Form submitted!");
        setUserInfo({
          uid: userInfo?.uid as string,
          balance: userInfo?.balance as string,
          email: values.email,
          phoneNumber: values.phone,
          name: values.name,
        });
      }
      setLoading(false);
    } catch (error) {
      // resetForm();
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="mx-4">
      <Text className="text-xl font-bold text-start my-8 text-black">
        Edit your user details
      </Text>

      <View className="gap-4">
        <InputField
          text="Username"
          autoCapitalize="none"
          value={values.name}
          placeholder="Enter your username"
          placeholderTextColor="#9CA3AF"
          onChangeText={(v) => handleChange("name", v)}
          validation={errors.name}
        />
        <InputField
          text="Email"
          autoCapitalize="none"
          value={values.email}
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          onChangeText={(v) => handleChange("email", v)}
          keyboardType="email-address"
          validation={errors.email}
          // style={{textAlign:'right'}}
        />
        <InputField
          text="Phone"
          autoCapitalize="none"
          value={values.phone}
          placeholder="Enter your phone number"
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
              Update
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
