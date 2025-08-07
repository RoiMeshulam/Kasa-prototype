import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { Link } from "expo-router";
import { machines, users } from "../../../../utils/DUMMY_DATA";
import InfoCard from "./_components/info-card";

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  if (!location) {
    return <View />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <View className="flex-1  gap-8 mt-10 p-6">
        <View className="gap-3 ">
          <Text className="text-4xl font-black text-center mb-4 text-green-800">
            Recycle.Earn.Impact
          </Text>
        </View>
        <View className="gap-6">
          <Text className="text-3xl text-black font-light mb-3">{`Welcome, ${users[0].name}`}</Text>
          <View className="w-full flex flex-row gap-4 h-[60%]">
            <InfoCard
              amount={users[0].bottles_total}
              title={"Recycied This Mounth"}
            />
            <InfoCard amount={users[0].balance} title={"Total Earned"} money />
          </View>
          <Link
            href={"/(protected)/(tabs)/(home)/scannerScreen"}
            className="bg-green-500 rounded-md py-3 text-center "
            asChild
          >
            <Text>Scan Bottle</Text>
          </Link>
        </View>
      </View>
      {/* <View className=" border-green-800 border-t-2 h-[50%] mt-auto">
        <MapView
          style={{ width: "100%", height: "100%" }}
          initialRegion={{
            latitude: 32.23,
            longitude: 23.22,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          region={{
            latitude: location?.coords.latitude!,
            longitude: location?.coords.longitude!,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
          cameraZoomRange={{
            maxCenterCoordinateDistance: 500,
            minCenterCoordinateDistance: 100,
          }}
          zoomEnabled
        >
          {machines.map((marker) => (
            <Marker
              key={marker.id_machine}
              coordinate={{
                latitude: marker.latitude!,
                longitude: marker.longitude!,
              }}
              title={marker.name}
              description={marker.status}
              // icon={{ uri: "/assets/images/icon.png" }}
              pinColor="#000000"
            />
          ))}
        </MapView>
      </View> */}
    </SafeAreaView>
  );
}
