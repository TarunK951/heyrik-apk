import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Agent, makeAgent } from "./catalog";
export type RecordItem = { id: string; name: string; [key: string]: any };
type State = {
  preferences: { rikSize: string };
  profile: { name: string; email: string; phone: string };
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
  preferences: { rikSize: "Medium" },
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
  const [data, setData] = useState(initial);
  const [signed, signin] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem("heyrik-demo-v1")
      .then((v) => {
        if (v) {
          try {
            setData({ ...initial, ...JSON.parse(v) });
          } catch {}
        }
      })
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (ready)
      AsyncStorage.setItem("heyrik-demo-v1", JSON.stringify(data)).catch(
        () => {},
      );
  }, [data, ready]);
  return (
    <Context.Provider value={{ data, set: setData, ready, signed, signin }}>
      {children}
    </Context.Provider>
  );
}
export const useStore = () => useContext(Context);
