import { useEffect, useState } from "react";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Button, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleScannedData = (scanningResult: BarcodeScanningResult) => {
    if (scanned) return;

    const scannedData = scanningResult?.data;
    if (scannedData) {
      setScanned(true);
      Alert.alert("✅ QR סרוק", `ID שנקלט: ${scannedData}`, [
        {
          text: "סרוק שוב",
          onPress: () => setScanned(false),
        },
        {
          text: "אישור",
          style: "cancel",
        },
      ]);

      console.log("Scanned QR:", scannedData);
    }
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-center pb-2 text-lg font-medium">
          נדרש אישור להפעלת המצלמה
        </Text>
        <Button title="אפשר מצלמה" onPress={requestPermission} />
      </SafeAreaView>
    );
  }
  console.log("Camera Permission:", permission);
  if (permission.granted === true) {
    return (
      <View className="flex-1">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleScannedData}
        />
      </View>
    );
  }

};

export default ScannerScreen;
