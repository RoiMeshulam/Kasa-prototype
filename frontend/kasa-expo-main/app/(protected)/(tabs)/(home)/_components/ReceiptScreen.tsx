// app/screens/_components/ReceiptScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import type { BottleItem } from './types';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  sessionId: string;
  bottles: BottleItem[];
  balance: number;
  onDone: () => void;
}

const ReceiptScreen: React.FC<Props> = ({ sessionId, bottles, balance, onDone }) => {
  const now = new Date();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 24, padding: 100 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>קבלה</Text>
      <Text style={{ textAlign: 'center', color: '#6b7280' }}>מספר סשן: {sessionId}</Text>
      <Text style={{ textAlign: 'center', color: '#6b7280', marginBottom: 16 }}>{now.toLocaleString()}</Text>

      <FlatList
        data={bottles}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 24 }}>לא נסרקו בקבוקים</Text>}
        renderItem={({ item }) => (
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingVertical: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
            <Text style={{ fontSize: 16 }}>כמות: {item.quantity}</Text>
            <Text style={{ fontSize: 16 }}>סה״כ: ₪{(item.quantity * item.price).toFixed(2)}</Text>
          </View>
        )}
      />

      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 16 }}>
        סה״כ לזיכוי: ₪{balance.toFixed(2)}
      </Text>
      <Text style={{ color: '#16a34a', textAlign: 'center', marginTop: 8 }}>
        המשתמש יזוכה בסכום זה לחשבון הארנק שלו
      </Text>

      <TouchableOpacity style={{ backgroundColor: '#000', paddingVertical: 12, borderRadius: 12, marginTop: 28 }} onPress={onDone}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, fontWeight: '600' }}>חזרה לדף הבית</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ReceiptScreen;
