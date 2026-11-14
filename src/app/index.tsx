import { Redirect } from "expo-router";
import { useStore } from "../store";
import { AppContent } from "../../App";
export default function Entry() {
  const { signed } = useStore();
  return signed ? <Redirect href="/(tabs)/agents" /> : <AppContent />;
}
