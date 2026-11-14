import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
let enabled = true,
  last = 0;
export function setHapticsEnabled(value: boolean) {
  enabled = value;
}
export function tapFeedback() {
  if (!enabled || Platform.OS === "web" || Date.now() - last < 100) return;
  last = Date.now();
  void Haptics.selectionAsync().catch(() => {});
}
