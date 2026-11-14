import React, { useState } from "react";
import {
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { T, Button, Field, Heading, Choices, Card, art, s, C, IB } from "./ui";
import { useStore } from "./store";
import { languages, makeAgent } from "./catalog";
export function Auth({ onEnter }: { onEnter: () => void }) {
  const { data, set } = useStore();
  const [mode, modeSet] = useState("login");
  const [email, emailSet] = useState("");
  const [password, passwordSet] = useState("");
  const [name, nameSet] = useState("");
  const [show, showSet] = useState(false);
  const [error, errorSet] = useState("");
  const [step, stepSet] = useState(1);
  const [langs, langsSet] = useState(["English"]);
  const [more, moreSet] = useState(false);
  const [purpose, purposeSet] = useState("");
  const enter = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      errorSet("Enter a valid email address.");
      return;
    }
    if (mode !== "forgot" && password.length < 6) {
      errorSet("Use at least 6 characters for the demo password.");
      return;
    }
    errorSet("");
    if (mode === "forgot") {
      modeSet("sent");
      return;
    }
    set((d) => ({
      ...d,
      profile: { ...d.profile, name: name || d.profile.name, email },
    }));
    if (data.onboarded) onEnter();
    else modeSet("setup");
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 24,
          gap: 23,
          paddingBottom: 45,
          maxWidth: 520,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <Image
          source={art.logo}
          resizeMode="contain"
          style={{
            width: 118,
            height: 38,
            alignSelf: "flex-start",
            marginVertical: 10,
          }}
        />
        {mode === "setup" ? (
          <>
            <T style={s.eyebrow}>STEP {step} OF 2 · YOUR CALLING WORKSPACE</T>
            <Heading
              title={
                step === 1
                  ? "Which languages do your callers speak?"
                  : "What will you use calls for?"
              }
              sub={
                step === 1
                  ? "Choose one or more. Your starter agent will speak these languages and switch naturally during calls."
                  : "Pick your main use case. Your agent is a starting point — tune its voice and add your business details later."
              }
            />
            {step === 1 ? (
              <>
                <Choices
                  items={more ? languages : languages.slice(0, 4)}
                  multiple
                  value={langs}
                  onChange={langsSet}
                />
                <Button
                  outline
                  label={more ? "Fewer languages" : "More languages"}
                  onPress={() => moreSet(!more)}
                />
                <Card>
                  <T style={s.label}>Start calls in</T>
                  <Choices
                    items={langs}
                    value={langs[0]}
                    onChange={(x: string) =>
                      langsSet([x, ...langs.filter((v) => v !== x)])
                    }
                  />
                </Card>
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
                onChange={purposeSet}
              />
            )}
            <Button
              label={step === 1 ? "Continue" : "Create my agent"}
              disabled={step === 1 ? !langs.length : !purpose}
              onPress={() => {
                if (step === 1) stepSet(2);
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
            {step === 2 && (
              <Button outline label="Back" onPress={() => stepSet(1)} />
            )}
            <Button
              outline
              label="Skip setup — create my own agent"
              onPress={() => {
                set((d) => ({ ...d, onboarded: true }));
                onEnter();
              }}
            />
          </>
        ) : (
          <>
            <View
              style={{
                padding: 23,
                paddingTop: 38,
                gap: 8,
                borderRadius: 24,
                overflow: "hidden",
              }}
            >
              <Image
                source={art.login}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
              <T style={{ fontSize: 12 }}>You can easily</T>
              <T
                style={{
                  fontSize: 27,
                  lineHeight: 31,
                  fontFamily: "GeistSemi",
                  letterSpacing: -1,
                }}
              >
                Launch voice agents{"\n"}that sound human.
              </T>
              <T style={{ fontSize: 12, lineHeight: 18 }}>
                Your AI calling workspace, wherever you are.
              </T>
            </View>
            <Heading
              title={
                mode === "signup"
                  ? "Create your account"
                  : mode === "forgot"
                    ? "Forgot your password?"
                    : mode === "sent"
                      ? "Check your email"
                      : "Welcome back"
              }
              sub={
                mode === "sent"
                  ? "Demo reset request recorded locally. No email was sent."
                  : mode === "forgot"
                    ? "Enter your email and we’ll help you reset your password."
                    : "Sign in to access your assistants, calls and pipeline — anytime, anywhere."
              }
            />
            {(mode === "login" || mode === "signup") && (
              <>
                <Button
                  label="G   Continue with Google"
                  outline
                  onPress={() => {
                    emailSet("alex@example.com");
                    passwordSet("demo123");
                    set((d) => ({
                      ...d,
                      profile: {
                        ...d.profile,
                        name: "Alex",
                        email: "alex@example.com",
                      },
                    }));
                    if (data.onboarded) onEnter();
                    else modeSet("setup");
                  }}
                />
                <T
                  style={{ textAlign: "center", fontSize: 12, color: C.muted }}
                >
                  ──────── or continue with email ────────
                </T>
              </>
            )}
            {mode === "signup" && (
              <Field
                label="Full name"
                placeholder="Your name"
                value={name}
                onChangeText={nameSet}
              />
            )}
            {mode !== "sent" && (
              <Field
                label="Your email"
                placeholder="you@company.com"
                keyboardType="email-address"
                value={email}
                onChangeText={emailSet}
              />
            )}
            {(mode === "login" || mode === "signup") && (
              <>
                <View style={s.between}>
                  <T style={s.label}>Password</T>
                  <T
                    accessibilityRole="button"
                    onPress={() => {
                      modeSet("forgot");
                      errorSet("");
                    }}
                    style={{ fontSize: 12 }}
                  >
                    Forgot password?
                  </T>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Field
                    style={{ flex: 1 }}
                    label={undefined}
                    placeholder="At least 6 characters"
                    value={password}
                    onChangeText={passwordSet}
                    secureTextEntry={!show}
                  />
                  <IB
                    name={show ? "eye-off" : "eye"}
                    label="Show password"
                    onPress={() => showSet(!show)}
                  />
                </View>
              </>
            )}
            {!!error && (
              <T style={{ color: "#c63e3e", fontSize: 12 }}>{error}</T>
            )}
            {mode !== "sent" && (
              <Button
                label={
                  mode === "forgot"
                    ? "Send reset link"
                    : mode === "signup"
                      ? "Create account"
                      : "Sign in"
                }
                onPress={enter}
                icon="arrow-right"
              />
            )}
            <T
              style={{
                fontSize: 11,
                color: C.muted,
                lineHeight: 18,
                textAlign: "center",
              }}
            >
              Frontend demo · No real authentication or emails.{"\n"}Use any
              email and a password of 6+ characters.
            </T>
            <Button
              outline
              label={
                mode === "login"
                  ? "Don’t have an account? Sign up"
                  : "Back to sign in"
              }
              onPress={() => {
                modeSet(mode === "login" ? "signup" : "login");
                errorSet("");
              }}
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
