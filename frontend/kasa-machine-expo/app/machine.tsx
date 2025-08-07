import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL ="http://10.0.0.9:8080"

const MachineScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);

  const [connected, setConnected] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const qrId = params.qr_code?.toString();
    if (!qrId) return;

    const socket = io(`${SOCKET_SERVER_URL}`, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected as machine:", socket.id);
      setConnected(true);
      socket.emit("machine_connected", qrId);
    });

    socket.on("session_started", ({ sessionId, userId }) => {
      console.log("🤝 Session started with user:", userId);
      setSessionId(sessionId);
      // ניווט למסך הכנסת בקבוקים
      // router.push({
      //   pathname: "/machine/bottle-intake",
      //   params: {
      //     sessionId,
      //     userId,
      //     qrId,
      //   },
      // });
    });

    socket.on("session_closed", () => {
      console.log("🛑 Session closed");
      setSessionId(null);
      router.push("/machine"); // חזור למסך הראשי
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [params.qr_code]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ marginBottom: 50 }}>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>
            {params.name}
          </Text>
        </View>
        <Text style={{ marginBottom: 20 }}>Scan this QR Code:</Text>
        <QRCode value={params.qr_code?.toString() || ""} size={200} />
        <Text style={{ marginTop: 30 }}>
          {connected ? "📡 Connected" : "🔌 Connecting..."}
        </Text>
      </View>
    </View>
  );
};

export default MachineScreen;
