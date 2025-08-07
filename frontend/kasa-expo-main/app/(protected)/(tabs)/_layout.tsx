import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { Entypo } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#32a852",
        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: 'TabBarBackground',
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(wallet)"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color }) => (
            <Entypo size={28} name="wallet" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => (
            <Entypo size={28} name="map" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(user)"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Entypo size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
