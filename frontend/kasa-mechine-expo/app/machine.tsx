import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const MachineScreen = () => {
  const params = useLocalSearchParams();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ marginBottom: 50 }}>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>
            {params.name}
          </Text>
        </View>
        <Text style={{ marginBottom: 20 }}>Scan this QR Code:</Text>
        <QRCode value={params.qr_code.toString()} size={200} />
        {/* User redirect to next page after scanning and conecting to websocket */}
        <Link href={"/action"} push asChild style={{marginTop: 100, fontSize:24}}>
          <Text>Continue</Text>
        </Link>
      </View>
    </View>
  );
};

export default MachineScreen;
