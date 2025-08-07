import { Link } from "expo-router";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { machines } from "../utils/DUMMY_DATA";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
      style= {{padding:50}}
        data={machines}
        renderItem={({ item }) => (
          <Link
            href={{ pathname: "/machine", params: item }}
            withAnchor
            push
          >
            <View
              key={item.id_machine}
              style={{
                borderBottomWidth: 0.2,
                padding: 10,
                marginHorizontal: 5,
                width:'100%'
              }}
            >
              <Text style={{ fontSize: 18, textAlign: "center" }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 8, textAlign: "center" }}>
                {item.qr_code}
              </Text>
            </View>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}
