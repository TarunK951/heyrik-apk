import React, { useState } from "react";
import { View, Image } from "react-native";
import { T, Field, Button, Choices, art, C, s } from "../ui";
type Message = { role: "you" | "rik"; text: string };
const topics = [
  {
    title: "Build an agent",
    page: "AI Agents",
    words: /agent|create|build|voice/i,
    answer:
      "Start with a brief or a template in Agents. Then choose a voice, add instructions, and review call settings.",
  },
  {
    title: "Connect a number",
    page: "Phone Numbers",
    words: /number|phone|sip/i,
    answer:
      "Open Phone Numbers to choose a sample number or walk through your provider setup.",
  },
  {
    title: "Start a campaign",
    page: "Campaigns",
    words: /campaign|outreach|contact/i,
    answer:
      "Choose an agent and calling number, add contacts, and pick a schedule. You can save a local draft.",
  },
  {
    title: "Understand credits",
    page: "Billing",
    words: /credit|bill|cost|plan|payment/i,
    answer:
      "One credit is approximately one minute of talk time. Billing shows your demo balance and plan.",
  },
];
export function RikChat({ open }: { open: (page: string) => void }) {
  const [text, st] = useState(""),
    [messages, sm] = useState<Message[]>([]),
    [destination, sd] = useState("");
  const send = (query: string) => {
    if (!query.trim()) return;
    const topic = topics.find((t) => t.words.test(query));
    sm((old) => [
      ...old,
      { role: "you", text: query },
      {
        role: "rik",
        text:
          topic?.answer ||
          "I can help you find agents, phone numbers, campaigns, and billing. Which would you like to work on?",
      },
    ]);
    sd(topic?.page || "");
    st("");
  };
  return (
    <>
      <View style={[s.between, { justifyContent: "flex-start" }]}>
        <Image
          source={art.orb}
          style={{ width: 42, height: 42, borderRadius: 21 }}
        />
        <View style={{ gap: 4 }}>
          <T style={s.h2}>Rik</T>
          <T style={{ fontSize: 12, color: C.muted }}>
            Your workspace companion
          </T>
        </View>
      </View>
      <T style={{ fontSize: 11, color: C.muted }}>
        Scripted preview · no AI service connected
      </T>
      <View style={{ gap: 14 }}>
        <View
          style={{
            alignSelf: "flex-start",
            maxWidth: "92%",
            padding: 16,
            backgroundColor: "#f5f5f7",
            borderRadius: 18,
            borderBottomLeftRadius: 5,
          }}
        >
          <T style={{ fontSize: 14, lineHeight: 21 }}>
            Hi! What would you like to do today?
          </T>
        </View>
        {messages.map((m, i) => (
          <View
            key={i}
            style={{
              alignSelf: m.role === "you" ? "flex-end" : "flex-start",
              maxWidth: "92%",
              padding: 16,
              backgroundColor: m.role === "you" ? "#111" : "#f5f5f7",
              borderRadius: 18,
            }}
          >
            <T
              style={{
                fontSize: 14,
                lineHeight: 21,
                color: m.role === "you" ? "#fff" : "#111",
              }}
            >
              {m.text}
            </T>
          </View>
        ))}
      </View>
      {!messages.length && (
        <Choices items={topics.map((t) => t.title)} value="" onChange={send} />
      )}
      <View style={{ gap: 10 }}>
        <Field
          placeholder="Ask Rik a question…"
          value={text}
          onChangeText={st}
        />
        <Button
          label="Send message"
          icon="arrow-up"
          disabled={!text.trim()}
          onPress={() => send(text)}
        />
        {!!destination && (
          <Button
            outline
            label={"Open " + destination}
            icon="arrow-up-right"
            onPress={() => open(destination)}
          />
        )}
      </View>
    </>
  );
}
