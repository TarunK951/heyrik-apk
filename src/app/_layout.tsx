import React from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Store } from "../store";
import { BrandLoader } from "../components/BrandLoader";
import WebStyles from "../components/WebStyles";
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Geist: require("../../assets/brand/Geist.ttf"),
    GeistSemi: require("../../assets/brand/GeistSemi.ttf"),
  });
  if (!loaded && !error) return <BrandLoader />;
  return (
    <SafeAreaProvider>
      <WebStyles />
      <Store>
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        />
      </Store>
    </SafeAreaProvider>
  );
}
