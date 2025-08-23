import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { SafeAreaView, View, Platform, Text, ActivityIndicator } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { machines } from "../../../utils/DUMMY_DATA";

export default function Map() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log("Location permission status:", status);
        
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setLoading(false);
          return;
        }

        console.log("Getting current position...");
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        console.log("Got location:", loc.coords);
        setLocation(loc);
      } catch (error) {
        console.error("Error getting location:", error);
        setErrorMsg("Failed to get location");
      } finally {
        setLoading(false);
      }
    }

    getCurrentLocation();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>טוען מיקום...</Text>
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{errorMsg}</Text>
        <Text>נסה להפעיל הרשאות מיקום בהגדרות</Text>
      </SafeAreaView>
    );
  }

  if (!location) {
    // Fallback מיקום לבדיקה (תל אביב)
    const fallbackLocation = {
      coords: {
        latitude: 32.0853,
        longitude: 34.7818,
        accuracy: 100,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: Date.now()
    };
    
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MapView
          style={{ width: "100%", height: "100%" }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: fallbackLocation.coords.latitude,
            longitude: fallbackLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          followsUserLocation={false}
          zoomEnabled={true}
          scrollEnabled={true}
          rotateEnabled={true}
          pitchEnabled={true}
          showsCompass={true}
          showsScale={true}
          loadingEnabled={true}
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

  console.log("Rendering map with location:", location.coords);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        provider={PROVIDER_GOOGLE} // השתמש תמיד ב-Google Maps
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        followsUserLocation={false}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
        showsCompass={true}
        showsScale={true}
        loadingEnabled={true}
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
