import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { MachineContext } from "@/store/machineContext";
import { Link } from "expo-router";

const action = () => {
  const { counter, insert, reset } = useContext(MachineContext);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      <Text style={{ fontSize: 48 }}>{counter}</Text>
      <Text style={{ fontSize: 16 }}>אנא סרוק את הברקוד של הבקבוק</Text>
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 12 }}>
          לחיצה על הכפתור מדמה הכנסה פיזית של בקבוק למכונה
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: "#32a852" }}
          onPress={insert}
        >
          <Text
            style={{
              textAlign: "center",
              paddingVertical: 8,
              paddingHorizontal: 12,
              color: "#fff",
              fontWeight: "700",
            }}
          >
            הכנסה
          </Text>
        </TouchableOpacity>
        <Link
          href={".."}
          style={{ alignSelf: "center", marginTop: 24 }}
          onPress={reset}
        >
          <Text style={{ fontSize: 18, fontWeight: "500", color: "red" }}>
            סיום
          </Text>
        </Link>
      </View>
    </View>
  );
};

export default action;
