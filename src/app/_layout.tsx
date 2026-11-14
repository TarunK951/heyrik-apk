import React from "react";
import { ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Store } from "../store";
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Geist: require("../../assets/brand/Geist.ttf"),
    GeistSemi: require("../../assets/brand/GeistSemi.ttf"),
  });
  if (!loaded && !error) return <ActivityIndicator style={{ flex: 1 }} />;
  return (
    <SafeAreaProvider>
      <Store>
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        />
      </Store>
    </SafeAreaProvider>
  );
}
