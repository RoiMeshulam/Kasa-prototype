import { Link } from "expo-router";
import React from "react";
import { SafeAreaView, Text } from "react-native";

const ProfileScreen = () => {
  return (
    <SafeAreaView>
      <Text>ProfileScreen</Text>
      <Link
        href={"/(protected)/(tabs)/(user)/edit-profile"}
        push
        prefetch
        asChild
      >
        <Text>Edit Profile</Text>
      </Link>
    </SafeAreaView>
  );
};

export default ProfileScreen;
