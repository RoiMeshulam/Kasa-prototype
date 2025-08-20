// app/machine/MachineScreen.tsx
import { useEffect, useRef, useState, useMemo } from "react";
import { useLocalSearchParams, useRouter, Link } from "expo-router";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { io, Socket } from "socket.io-client";
import axios from 'axios';

type Stage = "show_qr" | "await_bottle" | "insert_now";

type BottlePayload = { id: string; name: string; price: number };
type ProgressPayload = {
  bottle: { id: string; name: string; price: number; quantity: number };
  bottles: Array<{ id: string; name: string; price: number; quantity: number }>;
  balance: number;
};

const SOCKET_SERVER_URL = "http://10.0.0.9:8080";

const MachineScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);

  const [connected, setConnected] = useState(false);
  const [stage, setStage] = useState<Stage>("show_qr");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentBottle, setCurrentBottle] = useState<{
    id: string; name: string; price: number; quantity: number;
  } | null>(null);
  const [balance, setBalance] = useState(0);

  const qrId = useMemo(() => params.qr_code?.toString() ?? "", [params.qr_code]);

  useEffect(() => {
    if (!qrId) return;

    const socket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    const onConnect = async () => {
      console.log("✅ Socket connected as machine:", socket.id);
      try {
        const response = await axios.get(`${SOCKET_SERVER_URL}/api/machines/getIdByQr/${qrId}`);
        console.log("response:", response.data);
        const machineId = response.data.machineId;
        console.log("🖥️ machineId received:", machineId);
        setConnected(true);
        socket.emit("machine_connected", machineId);
      } catch (err) {
        console.warn("⚠️ Axios failed:", err);
      } finally {
        setStage("show_qr");
        setSessionId(null);
        setCurrentBottle(null);
        setBalance(0);
      }
    };

    const onSessionStarted = ({ sessionId, userId }: { sessionId: string; userId: string }) => {
      console.log("🤝 Session started with user:", userId);
      setSessionId(sessionId);
      setStage("await_bottle");
      setCurrentBottle(null);
      setBalance(0);
    };

    const onBottleData = ({ bottle }: { bottle: BottlePayload }) => {
      console.log("🍾 Bottle received on machine:", bottle);
      setCurrentBottle({ ...bottle, quantity: 0 });
      setStage("insert_now");
    };

    const onBottleProgress = (payload: ProgressPayload) => {
      console.log("📈 bottle_progress (machine):", payload);
      setBalance(payload.balance);
      // עדכון מבוסס prev כדי לא להיתקע עם ערך ישן מהקלוז’ר
      setCurrentBottle(prev =>
        prev && prev.id === payload.bottle.id
          ? { id: payload.bottle.id, name: payload.bottle.name, price: payload.bottle.price, quantity: payload.bottle.quantity }
          : prev
      );
    };

    const onAwaitBottle = () => {
      console.log("⏳ Machine asked to await next bottle");
      setStage("await_bottle");
      setCurrentBottle(null);
    };

    const onSessionClosed = () => {
      console.log("🛑 Session closed");
      setSessionId(null);
      setStage("show_qr");
      setCurrentBottle(null);
      setBalance(0);
      router.replace("/");
    };

    const onDisconnect = () => {
      console.log("❌ Socket disconnected");
      setConnected(false);
      setSessionId(null);
      setStage("show_qr");
      setCurrentBottle(null);
      setBalance(0);
      router.replace("/");
    };

    socket.on("connect", onConnect);
    socket.on("session_started", onSessionStarted);
    socket.on("bottle_data", onBottleData);
    socket.on("bottle_progress", onBottleProgress);
    socket.on("await_bottle", onAwaitBottle);
    socket.on("session_closed", onSessionClosed);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("session_started", onSessionStarted);
      socket.off("bottle_data", onBottleData);
      socket.off("bottle_progress", onBottleProgress);
      socket.off("await_bottle", onAwaitBottle);
      socket.off("session_closed", onSessionClosed);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
    // ⚠️ חשוב: אל תכניס כאן currentBottle/ router ל-deps.
  }, [qrId]); // << רק qrId

  // --- UI ---
  if (stage === "show_qr") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ marginBottom: 50 }}>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>{params.name}</Text>
        </View>
        <Text style={{ marginBottom: 20 }}>Scan this QR Code:</Text>
        <QRCode value={qrId} size={200} />
        <Link href={"/action"} push asChild style={{ marginTop: 100, fontSize: 24 }}>
          <Text>Continue</Text>
        </Link>
      </View>
    );
  }

  if (stage === "await_bottle") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 16 }}>אנא סרוק בקבוק</Text>
        <Text style={{ color: "#6b7280", fontSize: 16 }}>מחכים לסריקה מהלקוח...</Text>
        <Text style={{ marginTop: 24, fontSize: 18 }}>מאזן נוכחי: ₪{balance.toFixed(2)}</Text>
      </View>
    );
  }

  // insert_now
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 16 }}>הכנס מוצר למכונה</Text>

      {currentBottle ? (
        <>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>שם המוצר: {currentBottle.name}</Text>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>שווי ליחידה: ₪{currentBottle.price.toFixed(2)}</Text>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>כמות שהוכנסה מסוג זה: {currentBottle.quantity}</Text>
        </>
      ) : (
        <Text style={{ color: "#6b7280" }}>ממתינים לנתוני מוצר...</Text>
      )}

      <Text style={{ marginTop: 24, fontSize: 18 }}>מאזן: ₪{balance.toFixed(2)}</Text>
    </View>
  );
};

export default MachineScreen;
