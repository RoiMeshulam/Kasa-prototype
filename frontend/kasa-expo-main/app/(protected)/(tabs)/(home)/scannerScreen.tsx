// app/screens/ScannerScreen.tsx
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

import GenericScanner from './_components/genericScanner';
import InsertBottleScreen from './_components/InsertBottleScreen';
import SummaryScreen from './_components/SummaryScreen';
import ReceiptScreen from './_components/ReceiptScreen';
import { useGlobalContext } from '../../../../store/globalContext';
import type { BottleItem } from './_components/types';
import { useRouter } from 'expo-router'; 

type Stage = 'scannerQR' | 'scannerBottle' | 'insertBottle' | 'summary' | 'receipt';

const API = 'http://10.0.0.9:8080';

export default function ScannerScreen() {
  const [stage, setStage] = useState<Stage>('scannerQR');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [bottles, setBottles] = useState<BottleItem[]>([]);
  const [balance, setBalance] = useState(0);
  const [currentBottleId, setCurrentBottleId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const { userInfo, setRefreshSessions, setUserInfo } = useGlobalContext();

  const router = useRouter();
  // ---------- socket setup ----------
  useEffect(() => {
    if (!userInfo?.uid) return;

    const socket = io(API, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected');
      socket.emit('user_connected', userInfo.uid);
    });

    socket.on('session_started', ({ sessionId, machineId }) => {
      console.log('🟢 session_started:', { sessionId, machineId });
      setSessionId(sessionId);
      setLoading(false);
      setStage('scannerBottle');
    });

    socket.on('bottle_data', ({ bottle }) => {
      console.log('🍾 bottle_data:', bottle);
      setLoading(false);

      setCurrentBottleId(bottle.id);

      setBottles(prev => {
        const exists = prev.find(b => b.id === bottle.id);
        if (exists) return prev;
        return [...prev, { id: bottle.id, name: bottle.name, price: Number(bottle.price || 0), quantity: 0 }];
      });

      setStage('insertBottle');
    });

    socket.on('bottle_progress', ({ bottles: serverBottles, balance: serverBalance }) => {
      setBottles(serverBottles);
      setBalance(serverBalance);
    });

    socket.on('session_closed', () => {
      setStage('receipt');
    });

    return () => {
      socket.disconnect();
    };
  }, [userInfo?.uid]);

  // ---------- actions ----------
  const handleQRScan = async (qrId: string) => {
    if (!userInfo?.uid || loading) return;
    setLoading(true);
    try {
      console.log({qrId,userInfo});
      await axios.post(`${API}/api/sessions`, { qrId: qrId, userId: userInfo.uid });
    } catch (err) {
      console.error('❌ start session failed', err);
      setLoading(false);
    }
  };

  const handleBottleScan = (barcode: string) => {
    if (!sessionId || loading || !socketRef.current) return;
    setLoading(true);
    socketRef.current.emit('bottle_scanned', { sessionId, barcode });
  };

  const handleInsertBottle = () => {
    if (!sessionId || !socketRef.current) return;
    socketRef.current.emit('bottle_inserted', { sessionId });
  };

  const handleFinishBottleType = () => {
    setStage('summary');
  };

  const handleScanAnotherBottle = () => {
    // הודע למכונה לחזור למצב "await_bottle"
    if (sessionId && socketRef.current) {
      socketRef.current.emit('await_bottle', { sessionId });
    }
    // ועבור במסך הלקוח לסורק
    setCurrentBottleId(null);
    setStage('scannerBottle');
  };

  const handleEndSession = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/sessions/${sessionId}/end`);

      console.log({response:response.data});
      const data = response.data;

      console.log(data.session);
      let session = data.session;

      // עדכון מאזן המשתמש בצורה בטוחה עם temp variable
      if (userInfo) {
        const newBalance = (Number(userInfo.balance) + session.balance).toFixed(2); // סה"כ חדש
        const tempUserInfo = { ...userInfo, balance: newBalance };
        setUserInfo(tempUserInfo); // עדכון גלובלי
      }
      
     
      // אופציונלי: WS fallback
      // socketRef.current?.emit('end_session', { sessionId });

      // ✅ ריפרש של sessions & summary
      setRefreshSessions(prev => !prev); // יפעיל useEffect ב־context
      
    } catch (e) {
      console.warn('⚠️ end-session failed', e);
    } finally {
      setLoading(false);
      setStage('receipt'); // מעבר למסך קבלה
    }
  };

  const handleDoneReceipt = () => {
    // ✅ נקה סטייט
    setStage('scannerQR');
    setSessionId(null);
    setBottles([]);
    setBalance(0);
    setCurrentBottleId(null);

    // ✅ חזרה לדף הבית של האפליקציה
    // שנה את הנתיב לפי ה־routes שלך: '/', '(tabs)/home', וכו'
    router.replace("/(protected)/(tabs)/(home)");
  };

  // ---------- render by stage ----------
  if (stage === 'scannerQR')
    return (
      <GenericScanner
        key={stage}
        icon={require('@/assets/images/qr-icon.jpg')}
        title="סרוק את קוד ה־QR שעל המכונה"
        scanningType="qr"
        onScanned={handleQRScan}
        loading={loading}
      />
    );

  if (stage === 'scannerBottle')
    return (
      <GenericScanner
        key={stage}
        icon={require('@/assets/images/bottle-icon.jpg')}
        title="סרוק את הברקוד שעל הבקבוק"
        scanningType="barcode"
        onScanned={handleBottleScan}
        loading={loading}
      />
    );

  if (stage === 'insertBottle') {
    const current = currentBottleId
      ? bottles.find(b => b.id === currentBottleId) ?? null
      : null;

    return (
      <InsertBottleScreen
        current={current}
        balance={balance}
        onInsert={handleInsertBottle}
        onFinishType={handleFinishBottleType}
        onEndSession={handleEndSession}
      />
    );
  }

  if (stage === 'summary')
    return (
      <SummaryScreen
        bottles={bottles}
        balance={balance}
        onScanAnother={handleScanAnotherBottle}
        onEndSession={handleEndSession}
      />
    );

  if (stage === 'receipt')
    return (
      <ReceiptScreen
        sessionId={sessionId ?? ''}
        bottles={bottles}
        balance={balance}
        onDone={handleDoneReceipt}
      />
    );

  return null;
}
