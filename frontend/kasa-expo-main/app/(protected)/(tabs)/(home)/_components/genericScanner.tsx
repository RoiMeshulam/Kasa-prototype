// app/screens/_components/GenericScanner.tsx
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  CameraView,
  BarcodeScanningResult,
  useCameraPermissions,
  PermissionStatus,
} from 'expo-camera';

interface GenericScannerProps {
  icon: any;
  title: string;
  scanningType: 'qr' | 'barcode';
  onScanned: (data: string) => void;
  loading: boolean;
}

export default function GenericScanner({
  icon,
  title,
  scanningType,
  onScanned,
  loading,
}: GenericScannerProps) {
  const [flag, setFlag] = useState(false); // מסך "אישור" לפני המצלמה
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  // למנוע ספאם סריקות (תזוזות מצלמה וכו')
  const lastScanAtRef = useRef<number>(0);
  const SCAN_COOLDOWN_MS = 700;

  // בכל mount ננקה state רלוונטי
  useEffect(() => {
    setFlag(false);
    setScanned(false);
    lastScanAtRef.current = 0;
  }, []);

  // בדיקת הרשאות
  useEffect(() => {
    const checkAndRequest = async () => {
      if (!permission || permission.status !== PermissionStatus.GRANTED) {
        await requestPermission();
      }
      setCheckingPermission(false);
    };
    checkAndRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // אפשרות לסריקה חוזרת אחרי שה־loading ירד
  useEffect(() => {
    if (!loading) {
      setScanned(false);
      // Remove the flag reset logic that was causing the infinite loop
    }
  }, [loading]);

  const handleScan = (result: BarcodeScanningResult) => {
    if (!result?.data) return;

    const now = Date.now();
    if (now - lastScanAtRef.current < SCAN_COOLDOWN_MS) {
      return; // חכה קצת בין סריקות
    }
    lastScanAtRef.current = now;

    if (scanned) return;

    console.log('🔍 Scanned Result:', result);
    setScanned(true);
    onScanned(String(result.data));
  };

  // שלב טעינה של בדיקת הרשאות
  if (checkingPermission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>בודק הרשאות מצלמה...</Text>
      </View>
    );
  }

  // שלב בקשת הרשאה מהמשתמש
  if (permission?.status !== PermissionStatus.GRANTED) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 10 }}>
          נדרשת הרשאה להפעלת מצלמה
        </Text>
        <TouchableOpacity onPress={requestPermission} style={{ backgroundColor: '#000', padding: 10, borderRadius: 10 }}>
          <Text style={{ color: 'white' }}>אפשר מצלמה</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // מסך ביניים עם אייקון וכפתור "אישור"
  if (!flag) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>{title}</Text>
        <View style={{ width: 200, height: 200, borderWidth: 2, borderColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={icon} style={{ width: 100, height: 100 }} resizeMode="contain" />
        </View>
        <TouchableOpacity
          onPress={() => setFlag(true)}
          style={{ marginTop: 40, backgroundColor: '#000', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 }}>
          <Text style={{ color: 'white', fontSize: 16 }}>אישור</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // המצלמה
  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={{
          position: 'absolute',
          zIndex: 10,
          top: 0, bottom: 0, left: 0, right: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#00000088'
        }}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: 'white', marginTop: 10 }}>טוען...</Text>
        </View>
      )}

      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes:
            scanningType === 'qr'
              ? ['qr']
              : ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'],
        }}
        onBarcodeScanned={handleScan}
      />
    </View>
  );
}
