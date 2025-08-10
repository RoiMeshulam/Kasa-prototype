// app/screens/_components/SummaryScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import type { BottleItem } from './types';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  bottles: BottleItem[];
  balance: number;
  onScanAnother: () => void;
  onEndSession: () => void;
}

const SummaryScreen: React.FC<Props> = ({ bottles, balance, onScanAnother, onEndSession }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 24, paddingTop: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>סיכום ביניים</Text>

      <FlatList
        data={bottles}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 24 }}>אין בקבוקים לסיכום עדיין</Text>}
        renderItem={({ item }) => (
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingVertical: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
            <Text style={{ fontSize: 16 }}>כמות: {item.quantity}</Text>
            <Text style={{ fontSize: 16 }}>סה״כ: ₪{(item.quantity * item.price).toFixed(2)}</Text>
          </View>
        )}
      />

      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 16 }}>
        מאזן סריקה עד כה: ₪{balance.toFixed(2)}
      </Text>

      <View style={{ marginTop: 24, gap: 12 }}>
        <TouchableOpacity style={{ backgroundColor: '#f59e0b', paddingVertical: 12, borderRadius: 12 }} onPress={onScanAnother}>
          <Text style={{ color: 'black', textAlign: 'center', fontSize: 18, fontWeight: '600' }}>🔁 סרוק סוג נוסף</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 12 }} onPress={onEndSession}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, fontWeight: '600' }}>🛑 סיים סשן</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SummaryScreen;
