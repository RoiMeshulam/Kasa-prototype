// app/screens/ScannerScreen.tsx
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { SafeAreaView, Text, View } from "react-native";

import { useGlobalContext } from '../../../../store/globalContext';
import GenericScanner from './_components/genericScanner';

const ScannerScreen = () => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [stage, setStage] = useState<'scannerQR' | 'scannerBottle' | 'insert'>('scannerQR');
    const [loading, setLoading] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const { userInfo } = useGlobalContext();
    const router = useRouter();

    useEffect(() => {
        if (!userInfo?.uid) return;

        const socket = io('http://10.0.0.9:8080', {
            transports: ['websocket'],
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('✅ Socket connected');
            socket.emit('user_connected', userInfo.uid);
        });

        socket.on('session_started', ({ sessionId, machineId }) => {
            console.log('🟢 session_started:', { sessionId, machineId });
            setSessionId(sessionId); // שמירה
            setLoading(false);       // משחרר את הטעינה
            setStage('scannerBottle');
        });

        socket.on('bottle_data', (bottleData) => {
            console.log('🍾 bottle_data received:', bottleData);
            setLoading(false); // שחרור הטעינה אחרי קבלת הבקבוק
            setStage('insert');
        });

        return () => {
            socket.disconnect();
        };
    }, [userInfo?.uid]);

    const handleQRScan = async (qrId: string) => {
        if (!userInfo?.uid || loading) return;

        console.log('📷 QR scanned:', qrId);
        setLoading(true);

        try {
            const res = await axios.post('http://10.0.0.9:8080/api/sessions', {
                qrId,
                userId: userInfo.uid,
                bottleCount: 3,
            });
            console.log('✅ QR POST response:', res.data);
            // setSessionId(res.data.sessionId); // לא חובה כאן, מקבלים מה־socket
        } catch (err) {
            console.error('❌ QR POST failed:', err);
            setLoading(false);
        }
    };

    const handleBottleScan = (barcode: string) => {
        if (!sessionId || loading || !socketRef.current) return;

        console.log('📦 Bottle barcode scanned (via WS):', barcode);
        setLoading(true);

        socketRef.current.emit('bottle_scanned', {
            sessionId,
            barcode,
        });
    };

    if (stage === 'scannerQR') {
        console.log("i am on scannerOR");
        return (
            <GenericScanner
                key={stage}
                icon={require('@/assets/images/qr-icon.jpg')}
                title="סרוק את קוד ה-QR שעל המכונה"
                scanningType="qr"
                onScanned={handleQRScan}
                loading={loading}
            />
        );
    }

    if (stage === 'scannerBottle') {
        console.log("i am on scanner bottle barcod");
        return (
            <GenericScanner
                icon={require('@/assets/images/bottle-icon.jpg')}
                title="סרוק את הברקוד שעל הבקבוק"
                scanningType="barcode"
                onScanned={handleBottleScan}
                loading={loading}
            />
        );
    }

    if (stage === 'insert') {
        // router.push('/scanner/bottleInsert');
        // return null;
        return (
            <SafeAreaView>
                <Text>i am in insert mode</Text>
            </SafeAreaView>
        )

    }

    return null;
};

export default ScannerScreen;
