import { BrandLoader } from "./src/components/BrandLoader";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useStore } from "./src/store";
import { Auth } from "./src/Auth";
import { AgentHome, AgentEditor } from "./src/Agents";
import {
  T,
  IB,
  Icon,
  Button,
  Row,
  Heading,
  Field,
  Sheet,
  Badge,
  art,
  C,
  s,
} from "./src/ui";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { tabHref, registerTabScroll } from "./src/navigation";
import { modules } from "./src/catalog";
import { Workspace } from "./src/Workspace";
// Isolate screen content from transient header, toast and scroll updates.
const MemoAgentHome = React.memo(AgentHome);
const MemoAgentEditor = React.memo(AgentEditor);
const MemoWorkspace = React.memo(Workspace);
export function AppContent({
  fixedPage,
  inTab = false,
}: { fixedPage?: string; inTab?: boolean } = {}) {
  const insets = useSafeAreaInsets();
  const { ready, data, signed, signin } = useStore();
  const router = useRouter();
  const params = useLocalSearchParams<{ page?: string; agent?: string }>();
  const [sheet, ss] = useState("");
  const [query, sq] = useState("");
  const [toast, st] = useState("");
  const [showTop, setShowTop] = useState(false);
  const topState = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const current = {
    page: fixedPage || params.page || "AI Agents",
    param: params.agent,
  };
  const nested = ![
    "AI Agents",
    "Campaigns",
    "CRM",
    "Call Logs",
    "More",
  ].includes(current.page);
  const notify = useCallback((message: string) => {
    st(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => st(""), 3500);
  }, []);
  const open = useCallback(
    (page: string, param?: string) => {
      const main = tabHref(page);
      if (main) {
        ss("");
        router.navigate(main);
        return;
      }
      ss("");
      sq("");
      router.push({
        pathname: "/[page]",
        params: { page, ...(param ? { agent: param } : {}) },
      });
    },
    [router],
  );
  const back = () => (router.canGoBack() ? router.back() : router.replace("/"));
  const signOut = useCallback(() => {
    signin(false);
    router.replace("/");
  }, [router, signin]);
  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [current.page, current.param]);
  useEffect(() => {
    if (!inTab) return;
    return registerTabScroll(current.page, () =>
      scroll.current?.scrollTo({ y: 0, animated: true }),
    );
  }, [current.page, inTab]);
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
  if (!ready) return <BrandLoader />;
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={
        Platform.OS !== "web" && nested
          ? ["bottom"]
          : inTab
            ? ["top"]
            : ["top", "bottom"]
      }
    >
      <StatusBar style="dark" />
      {nested && (
        <Stack.Screen
          options={{
            headerShown: Platform.OS !== "web" && nested,
            title: current.page === "Agent" ? "Agent studio" : current.page,
            headerBackButtonDisplayMode: "minimal",
            headerShadowVisible: false,
            headerTintColor: "#111",
            headerTitleStyle: { fontFamily: "GeistSemi" },
          }}
        />
      )}

      {!signed ? (
        <Auth
          onEnter={() => {
            signin(true);
            router.replace("/(tabs)/agents");
          }}
        />
      ) : (
        <>
          {!(Platform.OS !== "web" && nested) && (
            <View style={styles.top}>
              {nested ? (
                <IB name="arrow-left" label="Go back" onPress={back} />
              ) : (
                <Image
                  source={art.mark}
                  style={{ width: 36, height: 36 }}
                  resizeMode="contain"
                />
              )}
              {!nested && <View style={{ flex: 1 }} />}
              {nested && (
                <T
                  numberOfLines={1}
                  style={{ fontFamily: "GeistSemi", fontSize: 15, flex: 1 }}
                >
                  {current.page === "Agent" ? "Agent studio" : current.page}
                </T>
              )}
              {!nested && (
                <>
                  <IB
                    name="message-circle"
                    label="Ask Rik"
                    onPress={() => open("Ask Rik")}
                  />
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
                </>
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Account menu"
                onPress={() => ss("Account")}
              >
                <Image
                  source={
                    data.profile.photo ? { uri: data.profile.photo } : art.ember
                  }
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
          )}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              ref={scroll}
              scrollEventThrottle={100}
              onScroll={(event) => {
                const show = event.nativeEvent.contentOffset.y > 450;
                if (show !== topState.current) {
                  topState.current = show;
                  setShowTop(show);
                }
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              contentContainerStyle={{
                padding: 22,
                gap: 23,
                paddingBottom: inTab ? 100 + insets.bottom : 30,
                width: "100%",
                maxWidth: 720,
                alignSelf: "center",
              }}
            >
              {current.page === "AI Agents" ? (
                <MemoAgentHome open={open} />
              ) : current.page === "Agent" ? (
                <MemoAgentEditor
                  id={current.param}
                  open={open}
                  notify={notify}
                />
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
                    "Insights",
                    "Account",
                  ].map((group) => (
                    <View key={group} style={{ gap: 5 }}>
                      <T style={s.eyebrow}>{group.toUpperCase()}</T>
                      {modules
                        .filter((m) => m[2] === group && !tabHref(m[0]))
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
                <MemoWorkspace
                  key={current.page + current.param}
                  page={current.page}
                  param={current.param}
                  open={open}
                  notify={notify}
                  signOut={signOut}
                />
              )}
            </ScrollView>
          </KeyboardAvoidingView>
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
                    "Ask Rik",
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
      {showTop && signed && (
        <View
          style={{ position: "absolute", bottom: inTab ? 100 : 22, right: 20 }}
        >
          <IB
            name="arrow-up"
            label="Back to top"
            onPress={() => scroll.current?.scrollTo({ y: 0, animated: true })}
          />
        </View>
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
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
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
