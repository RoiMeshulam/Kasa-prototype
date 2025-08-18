// app/screens/_components/InsertBottleScreen.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import type { BottleItem } from "./types";

interface Props {
  current: BottleItem | null;
  balance: number;
  onInsert: () => void;
  onFinishType: () => void;
  onEndSession: () => void;
}

const InsertBottleScreen: React.FC<Props> = ({
  current,
  balance,
  onInsert,
  onFinishType,
  onEndSession,
}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        paddingHorizontal: 24,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 8 }}>
        הכנס בקבוק למכונה
      </Text>

      <Image
        source={require("@/assets/images/bottle-icon.jpg")}
        style={{ width: 110, height: 110, marginVertical: 10 }}
        resizeMode="contain"
      />

      <Text style={{ fontSize: 18, marginTop: 8 }}>
        מאזן סריקה: ₪{balance.toFixed(2)}
      </Text>

      {current ? (
        <View style={{ alignItems: "center", marginTop: 16 }}>
          <Text style={{ fontSize: 16 }}>
            שם המוצר: <Text style={{ fontWeight: "600" }}>{current.name}</Text>
          </Text>
          <Text style={{ fontSize: 16 }}>
            שווי ליחידה: ₪{current.price.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 16 }}>
            עד כה הוכנסו: {current.quantity} יח׳
          </Text>
        </View>
      ) : (
        <Text style={{ color: "#6b7280", marginTop: 16 }}>
          אין בקבוק פעיל כרגע
        </Text>
      )}

      <View style={{ width: "100%", marginTop: 28, gap: 12 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            paddingVertical: 12,
            borderRadius: 12,
            opacity: current ? 1 : 0.6,
          }}
          onPress={onInsert}
          disabled={!current}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            ✅ הכנסתי בקבוק למכונה
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#f59e0b",
            paddingVertical: 12,
            borderRadius: 12,
          }}
          onPress={onFinishType}
        >
          <Text
            style={{
              color: "black",
              textAlign: "center",
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            🔁 סיימתי להכניס מהסוג הזה
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#ef4444",
            paddingVertical: 12,
            borderRadius: 12,
          }}
          onPress={onEndSession}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            🛑 סיים סשן
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InsertBottleScreen;
