import { Redirect, useLocalSearchParams } from "expo-router";
import { useStore } from "../store";
import { AppContent } from "../../App";
import { tabHref } from "../navigation";
import { BrandLoader } from "../components/BrandLoader";
export default function Detail() {
  const { ready, signed } = useStore();
  const { page } = useLocalSearchParams<{ page: string }>();
  if (!ready) return <BrandLoader />;
  if (!signed) return <Redirect href="/" />;
  const main = tabHref(page);
  if (main) return <Redirect href={main} />;
  return <AppContent />;
}
