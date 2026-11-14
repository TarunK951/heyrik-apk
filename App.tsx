import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useStore } from "./src/store";
import { Auth } from "./src/Auth";
import { AgentHome, AgentEditor } from "./src/Agents";
import { Workspace } from "./src/Workspace";
import {
  T,
  IB,
  Icon,
  Button,
  Card,
  Row,
  Heading,
  Field,
  Sheet,
  Badge,
  art,
  C,
  s,
} from "./src/ui";
import { useRouter, useLocalSearchParams } from "expo-router";
import { modules } from "./src/catalog";
export function AppContent() {
  const { ready, data, signed, signin } = useStore();
  const router = useRouter();
  const params = useLocalSearchParams<{ page?: string; agent?: string }>();
  const [sheet, ss] = useState("");
  const [query, sq] = useState("");
  const [toast, st] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const current = { page: params.page || "AI Agents", param: params.agent };
  const nested = ![
    "AI Agents",
    "Campaigns",
    "CRM",
    "Call Logs",
    "More",
  ].includes(current.page);
  const notify = (message: string) => {
    st(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => st(""), 3500);
  };
  const open = (page: string, param?: string) => {
    ss("");
    sq("");
    router.push({
      pathname: "/[page]",
      params: { page, ...(param ? { agent: param } : {}) },
    });
  };
  const root = (page: string) => {
    ss("");
    router.replace({ pathname: "/[page]", params: { page } });
  };
  const back = () => (router.canGoBack() ? router.back() : router.replace("/"));
  const signOut = () => {
    signin(false);
    router.replace("/");
  };
  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [current.page, current.param]);
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (sheet) {
        ss("");
        return true;
      }

      return false;
    });
    return () => sub.remove();
  }, [sheet]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  if (!ready) return <ActivityIndicator style={{ flex: 1 }} color="#111" />;
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "bottom"]}
    >
      <StatusBar style="dark" />
      {!signed ? (
        <Auth onEnter={() => signin(true)} />
      ) : (
        <>
          <View style={styles.top}>
            {nested ? (
              <IB name="arrow-left" label="Go back" onPress={back} />
            ) : (
              <Image
                source={art.logo}
                style={{ width: 111, height: 34 }}
                resizeMode="contain"
              />
            )}
            <View style={{ flex: 1 }} />
            {nested && (
              <T
                numberOfLines={1}
                style={{ fontFamily: "GeistSemi", fontSize: 14, flex: 4 }}
              >
                {current.page === "Agent" ? "Agent studio" : current.page}
              </T>
            )}
            <IB
              name="search"
              label="Search workspace"
              onPress={() => ss("Search workspace")}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open billing"
              onPress={() => open("Billing")}
              style={styles.credit}
            >
              <Icon name="database" size={14} />
              <T style={{ fontSize: 12, fontFamily: "GeistSemi" }}>
                {data.balance}
              </T>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Account menu"
              onPress={() => ss("Account")}
            >
              <Image
                source={art.ember}
                style={{ width: 35, height: 35, borderRadius: 18 }}
              />
              <T
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  top: 10,
                  fontSize: 11,
                  fontFamily: "GeistSemi",
                }}
              >
                {data.profile.name.slice(0, 1)}
              </T>
            </Pressable>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              ref={scroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                padding: 22,
                gap: 23,
                paddingBottom: 30,
                width: "100%",
                maxWidth: 720,
                alignSelf: "center",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <View
                  style={{
                    height: 5,
                    width: 5,
                    borderRadius: 3,
                    backgroundColor: "#c6a8de",
                  }}
                />
                <T style={{ fontSize: 10, color: "#909095", letterSpacing: 1 }}>
                  LOCAL DEMO WORKSPACE
                </T>
              </View>
              {current.page === "AI Agents" ? (
                <AgentHome open={open} />
              ) : current.page === "Agent" ? (
                <AgentEditor id={current.param} open={open} notify={notify} />
              ) : current.page === "More" ? (
                <>
                  <Heading
                    title="Your workspace"
                    sub="Everything you need, in one place."
                  />
                  {[
                    "Build",
                    "Channels",
                    "Integrations",
                    "Campaigns",
                    "Sales",
                    "Insights",
                    "Account",
                  ].map((group) => (
                    <View key={group} style={{ gap: 5 }}>
                      <T style={s.eyebrow}>{group.toUpperCase()}</T>
                      {modules
                        .filter((m) => m[2] === group)
                        .map((m) => (
                          <Pressable
                            key={m[0]}
                            accessibilityRole="button"
                            onPress={() => open(m[0])}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 15,
                              paddingVertical: 15,
                              borderBottomWidth: 1,
                              borderColor: C.line,
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: C.soft,
                                borderRadius: 13,
                                padding: 11,
                              }}
                            >
                              <Icon name={m[1]} size={19} />
                            </View>
                            <T
                              style={{
                                flex: 1,
                                fontSize: 15,
                                fontFamily: "GeistSemi",
                              }}
                            >
                              {m[0]}
                            </T>
                            <Icon name="chevron-right" size={17} color="#999" />
                          </Pressable>
                        ))}
                    </View>
                  ))}
                </>
              ) : (
                <Workspace
                  key={current.page + current.param}
                  page={current.page}
                  param={current.param}
                  open={open}
                  notify={notify}
                  signOut={signOut}
                />
              )}
              <Card
                style={{
                  backgroundColor: "#f7f7f8",
                  borderWidth: 0,
                  padding: 17,
                }}
                onPress={() => open("Ask Rik")}
              >
                <View style={s.between}>
                  <Image
                    source={art.orb}
                    style={{ width: 32, height: 32, borderRadius: 16 }}
                  />
                  <View style={{ flex: 1, gap: 4 }}>
                    <T style={{ fontSize: 13, fontFamily: "GeistSemi" }}>
                      A little help from Rik
                    </T>
                    <T style={{ fontSize: 11, color: C.muted }}>
                      Find your next step
                    </T>
                  </View>
                  <Icon name="arrow-up-right" size={17} />
                </View>
              </Card>
            </ScrollView>
          </KeyboardAvoidingView>
          <View style={styles.nav}>
            {[
              ["AI Agents", "cpu", "Agents"],
              ["Campaigns", "send", "Campaigns"],
              ["CRM", "users", "CRM"],
              ["Call Logs", "phone", "Calls"],
              ["More", "grid", "More"],
            ].map(([page, icon, label]) => {
              const active =
                current.page === page ||
                (page === "AI Agents" && current.page === "Agent") ||
                (page === "More" &&
                  ![
                    "AI Agents",
                    "Agent",
                    "Campaigns",
                    "CRM",
                    "Call Logs",
                  ].includes(current.page));
              return (
                <Pressable
                  key={page}
                  accessibilityRole="tab"
                  accessibilityLabel={label}
                  accessibilityState={{ selected: active }}
                  onPress={() => root(page)}
                  style={styles.navItem}
                >
                  <View
                    style={[
                      styles.navIcon,
                      active && { backgroundColor: "#111" },
                    ]}
                  >
                    <Icon
                      name={icon}
                      size={19}
                      color={active ? "#fff" : "#999"}
                    />
                  </View>
                  <T
                    style={{
                      fontSize: 10,
                      fontFamily: active ? "GeistSemi" : "Geist",
                      color: active ? "#111" : "#999",
                    }}
                  >
                    {label}
                  </T>
                </Pressable>
              );
            })}
          </View>
          {sheet && (
            <Sheet title={sheet} onClose={() => ss("")}>
              {sheet === "Search workspace" ? (
                <>
                  <Field
                    placeholder="Search pages and agents…"
                    value={query}
                    onChangeText={sq}
                  />
                  {modules
                    .filter((m) =>
                      m[0].toLowerCase().includes(query.toLowerCase()),
                    )
                    .map((m) => (
                      <Row
                        key={m[0]}
                        title={m[0]}
                        sub={m[2]}
                        onPress={() => open(m[0])}
                      />
                    ))}
                  {data.agents
                    .filter((a) =>
                      a.name.toLowerCase().includes(query.toLowerCase()),
                    )
                    .map((a) => (
                      <Row
                        key={a.id}
                        title={a.name}
                        sub="Assistant"
                        onPress={() => open("Agent", a.id)}
                      />
                    ))}
                </>
              ) : (
                <>
                  <T style={s.h2}>{data.profile.name}</T>
                  <T style={s.sub}>{data.profile.email}</T>
                  <Badge label="Local demo" />
                  {[
                    "Settings",
                    "Billing",
                    "API keys",
                    "Planning tools",
                    "Help & support",
                  ].map((x) => (
                    <Row key={x} title={x} onPress={() => open(x)} />
                  ))}
                  <Row
                    title="Notifications"
                    onPress={() => {
                      ss("");
                      notify("You’re all caught up. No new notifications.");
                    }}
                  />
                  <Button
                    outline
                    label="Sign out"
                    onPress={() => {
                      ss("");
                      signOut();
                    }}
                  />
                </>
              )}
            </Sheet>
          )}
        </>
      )}
      {!!toast && (
        <View accessibilityLiveRegion="polite" style={styles.toast}>
          <T style={{ color: "white", fontSize: 13, lineHeight: 19 }}>
            {toast}
          </T>
        </View>
      )}
    </SafeAreaView>
  );
}
export default AppContent;
const styles = StyleSheet.create({
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f2",
  },
  credit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.line,
  },
  nav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: C.line,
    paddingTop: 9,
    paddingBottom: 7,
    backgroundColor: "white",
  },
  navItem: { flex: 1, alignItems: "center", gap: 5 },
  navIcon: {
    width: 43,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  toast: {
    position: "absolute",
    bottom: 95,
    left: 20,
    right: 20,
    backgroundColor: "#171719",
    padding: 16,
    borderRadius: 16,
    maxWidth: 650,
    alignSelf: "center",
  },
});
