import React, { useState } from "react";
import { View, Image } from "react-native";
import { T, Field, Button, Choices, IB, Sheet, Row, art, C, s } from "../ui";
import { useStore } from "../store";
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
  const { data, set } = useStore();
  const [id, setId] = useState<string | null>(data.rikChats[0]?.id || null);
  const [sheet, setSheet] = useState("");
  const [name, setName] = useState("");
  const thread = data.rikChats.find((c) => c.id === id);
  const messages: Message[] = thread?.messages || [];
  const [text, st] = useState(""),
    [destination, sd] = useState(thread?.destination || "");
  const send = (query: string) => {
    if (!query.trim()) return;
    const topic = topics.find((t) => t.words.test(query));
    const nextMessages = [
      ...messages,
      { role: "you", text: query },
      {
        role: "rik",
        text:
          topic?.answer ||
          "I can help you find agents, phone numbers, campaigns, and billing. Which would you like to work on?",
      },
    ];
    const nextId = id || "chat-" + (data.rikChats.length + 1);
    const nextThread = {
      id: nextId,
      name: thread?.name || query.trim().slice(0, 60),
      messages: nextMessages,
      destination: topic?.page || "",
    };
    set((d) => ({
      ...d,
      rikChats: thread
        ? d.rikChats.map((c) => (c.id === nextId ? nextThread : c))
        : [nextThread, ...d.rikChats],
    }));
    setId(nextId);
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
        <View style={{ gap: 4, flex: 1, minWidth: 0 }}>
          <T style={s.h2}>Rik</T>
          <T numberOfLines={1} style={{ fontSize: 12, color: C.muted }}>
            {thread?.name || "Your workspace companion"}
          </T>
        </View>
        <IB
          name="plus"
          label="New chat"
          onPress={() => {
            setId(null);
            st("");
            sd("");
          }}
        />
        <IB
          name="clock"
          label="Chat history"
          onPress={() => setSheet("Chat history")}
        />
      </View>
      <T style={{ fontSize: 11, color: C.muted }}>
        Scripted preview · no AI service connected
      </T>
      {!!thread && (
        <Button
          outline
          small
          label="Rename chat"
          onPress={() => {
            setName(thread.name);
            setSheet("Rename chat");
          }}
        />
      )}
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
      {!!sheet && (
        <Sheet title={sheet} onClose={() => setSheet("")}>
          {sheet === "Chat history" ? (
            <>
              {!data.rikChats.length && (
                <T style={s.sub}>Your local conversations will appear here.</T>
              )}
              {data.rikChats.map((c) => (
                <Row
                  key={c.id}
                  title={c.name}
                  sub={(c.messages?.length || 0) + " messages · On this device"}
                  onPress={() => {
                    setId(c.id);
                    sd(c.destination || "");
                    st("");
                    setSheet("");
                  }}
                />
              ))}
            </>
          ) : (
            <>
              <Field label="Chat title" value={name} onChangeText={setName} />
              <Button
                label="Save title"
                disabled={!name.trim()}
                onPress={() => {
                  set((d) => ({
                    ...d,
                    rikChats: d.rikChats.map((c) =>
                      c.id === id ? { ...c, name: name.trim() } : c,
                    ),
                  }));
                  setSheet("");
                }}
              />
            </>
          )}
        </Sheet>
      )}
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
