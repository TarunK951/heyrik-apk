import { Disclosure } from "./components/Disclosure";
import { Select } from "./components/Select";
import { OrbPicker, orbSource } from "./components/OrbPicker";
import React, { useState } from "react";
import { View, Image, Pressable } from "react-native";
import * as Speech from "expo-speech";
import {
  T,
  Button,
  Field,
  Heading,
  Card,
  Section,
  Stats,
  Tabs,
  Choices,
  Toggle,
  Empty,
  Row,
  Badge,
  Sheet,
  IB,
  Icon,
  art,
  s,
  C,
} from "./ui";
import {
  templates,
  makeAgent,
  editorTabs,
  voices,
  languages,
  integrations,
  Agent,
} from "./catalog";
import { useStore } from "./store";
export function AgentHome({ open }: any) {
  const { data, set } = useStore();
  const [brief, sb] = useState("");
  const [query, sq] = useState("");
  const [actions, sa] = useState<Agent | null>(null);
  const [showTemplates, stemplates] = useState(false);
  const create = (name: string) => {
    const a = makeAgent(name, brief);
    set((d) => ({ ...d, agents: [a, ...d.agents] }));
    open("Agent", a.id);
  };
  return (
    <>
      <Heading
        title={"Good afternoon, " + data.profile.name.split(" ")[0]}
        sub={
          "Create a new assistant or manage the " +
          data.agents.length +
          " you already have."
        }
      />
      <View
        style={{
          padding: 6,
          borderRadius: 25,
          overflow: "hidden",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Image
          source={art.lilac}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <Card style={{ borderRadius: 20, padding: 17 }}>
          <Field
            multiline
            inputStyle={{ borderWidth: 0, paddingHorizontal: 0, minHeight: 96 }}
            placeholder="Describe the agent you want to build…"
            value={brief}
            onChangeText={sb}
          />
          <View style={{ gap: 8, flexDirection: "row" }}>
            <Button
              style={{ flex: 1, paddingHorizontal: 8 }}
              small
              outline
              label="Blank"
              icon="edit-3"
              onPress={() => create("New Agent")}
            />
            <Button
              small
              label="Create"
              style={{ flex: 1, paddingHorizontal: 8 }}
              icon="zap"
              disabled={!brief.trim()}
              onPress={() =>
                create(
                  templates.find((name) =>
                    brief.toLowerCase().startsWith("a " + name.toLowerCase()),
                  ) || "New assistant",
                )
              }
            />
          </View>
        </Card>
      </View>
      <View style={s.between}>
        <Button
          small
          outline
          label="Browse templates"
          icon="grid"
          onPress={() => stemplates(true)}
        />
      </View>
      {showTemplates && (
        <Sheet title="Start from a template" onClose={() => stemplates(false)}>
          {templates.map((name, i) => (
            <Row
              key={name}
              title={name}
              sub={
                [
                  "Welcome callers and answer FAQs",
                  "Qualify leads and capture details",
                  "Book and confirm appointments",
                  "Answer questions from your knowledge",
                  "Introduce your offer",
                  "Follow up on payments",
                  "Collect customer feedback",
                  "Share order updates",
                ][i]
              }
              onPress={() => {
                sb(
                  "A " +
                    name.toLowerCase() +
                    " that helps customers and captures the next step.",
                );
                stemplates(false);
              }}
            />
          ))}
        </Sheet>
      )}
      <Section title={"Your assistants  " + data.agents.length}>
        <Field
          placeholder="Search assistants…"
          value={query}
          onChangeText={sq}
        />
        {data.agents
          .filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
          .map((a, i) => (
            <Card key={a.id}>
              <View style={s.between}>
                <Image
                  source={
                    a.appearance
                      ? orbSource(a.appearance)
                      : i % 2
                        ? art.cobalt
                        : art.orb
                  }
                  style={{ width: 46, height: 46, borderRadius: 23 }}
                />
                <Badge label={a.live ? "Live" : "Draft"} green={a.live} />
                <IB
                  name="more-horizontal"
                  label={"Actions for " + a.name}
                  onPress={() => sa(a)}
                />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={"Open " + a.name}
                onPress={() => open("Agent", a.id)}
                style={{ gap: 12 }}
              >
                <T style={s.h2}>{a.name}</T>
                <T style={{ color: C.muted, fontSize: 12 }}>
                  {a.voice} · {a.languages.join(", ")} ·{" "}
                  {data.files.filter((f) => f.agent === a.id).length} files
                </T>
                <View
                  style={[
                    s.between,
                    { borderTopWidth: 1, borderColor: C.line, paddingTop: 13 },
                  ]}
                >
                  <T style={{ fontSize: 12, color: C.muted }}>0 calls</T>
                  <T style={{ fontSize: 12, color: C.muted }}>0% success</T>
                  <Icon name="arrow-up-right" size={17} />
                </View>
              </Pressable>
            </Card>
          ))}
        {!data.agents.filter((a) =>
          a.name.toLowerCase().includes(query.toLowerCase()),
        ).length && (
          <Empty
            title="No assistants found"
            sub="Try another name or build a new agent."
          />
        )}
      </Section>
      {actions && (
        <Sheet title={actions.name} onClose={() => sa(null)}>
          <Button
            outline
            label="Edit assistant"
            onPress={() => {
              open("Agent", actions.id);
              sa(null);
            }}
          />
          <Button
            outline
            label="Duplicate"
            onPress={() => {
              set((d) => ({
                ...d,
                agents: [
                  ...d.agents,
                  {
                    ...actions,
                    id: Date.now().toString(),
                    name: actions.name + " copy",
                    live: false,
                  },
                ],
              }));
              sa(null);
            }}
          />
          <Button
            outline
            label="Delete local assistant"
            onPress={() => {
              set((d) => ({
                ...d,
                agents: d.agents.filter((a) => a.id !== actions.id),
              }));
              sa(null);
            }}
          />
        </Sheet>
      )}
    </>
  );
}
export function AgentEditor({ id, open, notify }: any) {
  const { data, set } = useStore();
  const a = data.agents.find((x) => x.id === id);
  const [tab, st] = useState("Details");
  const [sheet, ss] = useState("");
  const [varType, svt] = useState("Input");
  const [vn, svn] = useState("");
  const [vv, svv] = useState("");
  const [query, sq] = useState("");
  const [lang, sl] = useState("All languages");
  const [gender, sg] = useState("All genders");
  const [voiceTab, svTab] = useState("AI voices");
  const [testMode, stm] = useState("Chat");
  const [message, sm] = useState("");
  const [chat, sc] = useState<string[]>([]);
  const [testing, sTesting] = useState(false);
  if (!a)
    return (
      <Empty
        title="Assistant unavailable"
        sub="Return to AI Agents and choose another assistant."
      />
    );
  const patch = (p: Partial<Agent>) =>
    set((d) => ({
      ...d,
      agents: d.agents.map((x) => (x.id === id ? { ...x, ...p } : x)),
    }));
  const setting = (k: string, v: any) =>
    patch({ settings: { ...a.settings, [k]: v } });
  const toggle = (k: string, sub?: string) => (
    <Toggle
      key={k}
      label={k}
      sub={sub}
      value={a.settings[k]}
      onChange={(v: boolean) => setting(k, v)}
    />
  );
  const input = (k: string, suffix = "") => (
    <Field
      key={k}
      label={k + suffix}
      value={String(a.settings[k] ?? "")}
      onChangeText={(v: string) => setting(k, v)}
    />
  );
  return (
    <>
      <View style={s.between}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change assistant appearance"
          onPress={() => ss("Appearance")}
        >
          <Image
            source={orbSource(a.appearance)}
            style={{ width: 45, height: 45, borderRadius: 23 }}
          />
        </Pressable>
        <View style={{ flex: 1 }}>
          <T numberOfLines={2} style={s.h2}>
            {a.name}
          </T>
          <T style={{ fontSize: 11, color: C.green }}>Saved</T>
        </View>
        <Button
          small
          label="Test"
          icon="play"
          onPress={() => ss("Test assistant")}
        />
      </View>
      <Toggle
        label="Live"
        value={a.live}
        onChange={(v: boolean) => patch({ live: v })}
      />
      <Select
        label="Agent section"
        value={tab}
        items={editorTabs}
        onChange={(value) => {
          sq("");
          st(value);
        }}
        compact
      />
      {tab === "Details" && (
        <>
          <Field
            label="Assistant name"
            value={a.name}
            onChangeText={(name: string) => patch({ name })}
          />
          <Card>
            <Section
              title="Voice"
              action={
                <Button
                  small
                  outline
                  label="Edit"
                  onPress={() => ss("Choose a voice")}
                />
              }
            >
              <View style={s.between}>
                <View style={{ gap: 5, flex: 1, minWidth: 0 }}>
                  <T style={s.h2}>{a.voice}</T>
                  <T style={s.sub}>
                    This is the voice your assistant speaks with.
                  </T>
                </View>
              </View>
            </Section>
            <Row
              title="Languages"
              sub={a.languages.join(" · ")}
              onPress={() => ss("Languages")}
            />
          </Card>
          <Section
            title="Instructions"
            action={
              <IB
                name="zap"
                label="Agent builder"
                onPress={() => ss("Agent builder")}
              />
            }
          >
            <T style={s.sub}>
              Your agent reads these sections from top to bottom.
            </T>
            {a.sections.map((section, i) => (
              <Card key={i}>
                <Field
                  label="Section title"
                  value={section.title}
                  onChangeText={(title: string) =>
                    patch({
                      sections: a.sections.map((x, j) =>
                        j === i ? { ...x, title } : x,
                      ),
                    })
                  }
                />
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "flex-end",
                  }}
                >
                  {i > 0 && (
                    <IB
                      name="arrow-up"
                      label={"Move " + section.title + " up"}
                      onPress={() => {
                        const sections = [...a.sections];
                        [sections[i - 1], sections[i]] = [
                          sections[i],
                          sections[i - 1],
                        ];
                        patch({ sections });
                      }}
                    />
                  )}
                  {i < a.sections.length - 1 && (
                    <IB
                      name="arrow-down"
                      label={"Move " + section.title + " down"}
                      onPress={() => {
                        const sections = [...a.sections];
                        [sections[i + 1], sections[i]] = [
                          sections[i],
                          sections[i + 1],
                        ];
                        patch({ sections });
                      }}
                    />
                  )}
                  <IB
                    name="trash-2"
                    label={"Delete " + section.title}
                    onPress={() =>
                      patch({ sections: a.sections.filter((_, j) => i !== j) })
                    }
                  />
                </View>
                <Field
                  label={section.title + " instructions"}
                  multiline
                  value={section.text}
                  onChangeText={(v: string) =>
                    patch({
                      sections: a.sections.map((x, j) =>
                        j === i ? { ...x, text: v } : x,
                      ),
                    })
                  }
                />
                <Toggle
                  label="Use this section"
                  value={section.enabled}
                  onChange={(v: boolean) =>
                    patch({
                      sections: a.sections.map((x, j) =>
                        j === i ? { ...x, enabled: v } : x,
                      ),
                    })
                  }
                />
              </Card>
            ))}
            <Button
              outline
              label="Add section"
              icon="plus"
              onPress={() => ss("Add section")}
            />
          </Section>
        </>
      )}
      {tab === "Variables" && (
        <>
          <Tabs items={["Input", "Output"]} value={varType} onChange={svt} />
          <Field
            placeholder="Search variables…"
            value={query}
            onChangeText={sq}
          />
          <Heading
            title={varType + " variables"}
            sub={
              varType === "Input"
                ? "Known before the call. Use {{name}} in your instructions; the default is used when no value is supplied."
                : "Details your agent should capture during the call."
            }
          />
          {a.variables
            .filter(
              (x) =>
                x.type === varType &&
                x.name.toLowerCase().includes(query.toLowerCase()),
            )
            .map((v, i) => (
              <Card key={i}>
                <Row
                  title={v.name}
                  sub={v.value || "No default"}
                  right={
                    <IB
                      name="trash-2"
                      onPress={() =>
                        patch({ variables: a.variables.filter((x) => x !== v) })
                      }
                    />
                  }
                />
              </Card>
            ))}
          <Button
            label={"Add " + varType.toLowerCase() + " variable"}
            icon="plus"
            onPress={() => ss("Add variable")}
          />
        </>
      )}
      {tab === "Call Settings" && (
        <>
          <Disclosure title="Speaking" initiallyOpen>
            {input("Speaking speed", " (0.5× – 2×)")}
            <T style={s.label}>Delivery</T>
            <Choices
              items={["Neutral", "Cheerful", "Excited", "Empathetic", "Calm"]}
              value={a.settings.Delivery}
              onChange={(v: string) => setting("Delivery", v)}
            />
            <T style={s.label}>Personality</T>
            <Choices
              items={[
                "Professional",
                "Friendly",
                "Empathetic",
                "Energetic",
                "Concise",
              ]}
              value={a.settings.Personality}
              onChange={(v: string) => setting("Personality", v)}
            />
            {toggle("Filler phrases", "Say something while the agent thinks.")}
          </Disclosure>
          <Disclosure title="Listening">
            {input("Wait before replying", " (seconds)")}
            {toggle("Let callers interrupt")}
            {input("Silence before it checks in", " (seconds)")}
            {input("How many times it checks in")}
            {input("What it says into the silence")}
          </Disclosure>
          <Disclosure title="Handing over to a person">
            {toggle("Transfer to a person")}
            {a.settings["Transfer to a person"] && (
              <Field
                label="Transfer number"
                value={String(a.settings["Transfer number"] || "")}
                onChangeText={(v: string) => setting("Transfer number", v)}
              />
            )}
          </Disclosure>
          <Disclosure title="Ending the call">
            {input("Maximum length", " (minutes)")}
            {input("Phrases that end the call")}
          </Disclosure>
          <Disclosure title="Background sound">
            {toggle("Background sound")}
          </Disclosure>
          <Disclosure title="Post-call analytics">
            <T style={s.sub}>Report on these calls</T>
            {["Completed", "Voicemail", "No Answer", "Busy", "Failed"].map(
              (x) => toggle(x),
            )}
            <T style={s.sub}>What the report contains</T>
            {["Summary", "Transcript", "Caller mood", "Captured details"].map(
              (x) => toggle(x),
            )}
            {toggle("Send each post-call report to your server")}
            {input("Webhook address")}
            <T style={{ fontSize: 11, color: C.muted }}>
              Saved locally. No requests are sent.
            </T>
          </Disclosure>
        </>
      )}
      {tab === "Integrations" && (
        <>
          <Heading
            title="Connected apps"
            sub="Switch an app on for just this assistant."
          />
          <Button
            outline
            label="Manage connections"
            onPress={() => open("Connections")}
          />
          {integrations.map((x) => (
            <Card key={x}>
              <Toggle
                label={x}
                sub={
                  data.connections.includes(x)
                    ? "Connected locally"
                    : "Demo connection"
                }
                value={a.connections.includes(x)}
                onChange={(v: boolean) =>
                  patch({
                    connections: v
                      ? [...a.connections, x]
                      : a.connections.filter((z) => z !== x),
                  })
                }
              />
            </Card>
          ))}
          <Button
            outline
            label="Add custom API"
            onPress={() => open("Connections")}
          />
        </>
      )}
      {tab === "Knowledge" && (
        <>
          <Stats
            items={[
              [
                "Sources",
                String(data.files.filter((f) => f.agent === id).length),
              ],
              [
                "Indexed",
                String(data.files.filter((f) => f.agent === id).length),
              ],
            ]}
          />
          <Button
            label="Manage knowledge"
            icon="book-open"
            onPress={() => open("Knowledge Base", id)}
          />
          <Field
            placeholder="Search sources…"
            value={query}
            onChangeText={sq}
          />
          {data.files
            .filter(
              (f) =>
                f.agent === id &&
                f.name.toLowerCase().includes(query.toLowerCase()),
            )
            .map((f) => (
              <Card key={f.id}>
                <T>{f.name}</T>
                <Badge label="Indexed locally" green />
              </Card>
            ))}
          <Field
            label="Website address"
            value={vv}
            onChangeText={svv}
            placeholder="https://your-business.com"
          />
          <Button
            outline
            label="Add website"
            disabled={!/^https?:\/\/.+\..+/.test(vv)}
            onPress={() => {
              set((d) => ({
                ...d,
                files: [
                  ...d.files,
                  {
                    id: Date.now().toString(),
                    name: vv,
                    agent: id,
                    size: 0,
                    kind: "Website",
                  },
                ],
              }));
              svv("");
              notify("Website saved locally; no crawling is performed.");
            }}
          />
        </>
      )}
      {tab === "Recent Calls" && (
        <>
          <Stats
            items={[
              ["Calls handled", "0"],
              ["People reached", "0"],
              ["Total talk time", "0s"],
              ["Avg. call length", "—"],
              ["Answer rate", "0%"],
              ["In / Out", "0 · 0"],
            ]}
          />
          <Empty
            icon="phone"
            title="No calls yet"
            sub="Test your agent locally or explore the Call Logs module."
            label="View call logs"
            onPress={() => open("Call Logs")}
          />
        </>
      )}
      {!!sheet && (
        <Sheet
          title={sheet}
          onClose={() => {
            ss("");
            Speech.stop();
            sTesting(false);
          }}
        >
          {sheet === "Appearance" && (
            <OrbPicker
              value={a.appearance || "Orb 1"}
              onChange={(appearance) => patch({ appearance })}
            />
          )}
          {sheet === "Languages" && (
            <>
              <Choices
                items={languages}
                value={a.languages}
                multiple
                onChange={(v: string[]) => v.length && patch({ languages: v })}
              />
              <Select
                label="Primary language"
                items={a.languages}
                value={a.languages[0]}
                onChange={(language) =>
                  patch({
                    languages: [
                      language,
                      ...a.languages.filter((x) => x !== language),
                    ],
                  })
                }
              />
              <Button label="Done" onPress={() => ss("")} />
            </>
          )}
          {sheet === "Choose a voice" && (
            <>
              <Tabs
                items={["AI voices", "My voices"]}
                value={voiceTab}
                onChange={svTab}
              />
              <Field
                placeholder="Search voices…"
                value={query}
                onChangeText={sq}
              />
              <Select
                label="Language"
                items={["All languages", ...languages]}
                value={lang}
                onChange={sl}
                compact
              />
              <Select
                label="Gender"
                items={["All genders", "Female", "Male", "Neutral"]}
                value={gender}
                onChange={sg}
                compact
              />
              {(voiceTab === "AI voices"
                ? voices
                : data.clones.map((c) => [c.name, c.language, c.gender])
              )
                .filter(
                  (v) =>
                    v[0].toLowerCase().includes(query.toLowerCase()) &&
                    (lang === "All languages" || v[1] === lang) &&
                    (gender === "All genders" || v[2] === gender),
                )
                .map((v) => (
                  <Card key={v[0]}>
                    <Row
                      title={v[0]}
                      sub={v[1] + " · " + v[2]}
                      onPress={() => patch({ voice: v[0] })}
                      right={
                        <Badge
                          label={a.voice === v[0] ? "Selected" : "Select"}
                          green={a.voice === v[0]}
                        />
                      }
                    />
                    <Button
                      outline
                      small
                      label="Preview using device voice"
                      icon="play"
                      onPress={() =>
                        Speech.speak(
                          "Hello, I am " + v[0] + ". How can I help you today?",
                        )
                      }
                    />
                  </Card>
                ))}
              <T style={s.sub}>
                Audio preview uses your device’s speech voice, not the website’s
                voice model.
              </T>
              <Button
                label="Done"
                onPress={() => {
                  ss("");
                  Speech.stop();
                }}
              />
            </>
          )}
          {sheet === "Add variable" && (
            <>
              <Field
                label="Variable name"
                value={vn}
                onChangeText={svn}
                placeholder="customer_name"
              />
              <Field
                label={varType === "Input" ? "Default value" : "Description"}
                value={vv}
                onChangeText={svv}
              />
              <Button
                label="Add variable"
                disabled={
                  !/^[a-zA-Z_]\w*$/.test(vn) ||
                  a.variables.some((v) => v.name === vn)
                }
                onPress={() => {
                  patch({
                    variables: [
                      ...a.variables,
                      { name: vn, value: vv, type: varType },
                    ],
                  });
                  svn("");
                  svv("");
                  ss("");
                }}
              />
            </>
          )}
          {sheet === "Add section" && (
            <>
              <Field label="Section title" value={vn} onChangeText={svn} />
              <Button
                label="Add section"
                disabled={!vn.trim()}
                onPress={() => {
                  patch({
                    sections: [
                      ...a.sections,
                      { title: vn, text: "", enabled: true },
                    ],
                  });
                  svn("");
                  ss("");
                }}
              />
            </>
          )}
          {sheet === "Agent builder" && (
            <>
              <Field
                label="Describe a change"
                multiline
                value={vv}
                onChangeText={svv}
              />
              <T style={s.sub}>
                Demo mode adds your request as a new instruction section.
              </T>
              <Button
                label="Apply instructions"
                disabled={!vv.trim()}
                onPress={() => {
                  patch({
                    sections: [
                      ...a.sections,
                      {
                        title: "Additional instructions",
                        text: vv,
                        enabled: true,
                      },
                    ],
                  });
                  svv("");
                  ss("");
                }}
              />
            </>
          )}
          {sheet === "Test assistant" && (
            <>
              <Tabs
                items={["Voice", "Phone", "Chat"]}
                value={testMode}
                onChange={stm}
              />
              {testMode === "Chat" ? (
                <>
                  <Card>
                    <T style={s.sub}>
                      Local scripted preview. No AI service is connected.
                    </T>
                    {chat.map((m, i) => (
                      <T key={i} style={{ fontSize: 14, lineHeight: 22 }}>
                        {m}
                      </T>
                    ))}
                  </Card>
                  <Field
                    placeholder="Send a message…"
                    value={message}
                    onChangeText={sm}
                  />
                  <Button
                    label="Send"
                    disabled={!message.trim()}
                    onPress={() => {
                      sc([
                        ...chat,
                        "You: " + message,
                        a.name +
                          ": Thanks for reaching out. I can help with your enquiry and collect your preferred next step.",
                      ]);
                      sm("");
                    }}
                  />
                </>
              ) : testMode === "Voice" ? (
                <>
                  <Image
                    source={art.orb}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      alignSelf: "center",
                    }}
                  />
                  <T style={s.sub}>
                    Listen to a local greeting using device speech. No
                    microphone or real call is used.
                  </T>
                  <Button
                    label={testing ? "Stop preview" : "Play demo greeting"}
                    icon={testing ? "square" : "play"}
                    onPress={() => {
                      if (testing) {
                        Speech.stop();
                        sTesting(false);
                      } else {
                        sTesting(true);
                        Speech.speak(
                          "Hello, I am " +
                            a.name +
                            ". How can I help you today?",
                          { onDone: () => sTesting(false) },
                        );
                      }
                    }}
                  />
                </>
              ) : (
                <>
                  <Field
                    label="Phone number"
                    placeholder="+91"
                    value={vv}
                    onChangeText={svv}
                  />
                  <T style={s.sub}>
                    Phone calling is disconnected in this frontend demo.
                  </T>
                  <Button
                    label="Preview call request"
                    disabled={vv.replace(/\D/g, "").length < 10}
                    onPress={() =>
                      notify("Demo call request validated. No call was placed.")
                    }
                  />
                </>
              )}
            </>
          )}
        </Sheet>
      )}
    </>
  );
}
