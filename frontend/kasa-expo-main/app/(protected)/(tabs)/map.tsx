import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { SafeAreaView, View, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { machines } from "../../../utils/DUMMY_DATA";

export default function Map() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status);
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    }

    getCurrentLocation();
  }, []);

  if (!location) {
    return <View style={{ flex: 1, backgroundColor: "#eee" }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined} // Google רק באנדרואיד
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
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
            pinColor="#000000"
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
}
