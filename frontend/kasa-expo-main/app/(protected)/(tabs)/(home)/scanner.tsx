import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Button, Text, View } from "react-native";

const ScannerScreen = () => {
  const [premission, requestPremission] = useCameraPermissions();

  if (!premission) {
    return <View />;
  }

  if (!premission.granted) {
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center pb-2">
          We need your premission to show the camera
        </Text>
        <Button title="grant premission" onPress={requestPremission} />
      </View>
    );
  }

  const handleScannedData = (scanningResult: BarcodeScanningResult) => {
    console.log("Bottle scaned");
  };

  return (
    <CameraView
      className="flex-1"
      facing={"back"}
      barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      onBarcodeScanned={handleScannedData}
    />
  );
};

export default ScannerScreen;
