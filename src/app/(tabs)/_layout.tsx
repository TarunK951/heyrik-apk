import React from "react";
import { ActivityIndicator, Platform } from "react-native";
import { Redirect } from "expo-router";
import { useStore } from "../../store";
import { NativeNavigation } from "../../navigation/NativeNavigation";
import { PillNavigation } from "../../navigation/PillNavigation";
export default function TabLayout() {
  const { ready, signed } = useStore();
  if (!ready) return <ActivityIndicator style={{ flex: 1 }} />;
  if (!signed) return <Redirect href="/" />;
  return Platform.OS === "ios" ? <NativeNavigation /> : <PillNavigation />;
}
