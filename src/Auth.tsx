import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from "react-native";
import {
  T,
  Button,
  Field,
  Heading,
  Choices,
  Card,
  art,
  s,
  C,
  Icon,
} from "./ui";
import { useStore } from "./store";
import { languages, makeAgent } from "./catalog";
import { tapFeedback } from "./feedback";
export function Auth({ onEnter }: { onEnter: () => void }) {
  const { data, set } = useStore();
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [mode, sm] = useState("login"),
    [email, se] = useState(""),
    [password, sp] = useState(""),
    [name, sn] = useState(""),
    [visible, sv] = useState(false),
    [error, serr] = useState(""),
    [step, ss] = useState(1),
    [langs, sl] = useState(["English"]),
    [more, sMore] = useState(false),
    [purpose, sPurpose] = useState("");
  useEffect(
    () => scroll.current?.scrollTo({ y: 0, animated: false }),
    [mode, step],
  );
  const enter = () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      serr("Enter a valid email address.");
      return;
    }
    if (mode !== "forgot" && password.length < 6) {
      serr("Use at least 6 characters.");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      serr("Enter your name.");
      return;
    }
    serr("");
    if (mode === "forgot") {
      sm("sent");
      return;
    }
    set((d) => ({
      ...d,
      profile: {
        ...d.profile,
        name: name.trim() || d.profile.name,
        email: email.trim(),
      },
    }));
    if (data.onboarded) onEnter();
    else sm("setup");
  };
  const link = (text: string, action: () => void) => (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        tapFeedback();
        serr("");
        action();
      }}
      style={{ minHeight: 44, justifyContent: "center", alignSelf: "center" }}
    >
      <T style={{ fontSize: 13, fontFamily: "GeistSemi" }}>{text}</T>
    </Pressable>
  );
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          paddingHorizontal: 26,
          paddingTop: 32,
          paddingBottom: 30,
          gap: 22,
          flexGrow: 1,
          width: "100%",
          maxWidth: 460,
          alignSelf: "center",
        }}
      >
        <View
          style={{
            height: 70,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Image
            source={art.logo}
            resizeMode="contain"
            style={{ width: 125, height: 38 }}
          />
        </View>
        {mode === "setup" ? (
          <>
            <T style={s.eyebrow}>STEP {step} OF 2</T>
            <Heading
              title={step === 1 ? "Speak their language." : "Make it your own."}
              sub={
                step === 1
                  ? "Which languages do your callers speak?"
                  : "What will you use calls for?"
              }
            />
            {step === 1 ? (
              <>
                <Choices
                  items={more ? languages : languages.slice(0, 4)}
                  multiple
                  value={langs}
                  onChange={sl}
                />
                {link(more ? "Show fewer languages" : "More languages", () =>
                  sMore(!more),
                )}
                {langs.length > 1 && (
                  <Card>
                    <T style={s.label}>Start calls in</T>
                    <Choices
                      items={langs}
                      value={langs[0]}
                      onChange={(x: string) =>
                        sl([x, ...langs.filter((v) => v !== x)])
                      }
                    />
                  </Card>
                )}
              </>
            ) : (
              <Choices
                items={[
                  "Real estate",
                  "Recruiting",
                  "Clinics & appointments",
                  "Education & admissions",
                  "Sales & lead qualification",
                  "Customer support",
                  "Payment reminders",
                  "Other",
                ]}
                value={purpose}
                onChange={sPurpose}
              />
            )}
            <Button
              label={step === 1 ? "Continue" : "Create my agent"}
              icon="arrow-right"
              disabled={step === 1 ? !langs.length : !purpose}
              onPress={() => {
                if (step === 1) ss(2);
                else {
                  set((d) => ({
                    ...d,
                    onboarded: true,
                    agents: [
                      ...d.agents,
                      {
                        ...makeAgent(purpose + " agent", purpose),
                        languages: langs,
                      },
                    ],
                  }));
                  onEnter();
                }
              }}
            />
            {step === 2 && link("Back", () => ss(1))}
            {link("Skip setup for now", () => {
              set((d) => ({ ...d, onboarded: true }));
              onEnter();
            })}
          </>
        ) : (
          <>
            <Heading
              title={
                mode === "login"
                  ? "Welcome back."
                  : mode === "signup"
                    ? "Start something great."
                    : mode === "forgot"
                      ? "Reset your password."
                      : "Check your email."
              }
              sub={
                mode === "sent"
                  ? "Demo request saved. No email was sent."
                  : mode === "forgot"
                    ? "Enter the email you use for your workspace."
                    : "Your calling workspace, wherever you are."
              }
            />
            {(mode === "login" || mode === "signup") && (
              <>
                <Button
                  outline
                  label="Continue with Google"
                  onPress={() => {
                    set((d) => ({
                      ...d,
                      profile: {
                        ...d.profile,
                        name: "Alex",
                        email: "alex@example.com",
                      },
                    }));
                    if (data.onboarded) onEnter();
                    else sm("setup");
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <View
                    style={{ height: 1, backgroundColor: C.line, flex: 1 }}
                  />
                  <T style={{ fontSize: 11, color: C.muted }}>or with email</T>
                  <View
                    style={{ height: 1, backgroundColor: C.line, flex: 1 }}
                  />
                </View>
              </>
            )}
            <View style={{ gap: 18 }}>
              {mode === "signup" && (
                <Field
                  label="Full name"
                  placeholder="Your name"
                  value={name}
                  onChangeText={sn}
                />
              )}
              {mode !== "sent" && (
                <Field
                  label="Email"
                  keyboardType="email-address"
                  placeholder="you@company.com"
                  value={email}
                  onChangeText={se}
                />
              )}
              {(mode === "login" || mode === "signup") && (
                <View style={{ gap: 8 }}>
                  <View style={s.between}>
                    <T style={s.label}>Password</T>
                    {mode === "login" && (
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => {
                          sm("forgot");
                          serr("");
                        }}
                        style={{ minHeight: 26, justifyContent: "center" }}
                      >
                        <T style={{ fontSize: 12, color: "#666" }}>
                          Forgot password?
                        </T>
                      </Pressable>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: C.line,
                      borderRadius: 14,
                      paddingRight: 4,
                    }}
                  >
                    <TextInput
                      accessibilityLabel="Password"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={!visible}
                      placeholder="At least 6 characters"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={sp}
                      onSubmitEditing={enter}
                      returnKeyType="go"
                      style={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: 50,
                        paddingHorizontal: 15,
                        fontFamily: "Geist",
                        fontSize: 15,
                        color: C.ink,
                      }}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={
                        visible ? "Hide password" : "Show password"
                      }
                      onPress={() => sv(!visible)}
                      style={{
                        height: 44,
                        width: 44,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon
                        name={visible ? "eye-off" : "eye"}
                        color="#888"
                        size={18}
                      />
                    </Pressable>
                  </View>
                </View>
              )}
              {!!error && (
                <T
                  accessibilityRole="alert"
                  style={{ color: "#b83737", fontSize: 12 }}
                >
                  {error}
                </T>
              )}
              {mode !== "sent" && (
                <Button
                  label={
                    mode === "login"
                      ? "Sign in"
                      : mode === "signup"
                        ? "Create account"
                        : "Send reset link"
                  }
                  icon="arrow-right"
                  onPress={enter}
                />
              )}
            </View>
            {link(
              mode === "login"
                ? "New to HeyRik? Create an account"
                : "Back to sign in",
              () => sm(mode === "login" ? "signup" : "login"),
            )}
            <View style={{ flex: 1, minHeight: 6 }} />
            <T
              style={{
                fontSize: 11,
                color: "#999",
                textAlign: "center",
                lineHeight: 17,
              }}
            >
              Preview mode · Use any email and a 6+ character password.
            </T>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
