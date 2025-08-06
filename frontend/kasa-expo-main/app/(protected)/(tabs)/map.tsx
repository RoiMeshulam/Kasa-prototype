import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { machines } from "../../../utils/DUMMY_DATA";

export default function Map() {
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
    <SafeAreaView className="flex-1">
      <View className="h-full">
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
      </View>
    </SafeAreaView>
  );
}
