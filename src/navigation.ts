import type { Href } from "expo-router";
const scrollHandlers = new Map<string, () => void>();
export function registerTabScroll(page: string, handler: () => void) {
  scrollHandlers.set(page, handler);
  return () => {
    scrollHandlers.delete(page);
  };
}
export function scrollTabToTop(page: string) {
  scrollHandlers.get(page)?.();
}
export const mainTabs = [
  { route: "agents", page: "AI Agents", label: "Agents", icon: "cpu" },
  { route: "calls", page: "Call Logs", label: "Calls", icon: "phone" },
  { route: "crm", page: "CRM", label: "CRM", icon: "users" },
  { route: "campaigns", page: "Campaigns", label: "Outreach", icon: "send" },
  { route: "more", page: "More", label: "More", icon: "grid" },
] as const;
export function tabHref(page: string): Href | undefined {
  const tab = mainTabs.find((t) => t.page === page);
  return tab ? (`/(tabs)/${tab.route}` as Href) : undefined;
}
