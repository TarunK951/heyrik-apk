import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { AppState, Platform } from "react-native";
import { setHapticsEnabled } from "./feedback";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Agent, makeAgent } from "./catalog";
export type RecordItem = { id: string; name: string; [key: string]: any };
type State = {
  preferences: { rikSize: string; haptics: boolean };
  profile: { name: string; email: string; phone: string; photo?: string };
  charts: RecordItem[];
  rikChats: RecordItem[];
  onboarded: boolean;
  agents: Agent[];
  leads: RecordItem[];
  campaigns: RecordItem[];
  files: RecordItem[];
  numbers: RecordItem[];
  bots: RecordItem[];
  clones: RecordItem[];
  endpoints: RecordItem[];
  tickets: RecordItem[];
  keys: RecordItem[];
  transactions: RecordItem[];
  balance: number;
  plan: string;
  kyc: string;
  connections: string[];
  favorites: string[];
};
const initial: State = {
  charts: [],
  rikChats: [],
  preferences: { rikSize: "Medium", haptics: true },
  profile: { name: "Alex", email: "alex@example.com", phone: "" },
  onboarded: false,
  agents: [
    {
      ...makeAgent(
        "Front-desk Riya",
        "A welcoming receptionist who answers business questions and helps callers book appointments.",
      ),
      id: "sample-agent",
    },
  ],
  leads: [],
  campaigns: [],
  files: [],
  numbers: [],
  bots: [],
  clones: [],
  endpoints: [],
  tickets: [],
  keys: [],
  transactions: [],
  balance: 30,
  plan: "Free Trial",
  kyc: "Not started",
  connections: [],
  favorites: [],
};
const Context = createContext<{
  data: State;
  set: (fn: (s: State) => State) => void;
  ready: boolean;
  signed: boolean;
  signin: (value: boolean) => void;
}>({
  data: initial,
  set: () => {},
  ready: false,
  signed: false,
  signin: () => {},
});
export function Store({ children }: { children: React.ReactNode }) {
  const writeQueue = useRef(Promise.resolve());
  const [data, setData] = useState(initial);
  const [signed, signin] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem("heyrik-demo-v1")
      .then((v) => {
        if (v) {
          try {
            const saved = JSON.parse(v);
            setData({
              ...initial,
              ...saved,
              preferences: { ...initial.preferences, ...saved.preferences },
              profile: { ...initial.profile, ...saved.profile },
            });
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (!ready) return;
    let persisted = false;
    const persist = () => {
      if (persisted) return;
      persisted = true;
      // Serialize only the final coalesced update, not every keystroke.
      const snapshot = JSON.stringify(data);
      writeQueue.current = writeQueue.current
        .catch(() => {})
        .then(() => AsyncStorage.setItem("heyrik-demo-v1", snapshot))
        .catch(() => {});
    };
    if (Platform.OS === "web") {
      persist();
      return;
    }
    const timer = setTimeout(persist, 250);
    const listener = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        clearTimeout(timer);
        persist();
      }
    });
    return () => {
      clearTimeout(timer);
      listener.remove();
    };
  }, [data, ready]);
  useEffect(
    () => setHapticsEnabled(data.preferences.haptics),
    [data.preferences.haptics],
  );
  const value = useMemo(
    () => ({ data, set: setData, ready, signed, signin }),
    [data, ready, signed],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useStore = () => useContext(Context);
