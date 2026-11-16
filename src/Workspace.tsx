import { Select } from "./components/Select";
import { SearchToolbar } from "./components/SearchToolbar";
import { Analytics } from "./components/Analytics";
import { OrbPicker, orbSource } from "./components/OrbPicker";
import { ProfilePhoto } from "./components/ProfilePhoto";
import { Attachments } from "./components/Attachments";
import * as Linking from "expo-linking";
import { RikChat } from "./components/RikChat";
import { parseCSV } from "./csv";
import { Planning } from "./Planning";
import React, { useState } from "react";
import { View, Image, Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";
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
import { useStore, RecordItem } from "./store";
import { voices, languages, integrations, plans } from "./catalog";

export function Workspace({ page, param, open, notify, signOut }: any) {
  const { data, set } = useStore();
  const [tab, st] = useState(
    page === "Billing"
      ? "Overview"
      : page === "Clone Voice"
        ? "My voices"
        : page === "Settings"
          ? "Profile"
          : page === "CRM"
            ? "Table"
            : page === "Analytics"
              ? "30 days"
              : page === "Call Logs"
                ? "All statuses"
                : "Chatbots",
  );
  const [query, sq] = useState("");
  const [filter, sf] = useState(
    page === "Knowledge Base" && param
      ? data.agents.find((a) => a.id === param)?.name || "All"
      : "All",
  );
  const [campaignAgent, setCampaignAgent] = useState("All agents");
  const [sheet, ss] = useState("");
  const [form, sv] = useState<Record<string, any>>(
    page === "Clone Voice" ? { Language: "English", Gender: "Male" } : {},
  );
  const [selected, sel] = useState<RecordItem | null>(null);
  const [step, sstep] = useState(1);
  const [showFilters, ssf] = useState(false);
  const [favoritesOnly, sfo] = useState(false);
  const [playing, sp] = useState("");
  const [gender, sg] = useState("All genders");
  const [lang, sl] = useState("All languages");
  const v = (k: string, x: any) => sv((f) => ({ ...f, [k]: x }));
  const field = (k: string, placeholder = "", multi = false) => (
    <Field
      key={k}
      label={k}
      value={String(form[k] ?? "")}
      placeholder={placeholder}
      multiline={multi}
      onChangeText={(x: string) => v(k, x)}
    />
  );
  const choose = (k: string, items: string[], multi = false) =>
    !multi &&
    (items.length > 4 ||
      ["Agent", "Language", "Stage", "Source", "Country", "Call from"].includes(
        k,
      )) ? (
      <Select
        key={k}
        label={k}
        items={items}
        value={form[k] || items[0] || "Choose"}
        onChange={(x: string) => v(k, x)}
      />
    ) : (
      <View style={{ gap: 10 }} key={k}>
        <T style={s.label}>{k}</T>
        <Choices
          items={items}
          multiple={multi}
          value={form[k] || (multi ? [] : items[0])}
          onChange={(x: any) => v(k, x)}
        />
      </View>
    );
  const start = (name: string, defaults = {}) => {
    sv(
      name === "Billing details"
        ? {
            "Invoice email": data.profile.email,
            ...[...data.transactions]
              .reverse()
              .find((t) => t.kind === "details"),
          }
        : defaults,
    );
    sel(null);
    sstep(1);
    ss(name);
  };
  const save = (collection: keyof typeof data, item: any) => {
    set((d) => ({
      ...d,
      [collection]: [
        ...(d[collection] as RecordItem[]),
        { id: Date.now().toString(), ...item },
      ],
    }));
    ss("");
    notify("Saved on this device");
  };
  const matches = (x: RecordItem) =>
    x.name.toLowerCase().includes(query.toLowerCase());
  const pick = async (kind: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type:
          kind === "PDF"
            ? "application/pdf"
            : kind === "Audio"
              ? "audio/*"
              : [
                  "text/csv",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      if (kind === "PDF" && (file.size || 0) > 10 * 1024 * 1024) {
        notify("Choose a PDF smaller than 10 MB.");
        return;
      }
      if (kind === "PDF") {
        save("files", {
          name: file.name,
          size: file.size || 0,
          agent: form.Agent || param || data.agents[0]?.id,
          uri: file.uri,
          kind: "PDF",
        });
      } else {
        v("File", file.name);
        v("File URI", file.uri);
        notify(file.name + " selected locally");
      }
    } catch {
      notify("Unable to open the file picker. Try again.");
    }
  };
  const list = (
    items: RecordItem[],
    emptyTitle: string,
    sub: string,
    button?: string,
    action?: () => void,
  ) => (
    <>
      {items.filter(matches).map((x) => (
        <Card
          key={x.id}
          onPress={() => {
            sel(x);
            ss("Details");
          }}
        >
          <Row
            title={x.name}
            sub={x.stage || x.status || x.description || "Saved locally"}
            right={<Icon name="chevron-right" />}
          />
        </Card>
      ))}
      {!items.filter(matches).length && (
        <Empty title={emptyTitle} sub={sub} label={button} onPress={action} />
      )}
    </>
  );
  let content: React.ReactNode = null;
  if (page === "Clone Voice")
    content = (
      <>
        <Heading
          title="Clone Voice"
          sub="Clone your own voice from a short sample, or pick one from our library."
        />
        <Tabs items={["My voices", "Library"]} value={tab} onChange={st} />
        {tab === "My voices" ? (
          <>
            <Card>
              <Heading
                title="Clone a voice"
                sub="Record or upload 20+ seconds of clear speech."
              />
              {field("Voice name", "e.g. Front-desk Riya")}
              {choose("Language", languages.slice(0, 6))}
              {choose("Gender", ["Male", "Female", "Neutral"])}
              {field("Description", "e.g. warm, calm, professional")}
              <Card style={{ backgroundColor: C.soft, borderWidth: 0 }}>
                <T style={s.label}>Read this aloud</T>
                <T style={{ fontSize: 13, lineHeight: 22 }}>
                  Hello, and thank you for helping create this voice. I am
                  recording a short sample so the assistant can learn how I
                  speak. I usually talk in a calm and friendly way, taking my
                  time with each word. Today is a bright morning, and I am
                  reading these few lines clearly and naturally. One, two,
                  three, four, five. Thank you very much.
                </T>
              </Card>
              <Tabs
                items={["Record", "Upload"]}
                value={form.Mode || "Record"}
                onChange={(x: string) => v("Mode", x)}
              />
              {form.Mode === "Upload" ? (
                <Button
                  outline
                  icon="upload"
                  label={form.File || "Choose audio sample"}
                  onPress={() => pick("Audio")}
                />
              ) : (
                <>
                  <Button
                    outline
                    icon={form.Recorded ? "check" : "mic"}
                    label={
                      form.Recorded ? "Demo sample ready" : "Simulate recording"
                    }
                    onPress={() => v("Recorded", true)}
                  />
                  <T style={{ fontSize: 11, color: C.muted }}>
                    Demo recording only. No microphone is accessed.
                  </T>
                </>
              )}
              <Toggle
                label="I have the speaker’s consent and the right to clone this voice."
                value={form.Consent}
                onChange={(x: boolean) => v("Consent", x)}
              />
              <T style={s.sub}>
                Website price: 5 credits. This demo never charges credits.
              </T>
              <Button
                label="Create demo voice"
                disabled={
                  !form["Voice name"]?.trim() ||
                  !form.Consent ||
                  (!form.Recorded && !form.File)
                }
                onPress={() => {
                  save("clones", {
                    name: form["Voice name"],
                    language: form.Language || "English",
                    gender: form.Gender || "Male",
                    description: form.Description,
                  });
                  sv({});
                }}
              />
            </Card>
            {data.clones.map((x) => (
              <Card key={x.id}>
                <Row
                  title={x.name}
                  sub={x.language + " · " + x.gender}
                  onPress={() => {
                    sel(x);
                    ss("Details");
                  }}
                />
                <Badge label="Local sample" green />
              </Card>
            ))}
          </>
        ) : (
          <>
            <SearchToolbar
              title="Voice library"
              label="Search voices"
              value={query}
              onChange={sq}
            >
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
            </SearchToolbar>
            <Toggle
              label="Favourites only"
              value={favoritesOnly}
              onChange={sfo}
            />
            <T style={s.sub}>
              {
                voices.filter(
                  (x) =>
                    (lang === "All languages" || x[1] === lang) &&
                    (gender === "All genders" || x[2] === gender) &&
                    (!favoritesOnly || data.favorites.includes(x[0])) &&
                    x[0].toLowerCase().includes(query.toLowerCase()),
                ).length
              }{" "}
              bundled demo voices · Website library has 300
            </T>
            {voices
              .filter(
                (x) =>
                  (lang === "All languages" || x[1] === lang) &&
                  (gender === "All genders" || x[2] === gender) &&
                  (!favoritesOnly || data.favorites.includes(x[0])) &&
                  x[0].toLowerCase().includes(query.toLowerCase()),
              )
              .map((x, i) => (
                <Card key={x[0]}>
                  <View style={s.between}>
                    <Image
                      source={i % 2 ? art.cobalt : art.orb}
                      style={{ width: 44, height: 44, borderRadius: 22 }}
                    />
                    <View style={{ flex: 1, gap: 5 }}>
                      <T style={s.label}>{x[0]}</T>
                      <T style={s.sub}>
                        {x[1]} · {x[2]}
                      </T>
                    </View>
                    <IB
                      name="heart"
                      label={"Favourite " + x[0]}
                      onPress={() =>
                        set((d) => ({
                          ...d,
                          favorites: d.favorites.includes(x[0])
                            ? d.favorites.filter((z) => z !== x[0])
                            : [...d.favorites, x[0]],
                        }))
                      }
                    />
                  </View>
                  <Button
                    small
                    outline
                    label={
                      playing === x[0] ? "Stop preview" : "Preview device voice"
                    }
                    icon={playing === x[0] ? "square" : "play"}
                    onPress={() => {
                      Speech.stop();
                      if (playing === x[0]) sp("");
                      else {
                        sp(x[0]);
                        Speech.speak(
                          "Hello, I am " + x[0] + ". How can I help you today?",
                          { onDone: () => sp("") },
                        );
                      }
                    }}
                  />
                  {data.favorites.includes(x[0]) && <Badge label="Favourite" />}
                </Card>
              ))}
            <T style={s.sub}>
              Previews use device speech; voice models are not connected.
            </T>
          </>
        )}
      </>
    );
  if (page === "Knowledge Base")
    content = (
      <>
        <Heading
          title="Knowledge Base"
          sub="Upload PDFs to ground your assistants. Keep your business knowledge in one place."
        />
        <Button
          label="Upload PDF"
          icon="upload-cloud"
          onPress={() =>
            start("Upload PDF", { Agent: param || data.agents[0]?.id })
          }
        />
        <Stats
          items={[
            ["Sources", String(data.files.length), "Across all assistants"],
            ["Indexed", String(data.files.length), "Local preview only"],
            [
              "Knowledge size",
              Math.ceil(
                data.files.reduce((s, f) => s + (f.size || 0), 0) / 1024,
              ) + " KB",
            ],
          ]}
        />
        <SearchToolbar
          title="Sources"
          label="Search files"
          value={query}
          onChange={sq}
        >
          <Select
            label="Agent"
            items={["All", ...data.agents.map((a) => a.name)]}
            value={filter}
            onChange={sf}
            compact
          />
        </SearchToolbar>
        {data.files
          .filter(matches)
          .filter(
            (f) =>
              filter === "All" ||
              data.agents.find((a) => a.id === f.agent)?.name === filter,
          )
          .map((f) => (
            <Card key={f.id}>
              <Row
                title={f.name}
                sub={
                  Math.ceil((f.size || 0) / 1024) + " KB · " + (f.kind || "PDF")
                }
                onPress={() => {
                  sel(f);
                  ss("Source preview");
                }}
              />
              <Badge label="Available locally" green />
              <Button
                outline
                small
                label="Remove source"
                onPress={() => {
                  set((d) => ({
                    ...d,
                    files: d.files.filter((x) => x.id !== f.id),
                  }));
                  notify("Source removed from local workspace");
                }}
              />
            </Card>
          ))}
        {!data.files.length && (
          <Empty
            icon="book-open"
            title="No sources yet"
            sub="Add a PDF, then choose the assistant that should use it."
            label="Upload PDF"
            onPress={() => start("Upload PDF", { Agent: data.agents[0]?.id })}
          />
        )}
      </>
    );
  if (page === "Phone Numbers")
    content = (
      <>
        <Heading
          title="Phone Numbers"
          sub="Buy a number, verify your identity once, then route inbound calls to an assistant."
        />
        <View style={{ gap: 10 }}>
          <Button
            label="Buy a number"
            icon="plus"
            onPress={() =>
              start("Buy a phone number", { Country: "India +91" })
            }
          />
          <Button
            outline
            label="Bring your own provider"
            onPress={() => start("Bring your own provider")}
          />
        </View>
        <Stats
          items={[
            ["Numbers", String(data.numbers.length)],
            [
              "Answering calls",
              String(data.numbers.filter((n) => n.agent).length),
            ],
            [
              "Monthly renewal",
              "₹" + data.numbers.reduce((s, n) => s + (n.rental || 0), 0),
              "Demo figures",
            ],
          ]}
        />
        <Section title="Your numbers">
          {list(
            data.numbers,
            "No numbers yet",
            "Verify your identity, then choose a number. Demo checkout never makes a purchase.",
            "Buy a number",
            () => start("Buy a phone number", { Country: "India +91" }),
          )}
        </Section>
      </>
    );
  if (page === "Identity & KYC")
    content = (
      <>
        <Heading
          title="Identity & KYC"
          sub="Your verification status and the next step for your number."
        />
        {data.kyc === "Approved" ? (
          <Card>
            <Badge label="Approved · demo" green />
            <Icon name="shield" size={42} color={C.green} />
            <T style={s.h1}>You’re ready to choose a number.</T>
            <T style={s.sub}>
              Your local demo verification is complete. Browse available sample
              numbers and choose one for your assistant.
            </T>
            <Button
              label="Browse numbers"
              onPress={() => open("Phone Numbers")}
            />
            <T style={s.label}>Before your number goes live</T>
            <Row
              title="Payment first"
              sub="Complete checkout before a number is purchased."
            />
            <Row
              title="A final verification check"
              sub="Business approval is rechecked before activation."
            />
            <Button
              outline
              label="Refresh status"
              icon="refresh-cw"
              onPress={() => notify("Local verification status is up to date")}
            />
          </Card>
        ) : (
          <>
            <Heading
              title="Who will use the calling service?"
              sub="Choose your identity type. This demo uses sample fields only — do not enter real identity numbers."
            />
            <Card
              onPress={() => start("Verify identity", { Type: "Individual" })}
            >
              <Icon name="user" />
              <T style={s.h2}>Individual</T>
              <T style={s.sub}>
                Verify with PAN and Aadhaar. No business documents needed.
              </T>
            </Card>
            <Card
              onPress={() =>
                start("Verify identity", { Type: "Registered business" })
              }
            >
              <Icon name="briefcase" />
              <T style={s.h2}>Registered business</T>
              <T style={s.sub}>Registration certificate and GST certificate.</T>
            </Card>
            <Badge label={data.kyc} />
          </>
        )}
      </>
    );
  if (page === "Chatbot")
    content = (
      <>
        <Heading
          eyebrow="WEBSITE CHANNEL"
          title="Your chatbots"
          sub="Set up your website chat, tailor the experience and keep up with every conversation."
        />
        <Button
          label="Create chatbot"
          icon="plus"
          onPress={() =>
            start("Create chatbot", {
              "Header title": "Chat with us",
              "Header subtitle": "We reply instantly",
              Greeting: "Hi! 👋 How can I help you today?",
              "Primary color": "#000000",
              "Launcher position": "Bottom right",
              "Pause after inactivity": "30",
              Agent: data.agents[0]?.name,
            })
          }
        />
        <SearchToolbar
          title={tab === "Chatbots" ? "Chatbots" : "Conversations"}
          label="Search chatbots"
          value={query}
          onChange={sq}
        >
          <Select
            label="Chatbot view"
            items={["Chatbots", "Conversations"]}
            value={tab}
            onChange={st}
            compact
          />
        </SearchToolbar>
        {tab === "Chatbots" ? (
          list(
            data.bots,
            "No chatbots yet",
            "Turn an assistant into an embeddable website chat.",
          )
        ) : (
          <Empty
            icon="message-circle"
            title="No conversations yet"
            sub="Website conversations will appear here when a backend is connected."
          />
        )}
      </>
    );
  if (page === "Connections")
    content = (
      <>
        <Heading
          title="Connections"
          sub="Bring your tools into the conversation."
        />
        <SearchToolbar
          title="App directory"
          label="Search integrations"
          value={query}
          onChange={sq}
        >
          <Select
            label="Connection status"
            items={["All", "Connected"]}
            value={filter}
            onChange={sf}
            compact
          />
        </SearchToolbar>
        {integrations
          .filter(
            (x) =>
              x.toLowerCase().includes(query.toLowerCase()) &&
              (filter !== "Connected" || data.connections.includes(x)),
          )
          .map((x, i) => (
            <Card key={x} onPress={() => start("Connect " + x, { App: x })}>
              <View style={s.between}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: [
                      "#edf3e8",
                      "#f4edf7",
                      "#eaf1ff",
                      "#f8eee7",
                    ][i % 4],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <T style={{ fontFamily: "GeistSemi", fontSize: 19 }}>
                    {x[0]}
                  </T>
                </View>
                <View style={{ flex: 1, gap: 5 }}>
                  <T style={s.label}>{x}</T>
                  <T style={{ fontSize: 12, color: C.muted }}>
                    {data.connections.includes(x)
                      ? "Connected locally"
                      : "Set up integration"}
                  </T>
                </View>
                <Icon name="arrow-up-right" size={18} />
              </View>
            </Card>
          ))}
        <Section title="Connect your own tools">
          <T style={s.sub}>
            Let your agents look up an order, check availability, or take action
            in your systems.
          </T>
          <Button
            outline
            label="Add custom API"
            icon="plus"
            onPress={() => start("Add custom API", { "Request type": "GET" })}
          />
          {data.endpoints.map((e) => (
            <Card key={e.id}>
              <Row
                title={e.name}
                sub={e.method + " " + e.url}
                onPress={() => {
                  sel(e);
                  ss("Details");
                }}
              />
            </Card>
          ))}
        </Section>
      </>
    );
  if (page === "Campaigns")
    content = (
      <>
        <Heading
          title="Campaigns"
          sub="Your outreach, from first call to follow-up."
        />
        <Button
          label="New campaign"
          icon="plus"
          onPress={() =>
            start("New campaign", {
              Agent: data.agents[0]?.name,
              "Call from": data.numbers[0]?.name || "Sample number",
              From: "09:00",
              To: "18:00",
              Timezone: "Asia/Kolkata",
              "Max retries": "1",
              "Retry delay": "5",
              Start: "On launch",
              Days: [],
            })
          }
        />
        <Stats
          items={[
            ["Total campaigns", String(data.campaigns.length)],
            ["Running now", "0"],
            ["Contacts processed", "0"],
            ["Calls in progress", "0"],
          ]}
        />
        <SearchToolbar
          title="Your campaigns"
          label="Search campaigns"
          value={query}
          onChange={sq}
        >
          <Select
            label="Status"
            items={["All", "Draft", "Scheduled", "Paused", "Completed"]}
            value={filter}
            onChange={sf}
            compact
          />
          <Select
            label="Agent"
            items={["All agents", ...data.agents.map((a) => a.name)]}
            value={campaignAgent}
            onChange={setCampaignAgent}
            compact
          />
        </SearchToolbar>
        {list(
          data.campaigns.filter(
            (c) =>
              (filter === "All" || c.status === filter) &&
              (campaignAgent === "All agents" || c.Agent === campaignAgent),
          ),
          "Start your first conversation",
          "Choose an agent, add your contacts, and bring your outreach to life.",
        )}
      </>
    );
  if (page === "CRM")
    content = (
      <>
        <Heading
          title="CRM"
          sub="Every contact, conversation and opportunity in one place."
        />
        <View style={s.between}>
          <Button
            label="New lead"
            icon="plus"
            style={{ flex: 1 }}
            onPress={() =>
              start("New lead", { Stage: "New", Source: "Manual" })
            }
          />
          <Button
            outline
            label="Import"
            icon="upload"
            onPress={() => start("Import leads")}
          />
        </View>
        <Stats
          items={[
            ["Leads", String(data.leads.length)],
            [
              "Open pipeline",
              "₹" +
                data.leads
                  .filter((l) => !["Won", "Lost"].includes(l.stage))
                  .reduce((s, l) => s + Number(l.value || 0), 0),
            ],
            [
              "Won",
              "₹" +
                data.leads
                  .filter((l) => l.stage === "Won")
                  .reduce((s, l) => s + Number(l.value || 0), 0),
            ],
            [
              "Win rate",
              Math.round(
                (100 * data.leads.filter((l) => l.stage === "Won").length) /
                  Math.max(
                    1,
                    data.leads.filter((l) => ["Won", "Lost"].includes(l.stage))
                      .length,
                  ),
              ) + "%",
            ],
          ]}
        />
        <SearchToolbar
          title="Leads"
          label="Search leads"
          value={query}
          onChange={sq}
          actions={
            <IB
              name="sliders"
              label={showFilters ? "Hide filters" : "Filters & data tools"}
              onPress={() => ssf(!showFilters)}
            />
          }
        >
          <Select
            label="Lead view"
            items={["Table", "Kanban", "Folders"]}
            value={tab}
            onChange={st}
            compact
          />
        </SearchToolbar>
        {showFilters && (
          <Card>
            <Select
              label="Status"
              items={[
                "All",
                "New",
                "Contacted",
                "Qualified",
                "Proposal",
                "Won",
                "Lost",
              ]}
              value={filter}
              onChange={sf}
              compact
            />
            <Button
              outline
              label="Export local leads CSV"
              onPress={() => exportCSV(data.leads, "leads", notify)}
            />
            <Button
              outline
              label="New folder"
              onPress={() => start("New folder")}
            />
          </Card>
        )}
        {tab === "Kanban" ? (
          ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"].map(
            (stage) => (
              <Section
                key={stage}
                title={
                  stage +
                  " · " +
                  data.leads.filter((l) => l.stage === stage).length
                }
              >
                {data.leads
                  .filter(matches)
                  .filter((l) => l.stage === stage)
                  .map((l) => (
                    <Card
                      key={l.id}
                      onPress={() => {
                        sel(l);
                        sv({ ...l });
                        ss("Lead details");
                      }}
                    >
                      <T style={s.label}>{l.name}</T>
                      <T style={s.sub}>
                        {l.company || "Individual"} · ₹{l.value || 0}
                      </T>
                    </Card>
                  ))}
              </Section>
            ),
          )
        ) : tab === "Folders" ? (
          <>
            <Row
              title="All contacts"
              sub={data.leads.length + " leads"}
              onPress={() => {
                st("Table");
                sf("All");
              }}
            />
            {Array.from(
              new Set(data.leads.map((l) => l.folder).filter(Boolean)),
            ).map((folder) => (
              <Row
                key={folder}
                title={folder}
                sub={
                  data.leads.filter((l) => l.folder === folder).length +
                  " leads"
                }
                onPress={() => {
                  sf(folder);
                  st("Table");
                }}
              />
            ))}
          </>
        ) : (
          <>
            {data.leads
              .filter(matches)
              .filter(
                (l) =>
                  filter === "All" || l.stage === filter || l.folder === filter,
              )
              .map((l) => (
                <Card
                  key={l.id}
                  onPress={() => {
                    sel(l);
                    sv({ ...l });
                    ss("Lead details");
                  }}
                >
                  <Row
                    title={l.name}
                    sub={
                      l.company ||
                      l.email ||
                      l.phone ||
                      "Contact details not added"
                    }
                    right={<Badge label={l.stage} green={l.stage === "Won"} />}
                  />
                  <T style={s.sub}>
                    ₹{l.value || 0} · {l.source || "Manual"}
                    {l.folder ? " · " + l.folder : ""}
                  </T>
                </Card>
              ))}
            {!data.leads.length && (
              <Empty
                icon="users"
                title="No leads yet"
                sub="Import a sheet or add your first lead."
                label="Add your first lead"
                onPress={() =>
                  start("New lead", { Stage: "New", Source: "Manual" })
                }
              />
            )}
          </>
        )}
      </>
    );
  if (page === "Call Logs")
    content = (
      <>
        <Heading
          title="Call logs"
          sub="Review conversations, outcomes and recordings in one place."
        />
        <SearchToolbar
          title="Call history"
          label="Search call logs"
          value={query}
          onChange={sq}
        >
          <View style={{ flex: 1, minWidth: 0 }}>
            <Select
              label="Agent"
              items={["All agents", ...data.agents.map((a) => a.name)]}
              value={filter === "All" ? "All agents" : filter}
              onChange={sf}
              compact
            />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Select
              label="Status"
              items={[
                "All statuses",
                "Completed",
                "Voicemail",
                "No Answer",
                "Busy",
                "Failed",
              ]}
              value={tab}
              onChange={st}
              compact
            />
          </View>
        </SearchToolbar>
        <View style={s.between}>
          <Button
            outline
            label="Filters"
            icon="sliders"
            onPress={() => ssf(!showFilters)}
          />
          <Button
            outline
            label="Columns"
            icon="columns"
            onPress={() =>
              start("Visible columns", {
                Columns: [
                  "Date",
                  "Agent",
                  "Duration",
                  "Type",
                  "Status",
                  "Credits",
                ],
              })
            }
          />
        </View>
        {showFilters && (
          <Card>
            {choose("Direction", ["Any", "Inbound", "Outbound"])}
            {choose("Channel", ["Any", "Phone", "Web"])}
            {field("Minimum duration", "seconds")}
            {field("Maximum duration", "seconds")}
          </Card>
        )}
        <T style={s.sub}>0 loaded conversations</T>
        <Empty
          icon="phone"
          title="Your call history starts here"
          sub="Calls will appear here with outcomes, usage and recordings. Real calls are disconnected in this demo."
        />
      </>
    );
  if (page === "Analytics") content = <Analytics open={open} notify={notify} />;
  if (page === "Billing")
    content = (
      <>
        <Heading
          title="Billing"
          sub="Manage your plan, balance, usage and invoices."
        />
        <Button
          label="Add credits"
          icon="plus"
          onPress={() => start("Add credits", { Credits: "100" })}
        />
        <Select
          label="Billing section"
          compact
          items={[
            "Overview",
            "Plans",
            "Top-ups",
            "Credits",
            "Invoices",
            "Numbers",
          ]}
          value={tab}
          onChange={st}
        />
        {tab === "Overview" ? (
          <>
            <Card>
              <Badge label="ACTIVE PLAN" />
              <T style={s.h1}>{data.plan}</T>
              <T style={s.sub}>
                {plans.find((p) => p.name === data.plan)?.minutes} included
                minutes
              </T>
              <Button outline label="Change plan" onPress={() => st("Plans")} />
            </Card>
            <Card>
              <T style={s.sub}>Current balance</T>
              <T style={s.h1}>{data.balance} credits</T>
              <T style={s.sub}>
                {data.balance} min talk time remaining · 1 credit ≈ 1 min
              </T>
              <View
                style={{ height: 6, backgroundColor: "#111", borderRadius: 3 }}
              />
            </Card>
            <Stats
              items={[
                [
                  "Knowledge base",
                  Math.ceil(
                    data.files.reduce((s, f) => s + (f.size || 0), 0) / 1024,
                  ) + " KB",
                ],
                [
                  "Storage",
                  String(plans.find((p) => p.name === data.plan)?.storage) +
                    " MB",
                ],
              ]}
            />
            <Card>
              <T style={s.h2}>Billing details</T>
              <T style={s.sub}>
                Add GST and business details for tax invoices.
              </T>
              <Button
                outline
                label="Add details"
                onPress={() => start("Billing details")}
              />
              <Row
                title="Business name"
                sub={
                  [...data.transactions]
                    .reverse()
                    .find((t) => t.kind === "details")?.name || "Not added"
                }
              />
              {["GSTIN", "Billing address"].map((key) => (
                <Row
                  key={key}
                  title={key}
                  sub={
                    [...data.transactions]
                      .reverse()
                      .find((t) => t.kind === "details")?.[key] || "Not added"
                  }
                />
              ))}
              <Row
                title="Invoices emailed to"
                sub={
                  [...data.transactions]
                    .reverse()
                    .find((t) => t.kind === "details")?.["Invoice email"] ||
                  data.profile.email
                }
              />
            </Card>
          </>
        ) : tab === "Plans" ? (
          <>
            <Heading
              title="Simple pricing. Powerful calling."
              sub="Pay per minute · No hidden fees · Cancel anytime"
            />
            {plans.map((p) => (
              <Card
                key={p.name}
                style={
                  p.name === "Growth"
                    ? { borderColor: "#111", borderWidth: 1.5 }
                    : undefined
                }
              >
                <View style={s.between}>
                  <T style={s.h2}>{p.name}</T>
                  {p.name === "Growth" && <Badge label="Best value" green />}
                </View>
                <T style={s.h1}>
                  {p.price < 0
                    ? "Custom"
                    : "₹" + p.price.toLocaleString("en-IN")}
                  <T style={s.sub}>{p.price >= 0 ? " /mo" : ""}</T>
                </T>
                <T style={s.label}>
                  {p.minutes.toLocaleString()} phone-call minutes included
                </T>
                {[
                  "Up to " + p.agents + " active agents",
                  "Up to " + p.agents + " simultaneous calls",
                  p.leads + " CRM leads",
                  p.storage + " MB knowledge base",
                  p.discount + "% off credit top-ups",
                  "Email support",
                ].map((x) => (
                  <T key={x} style={{ fontSize: 13, color: "#666" }}>
                    ✓ {x}
                  </T>
                ))}
                <Button
                  outline={data.plan === p.name}
                  label={
                    data.plan === p.name ? "Your plan" : "Choose " + p.name
                  }
                  onPress={() =>
                    start("Review plan", { Plan: p.name, Price: p.price })
                  }
                />
              </Card>
            ))}
          </>
        ) : tab === "Numbers" ? (
          <Empty
            icon="phone"
            title={data.numbers.length + " local numbers"}
            sub="Manage rental and assignments from Phone Numbers."
            label="Manage numbers"
            onPress={() => open("Phone Numbers")}
          />
        ) : tab === "Invoices" ? (
          <Empty
            icon="file-text"
            title="No invoices yet"
            sub="Local demo transactions do not create tax invoices."
          />
        ) : (
          <>
            {data.transactions
              .filter((t) => t.kind !== "details")
              .map((t) => (
                <Card key={t.id}>
                  <Row title={t.name} sub={t.date + " · Local demo"} />
                  <T style={s.sub}>
                    {t.credits ? "+" + t.credits + " credits" : t.plan}
                  </T>
                </Card>
              ))}
            {!data.transactions.filter((t) => t.kind !== "details").length && (
              <Empty
                title={
                  tab === "Credits" ? "No credit activity" : "No top-ups yet"
                }
                sub="Your demo balance starts with 30 credits."
              />
            )}
          </>
        )}
      </>
    );
  if (page === "Settings")
    content = (
      <>
        <Heading
          title="Settings"
          sub="Your personal account — how you appear across your workspace."
        />
        <Select
          label="Settings section"
          items={["Profile", "Security", "AI assistant", "Help & support"]}
          value={tab}
          onChange={st}
          compact
        />
        {tab === "Profile" ? (
          <Card>
            <ProfilePhoto notify={notify} />
            <Field
              label="Full name"
              value={form.Name ?? data.profile.name}
              onChangeText={(x: string) => v("Name", x)}
            />
            <Field
              label="Email"
              value={form.Email ?? data.profile.email}
              onChangeText={(x: string) => v("Email", x)}
              keyboardType="email-address"
            />
            <Field
              label="Phone"
              value={form.Phone ?? data.profile.phone}
              onChangeText={(x: string) => v("Phone", x)}
            />
            <Button
              label="Save changes"
              onPress={() => {
                if (
                  !(form.Name ?? data.profile.name).trim() ||
                  !/^\S+@\S+\.\S+$/.test(form.Email ?? data.profile.email)
                ) {
                  notify("Enter a name and valid email");
                  return;
                }
                set((d) => ({
                  ...d,
                  profile: {
                    ...d.profile,
                    name: form.Name ?? d.profile.name,
                    email: form.Email ?? d.profile.email,
                    phone: form.Phone ?? d.profile.phone,
                  },
                }));
                notify("Profile saved locally");
              }}
            />
          </Card>
        ) : tab === "Security" ? (
          <Card>
            <T style={s.h2}>Set a password</T>
            <T style={s.sub}>
              This app uses a local demo session. No account credentials are
              stored.
            </T>
            <Field
              label="Password"
              value={form.Password || ""}
              secureTextEntry
              onChangeText={(x: string) => v("Password", x)}
            />
            <Field
              label="Confirm password"
              value={form.Confirm || ""}
              secureTextEntry
              onChangeText={(x: string) => v("Confirm", x)}
            />
            <Button
              label="Preview password change"
              disabled={
                (form.Password || "").length < 6 ||
                form.Password !== form.Confirm
              }
              onPress={() => {
                sv({});
                notify("Demo validation passed. No credential was changed.");
              }}
            />
            <Button outline label="Sign out of demo" onPress={signOut} />
          </Card>
        ) : tab === "AI assistant" ? (
          <Card>
            <T style={s.h2}>Appearance</T>
            <Toggle
              label="Haptic feedback"
              sub="Light feedback for taps and selections"
              value={data.preferences.haptics}
              onChange={(x: boolean) =>
                set((d) => ({
                  ...d,
                  preferences: { ...d.preferences, haptics: x },
                }))
              }
            />
            <T style={s.label}>Assistant size</T>
            <Choices
              items={["Small", "Medium", "Large"]}
              value={data.preferences.rikSize}
              onChange={(x: string) =>
                set((d) => ({
                  ...d,
                  preferences: { ...d.preferences, rikSize: x },
                }))
              }
            />
            <Image
              source={art.orb}
              style={{
                width:
                  data.preferences.rikSize === "Small"
                    ? 48
                    : data.preferences.rikSize === "Large"
                      ? 110
                      : 76,
                height:
                  data.preferences.rikSize === "Small"
                    ? 48
                    : data.preferences.rikSize === "Large"
                      ? 110
                      : 76,
                borderRadius: 60,
                alignSelf: "center",
              }}
            />
            <T style={s.sub}>
              Rik provides scripted guidance in this frontend preview.
            </T>
            <Button outline label="Ask Rik" onPress={() => open("Ask Rik")} />
          </Card>
        ) : (
          <>
            <Row
              title="Report an issue"
              onPress={() => open("Help & support")}
            />
            <Row title="My tickets" onPress={() => open("Help & support")} />
            <Row
              title="Documentation"
              onPress={() =>
                Linking.openURL("https://www.heyrik.com/docs").catch(() =>
                  notify("Unable to open documentation"),
                )
              }
            />
            <Row
              title="Replay onboarding"
              onPress={() => {
                set((d) => ({ ...d, onboarded: false }));
                signOut();
              }}
            />
          </>
        )}
      </>
    );
  if (page === "API keys")
    content = (
      <>
        <Heading
          title="API keys"
          sub="Manage keys for your calling workspace."
        />
        <T style={s.sub}>
          Demo keys are placeholders and cannot access any service.
        </T>
        <Button
          label="Create demo key"
          icon="plus"
          onPress={() => start("Create API key")}
        />
        {data.keys.map((k) => (
          <Card key={k.id}>
            <Row
              title={k.name}
              sub="demo_••••••••••••"
              right={
                <IB
                  name="trash-2"
                  label="Revoke key"
                  onPress={() =>
                    set((d) => ({
                      ...d,
                      keys: d.keys.filter((x) => x.id !== k.id),
                    }))
                  }
                />
              }
            />
            <Badge label="Demo only" />
          </Card>
        ))}
      </>
    );
  if (page === "Planning tools") content = <Planning />;
  if (page === "Help & support")
    content = (
      <>
        <Heading title="Help & support" sub="Tell us what needs attention." />
        <Button
          label="Report an issue"
          icon="flag"
          onPress={() =>
            start("Report an issue", { Category: "Bug", Priority: "Normal" })
          }
        />
        <Button outline label="Ask Rik" onPress={() => open("Ask Rik")} />
        <Button
          outline
          label="Documentation"
          icon="external-link"
          onPress={() =>
            Linking.openURL("https://www.heyrik.com/docs").catch(() =>
              notify("Unable to open documentation"),
            )
          }
        />
        <SearchToolbar
          title="Your tickets"
          label="Search tickets"
          value={query}
          onChange={sq}
        />
        {list(
          data.tickets,
          "No tickets yet",
          "Demo tickets remain on this device and are not sent to support.",
        )}
      </>
    );
  if (page === "Ask Rik") content = <RikChat open={open} />;
  return (
    <>
      {content}
      {!!sheet && (
        <Sheet title={sheet} onClose={() => ss("")}>
          {sheet === "Details" && selected && (
            <>
              <T style={s.h1}>{selected.name}</T>
              {Object.entries(selected)
                .filter(([k]) => !["id", "uri", "name", "File URI"].includes(k))
                .map(([k, value]) => (
                  <Row
                    key={k}
                    title={k}
                    sub={
                      typeof value === "object" && value
                        ? Object.entries(value)
                            .filter(([, v]) => v !== "" && v != null)
                            .map(([key, v]) => key + ": " + String(v))
                            .join("\n")
                        : String(value)
                    }
                  />
                ))}
              {page === "Campaigns" && (
                <>
                  <Button
                    outline
                    label="Pause campaign locally"
                    onPress={() => {
                      set((d) => ({
                        ...d,
                        campaigns: d.campaigns.map((c) =>
                          c.id === selected.id ? { ...c, status: "Paused" } : c,
                        ),
                      }));
                      ss("");
                    }}
                  />
                  <T style={s.sub}>
                    Launching live campaigns requires a backend. No calls are
                    placed.
                  </T>
                </>
              )}
              {page === "Chatbot" && (
                <>
                  <Button
                    outline
                    label="Edit chatbot"
                    onPress={() => {
                      sv(selected);
                      ss("Create chatbot");
                    }}
                  />
                  <Button
                    outline
                    label="Preview chat widget"
                    onPress={() => {
                      sv({ Greeting: selected.Greeting });
                      ss("Widget preview");
                    }}
                  />
                  <T style={s.label}>Embed code preview</T>
                  <T selectable style={{ fontSize: 12 }}>
                    Demo widget: {selected.id} · connect a backend before
                    embedding.
                  </T>
                </>
              )}
              {page === "Phone Numbers" && (
                <>
                  <T style={s.label}>Assign assistant</T>
                  <Choices
                    items={data.agents.map((a) => a.name)}
                    value={selected.agent}
                    onChange={(name: string) => {
                      set((d) => ({
                        ...d,
                        numbers: d.numbers.map((n) =>
                          n.id === selected.id ? { ...n, agent: name } : n,
                        ),
                      }));
                      sel({ ...selected, agent: name });
                    }}
                  />
                </>
              )}
            </>
          )}
          {sheet === "Upload PDF" && (
            <>
              <T style={s.label}>Add to assistant</T>
              <Choices
                items={data.agents.map((a) => a.name)}
                value={data.agents.find((a) => a.id === form.Agent)?.name}
                onChange={(name: string) =>
                  v("Agent", data.agents.find((a) => a.name === name)?.id)
                }
              />
              <Button
                label="Choose PDF · max 10 MB"
                disabled={!form.Agent}
                onPress={() => pick("PDF")}
              />
              <T style={s.sub}>
                The selected file is kept locally. Indexing and retrieval are
                simulated.
              </T>
            </>
          )}
          {sheet === "Source preview" && selected && (
            <>
              <Icon name="file-text" size={38} />
              <T style={s.h2}>{selected.name}</T>
              <T style={s.sub}>
                Type: {selected.kind} · {Math.ceil((selected.size || 0) / 1024)}{" "}
                KB
              </T>
              <T style={s.sub}>
                A native PDF renderer and semantic indexing are not connected.
                The source record is saved locally.
              </T>
            </>
          )}
          {sheet === "Buy a phone number" && (
            <>
              <Tabs
                items={["1 · Choose", "2 · Identity", "3 · Review"]}
                value={["1 · Choose", "2 · Identity", "3 · Review"][step - 1]}
                onChange={(value: string) => {
                  const target = Number(value[0]);
                  if (target <= step) sstep(target);
                  else notify("Complete this step with Continue first");
                }}
              />
              {step === 1 ? (
                <>
                  {field("Country")}
                  {field("Area code or pattern", "080")}
                  <T style={s.label}>Sample numbers</T>
                  <Choices
                    items={[
                      "+91 80 4718 2203",
                      "+91 80 4718 2204",
                      "+91 22 4512 0816",
                    ]}
                    value={form.Number}
                    onChange={(x: string) => v("Number", x)}
                  />
                  <T style={s.sub}>Sample catalogue · ₹499/month before tax.</T>
                  <Button
                    label="Continue"
                    disabled={!form.Number}
                    onPress={() => sstep(2)}
                  />
                </>
              ) : step === 2 ? (
                <>
                  <T style={s.h2}>Identity check</T>
                  <T style={s.sub}>
                    {data.kyc === "Approved"
                      ? "Your local demo identity is approved."
                      : "Continue with a sample verified identity. No personal documents are collected."}
                  </T>
                  <Button
                    label="Continue with demo identity"
                    onPress={() => sstep(3)}
                  />
                </>
              ) : (
                <>
                  <T style={s.h1}>{form.Number}</T>
                  <Row title="Due today" sub="₹499 · One month · Demo" />
                  <Toggle
                    label="Monthly auto-pay"
                    value={form.Autopay}
                    onChange={(x: boolean) => v("Autopay", x)}
                  />
                  <Button
                    label="Add sample number · no payment"
                    onPress={() =>
                      save("numbers", {
                        name: form.Number,
                        status: "Demo · unassigned",
                        rental: 499,
                        autopay: !!form.Autopay,
                      })
                    }
                  />
                </>
              )}
              {step > 1 && (
                <Button outline label="Back" onPress={() => sstep(step - 1)} />
              )}
            </>
          )}
          {sheet === "Bring your own provider" && (
            <>
              <T style={s.eyebrow}>STEP {step} OF 4</T>
              {step === 1 ? (
                <>
                  {choose("Provider", [
                    "Twilio",
                    "Telnyx",
                    "Plivo",
                    "Other SIP provider",
                  ])}
                  <Button label="Continue" onPress={() => sstep(2)} />
                </>
              ) : step === 2 ? (
                <>
                  {field("Connection name")}
                  {field("Phone number", "+91")}
                  {choose("Direction", ["Outbound", "Inbound", "Both"])}
                  {choose(
                    "Agent",
                    data.agents.map((a) => a.name),
                  )}
                  {field("Concurrent calls", "1")}
                  {field("Termination SIP URI", "your-trunk.pstn.twilio.com")}
                  {field("Port", "5060")}
                  {choose("Authentication", [
                    "SIP credentials",
                    "IP allowlist",
                  ])}
                  <T style={s.sub}>
                    Credentials are excluded from this demo. Do not enter real
                    secrets.
                  </T>
                  <Button
                    label="Continue"
                    disabled={
                      !form["Connection name"]?.trim() ||
                      !form["Phone number"]?.trim() ||
                      !form["Termination SIP URI"]?.trim()
                    }
                    onPress={() => sstep(3)}
                  />
                </>
              ) : step === 3 ? (
                <>
                  <T style={s.h2}>Carrier setup</T>
                  {[
                    "Create a SIP trunk",
                    "Set a Termination SIP URI",
                    "Attach credentials or IP allowlist",
                    "Add your number to the trunk",
                  ].map((x, i) => (
                    <Row key={x} title={i + 1 + ". " + x} />
                  ))}
                  <T style={s.sub}>
                    SIP over UDP · G.711 PCMU/PCMA · No REGISTER
                  </T>
                  <Button label="Review setup" onPress={() => sstep(4)} />
                </>
              ) : (
                <>
                  <T style={s.h2}>Setup & status</T>
                  <Row
                    title={form["Connection name"]}
                    sub={form["Phone number"]}
                  />
                  <Badge label="Demo · not activated" />
                  <Button
                    label="Save local connection"
                    onPress={() =>
                      save("numbers", {
                        name: form["Phone number"],
                        provider: form.Provider || "Twilio",
                        agent: form.Agent,
                        status: "Demo SIP · inactive",
                        rental: 0,
                      })
                    }
                  />
                </>
              )}
              {step > 1 && (
                <Button outline label="Back" onPress={() => sstep(step - 1)} />
              )}
            </>
          )}
          {sheet === "Verify identity" && (
            <>
              <T style={s.h2}>{form.Type}</T>
              <T style={s.sub}>
                Use the built-in sample identity to preview the approved state.
              </T>
              <Button
                label="Use sample approved identity"
                onPress={() => {
                  set((d) => ({ ...d, kyc: "Approved" }));
                  ss("");
                }}
              />
            </>
          )}
          {sheet === "Create chatbot" && (
            <>
              {field("Name", "Website assistant")}
              {choose(
                "Agent",
                data.agents.map((a) => a.name),
              )}
              <Toggle
                label="Restrict to specific websites"
                value={form.Restrict}
                onChange={(x: boolean) => v("Restrict", x)}
              />
              {form.Restrict && field("Allowed domains", "example.com")}
              <OrbPicker
                value={form["Chatbot avatar"] || "Orb 1"}
                onChange={(value) => v("Chatbot avatar", value)}
              />
              {field("Header title")}
              {field("Header subtitle")}
              {field("Greeting", "", true)}
              {field("Primary color")}
              {choose("Launcher position", ["Bottom right", "Bottom left"])}
              {field("Pause after inactivity", "30")}
              <Button
                label={selected ? "Save chatbot" : "Create chatbot"}
                disabled={!form.Name?.trim() || !data.agents.length}
                onPress={() => {
                  if (selected) {
                    set((d) => ({
                      ...d,
                      bots: d.bots.map((bot) =>
                        bot.id === selected.id
                          ? { ...bot, ...form, name: form.Name }
                          : bot,
                      ),
                    }));
                    ss("");
                    notify("Chatbot updated locally");
                  } else
                    save("bots", { ...form, name: form.Name, status: "Draft" });
                }}
              />
            </>
          )}
          {sheet === "Widget preview" && (
            <>
              <Card>
                <Image
                  source={orbSource(selected?.["Chatbot avatar"])}
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                />
                <T style={s.h2}>
                  {selected?.["Header title"] || "Chat with us"}
                </T>
                <T>{form.Greeting || selected?.Greeting}</T>
                {form.Answer && <T>{form.Answer}</T>}
              </Card>
              {field("Message", "Type your question…")}
              <Button
                label="Send"
                disabled={!form.Message?.trim()}
                onPress={() =>
                  v(
                    "Answer",
                    "Thanks for your message. This is a local preview of your website assistant.",
                  )
                }
              />
            </>
          )}
          {sheet.startsWith("Connect ") && (
            <>
              <T style={s.h2}>{form.App}</T>
              <T style={s.sub}>
                Preview the connected state locally. OAuth, tokens, and external
                permissions are not used.
              </T>
              {field("Connection label", "My workspace")}
              <Button
                label={
                  data.connections.includes(form.App)
                    ? "Disconnect locally"
                    : "Connect locally"
                }
                onPress={() => {
                  set((d) => ({
                    ...d,
                    connections: d.connections.includes(form.App)
                      ? d.connections.filter((x) => x !== form.App)
                      : [...d.connections, form.App],
                  }));
                  ss("");
                }}
              />
            </>
          )}
          {sheet === "Add custom API" && (
            <>
              {field("Name", "check_order_status")}
              {choose("Request type", [
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
              ])}
              {field("Description", "When should the agent call this?", true)}
              {field("URL", "https://api.example.com/orders/{{order_id}}")}
              {field("Header names", "Authorization, Content-Type")}
              {field("Response sample", "Example JSON response", true)}
              <T style={s.sub}>
                Do not enter API keys. Endpoint configuration stays local and is
                never called.
              </T>
              <Button
                label="Add API"
                disabled={
                  !form.Name?.trim() ||
                  !/^https?:\/\/.+\..+/.test(form.URL || "")
                }
                onPress={() =>
                  save("endpoints", {
                    name: form.Name,
                    method: form["Request type"],
                    url: form.URL,
                    description: form.Description,
                    sample: form["Response sample"],
                  })
                }
              />
            </>
          )}
          {sheet === "New campaign" && (
            <>
              <T style={s.h2}>01 · Campaign details</T>
              {field("Campaign name", "Untitled campaign")}
              {choose(
                "Agent",
                data.agents.map((a) => a.name),
              )}
              {choose(
                "Call from",
                data.numbers.length
                  ? data.numbers.map((n) => n.name)
                  : ["Sample number"],
              )}
              <T style={s.h2}>02 · Add contacts</T>
              {choose("Contacts source", [
                "Upload a sheet",
                "From CRM folders",
              ])}
              {form["Contacts source"] === "From CRM folders" ? (
                <>
                  {choose("CRM folder", [
                    "All contacts",
                    ...Array.from(
                      new Set(data.leads.map((l) => l.folder || "Unfiled")),
                    ),
                  ])}
                  <T style={s.sub}>
                    {
                      data.leads.filter(
                        (l) =>
                          !form["CRM folder"] ||
                          form["CRM folder"] === "All contacts" ||
                          (l.folder || "Unfiled") === form["CRM folder"],
                      ).length
                    }{" "}
                    local CRM leads selected
                  </T>
                </>
              ) : (
                <Button
                  outline
                  label={form.File || "Choose CSV / XLSX"}
                  icon="upload"
                  onPress={() => pick("Sheet")}
                />
              )}
              <Button
                outline
                small
                label="Download sample CSV"
                onPress={() =>
                  exportCSV(
                    [
                      {
                        id: "sample",
                        name: "Example lead",
                        email: "",
                        phone: "",
                        company: "",
                        stage: "New",
                        value: "",
                      },
                    ],
                    "campaign-sample",
                    notify,
                  )
                }
              />
              <T style={s.h2}>03 · Calling schedule</T>
              {choose("Start", ["On launch", "Schedule"])}
              {form.Start === "Schedule" &&
                field("Start date", "YYYY-MM-DD HH:mm")}
              {field("From")}
              {field("To")}
              {field("Timezone")}
              {choose("Days", ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], true)}
              {field("Max retries")}
              {field("Retry delay", "minutes")}
              <Toggle
                label="Results & automation"
                value={form.Results}
                onChange={(x: boolean) => v("Results", x)}
              />
              {form.Results && (
                <>
                  {field("Fields to capture")}
                  {field("Webhook URL")}
                </>
              )}
              <Card>
                <T style={s.h2}>Campaign summary</T>
                <T>
                  {form.Agent} · {form["Call from"]}
                </T>
                <T style={s.sub}>
                  {form.From} – {form.To} · {form.Timezone}
                </T>
                <T style={s.sub}>Saved as a draft. No outreach is launched.</T>
              </Card>
              <Button
                label="Save draft campaign"
                disabled={!data.agents.length}
                onPress={() =>
                  save("campaigns", {
                    ...form,
                    name: form["Campaign name"] || "Untitled campaign",
                    status: form.Start === "Schedule" ? "Scheduled" : "Draft",
                  })
                }
              />
            </>
          )}
          {sheet === "New lead" && (
            <>
              {["Name", "Company", "Email", "Phone", "Deal value (₹)"].map(
                (k) => field(k),
              )}
              {choose("Stage", [
                "New",
                "Contacted",
                "Qualified",
                "Proposal",
                "Won",
                "Lost",
              ])}
              {choose("Source", ["Manual", "Call", "Import", "Website"])}
              {field("Tags", "Comma separated")}
              {field("Custom fields", "City, interests…", true)}
              {field("Folder")}
              <Button
                label="Create lead"
                disabled={!form.Name?.trim()}
                onPress={() =>
                  save("leads", {
                    name: form.Name,
                    company: form.Company,
                    email: form.Email,
                    phone: form.Phone,
                    value: form["Deal value (₹)"] || 0,
                    stage: form.Stage || "New",
                    source: form.Source || "Manual",
                    tags: form.Tags,
                    custom: form["Custom fields"],
                    folder: form.Folder,
                  })
                }
              />
            </>
          )}
          {sheet === "Lead details" && selected && (
            <>
              <Field
                label="Name"
                value={form.name}
                onChangeText={(x: string) => v("name", x)}
              />
              {[
                "company",
                "email",
                "phone",
                "value",
                "tags",
                "folder",
                "notes",
              ].map((k) => field(k))}
              <Choices
                items={[
                  "New",
                  "Contacted",
                  "Qualified",
                  "Proposal",
                  "Won",
                  "Lost",
                ]}
                value={form.stage}
                onChange={(x: string) => v("stage", x)}
              />
              <Button
                label="Save lead"
                disabled={!form.name?.trim()}
                onPress={() => {
                  set((d) => ({
                    ...d,
                    leads: d.leads.map((l) =>
                      l.id === selected.id ? { ...l, ...form } : l,
                    ),
                  }));
                  ss("");
                  notify("Lead updated");
                }}
              />
              <Button
                outline
                label="Delete local lead"
                onPress={() => {
                  set((d) => ({
                    ...d,
                    leads: d.leads.filter((l) => l.id !== selected.id),
                  }));
                  ss("");
                }}
              />
            </>
          )}
          {sheet === "Import leads" && (
            <>
              <T style={s.sub}>
                Paste CSV with name,email,phone columns to import local
                contacts. CSV / XLSX file selection is available for campaign
                attachments; XLSX parsing is not implemented.
              </T>
              <Field
                label="CSV contents"
                multiline
                value={form.CSV || ""}
                onChangeText={(x: string) => v("CSV", x)}
                placeholder={
                  "name,email,phone\nJamie,jamie@example.com,+919999999999"
                }
              />
              <Button
                label="Import CSV"
                disabled={!form.CSV?.trim()}
                onPress={() => {
                  try {
                    const rows = parseCSV(form.CSV);
                    if (!rows.length) throw Error();
                    set((d) => ({
                      ...d,
                      leads: [
                        ...d.leads,
                        ...rows.map((r, i) => ({
                          id: Date.now() + "-" + i,
                          name: r.name,
                          email: r.email || "",
                          phone: r.phone || "",
                          stage: "New",
                          source: "Import",
                        })),
                      ],
                    }));
                    ss("");
                    notify(rows.length + " leads imported");
                  } catch {
                    notify(
                      "Use a name,email,phone header and at least one named contact.",
                    );
                  }
                }}
              />
            </>
          )}
          {sheet === "New folder" && (
            <>
              {field("Folder name")}
              <T style={s.sub}>
                Assign a folder to an existing lead. Empty folders are not
                retained.
              </T>
              {choose(
                "Lead",
                data.leads.map((l) => l.name),
              )}
              <Button
                label="Create folder & assign"
                disabled={!form["Folder name"]?.trim() || !data.leads.length}
                onPress={() => {
                  set((d) => ({
                    ...d,
                    leads: d.leads.map((l) =>
                      l.name === (form.Lead || d.leads[0].name)
                        ? { ...l, folder: form["Folder name"] }
                        : l,
                    ),
                  }));
                  ss("");
                }}
              />
            </>
          )}
          {sheet === "Visible columns" && (
            <>
              {choose(
                "Columns",
                ["Date", "Agent", "Duration", "Type", "Status", "Credits"],
                true,
              )}
              <Button
                label="Apply"
                onPress={() => {
                  ss("");
                  notify("Column preferences selected for this preview");
                }}
              />
            </>
          )}
          {sheet === "Add credits" && (
            <>
              {choose("Credits", ["100", "500", "1000", "5000"])}
              <T style={s.sub}>
                Local balance preview. No payment or purchase.
              </T>
              <Button
                label="Add demo credits"
                onPress={() => {
                  const credits = Number(form.Credits || 100);
                  set((d) => ({
                    ...d,
                    balance: d.balance + credits,
                    transactions: [
                      ...d.transactions,
                      {
                        id: Date.now().toString(),
                        name: "Demo top-up",
                        kind: "topup",
                        credits,
                        date: new Date().toLocaleDateString("en-IN"),
                      },
                    ],
                  }));
                  ss("");
                }}
              />
            </>
          )}
          {sheet === "Review plan" && (
            <>
              <T style={s.h1}>{form.Plan}</T>
              <T style={s.sub}>
                {form.Price < 0
                  ? "Custom pricing"
                  : "₹" + form.Price + "/month"}{" "}
                · Reference pricing from website
              </T>
              <T style={s.sub}>
                Change the local demo plan. No subscription is created.
              </T>
              <Button
                label="Use plan in demo"
                onPress={() => {
                  set((d) => ({
                    ...d,
                    plan: form.Plan,
                    transactions: [
                      ...d.transactions,
                      {
                        id: Date.now().toString(),
                        name: "Plan changed to " + form.Plan,
                        kind: "plan",
                        plan: form.Plan,
                        date: new Date().toLocaleDateString("en-IN"),
                      },
                    ],
                  }));
                  ss("");
                }}
              />
            </>
          )}
          {sheet === "Billing details" && (
            <>
              {[
                "Business name",
                "GSTIN",
                "Billing address",
                "Invoice email",
              ].map((k) => field(k))}
              <Button
                label="Save details locally"
                disabled={!form["Business name"]?.trim()}
                onPress={() => {
                  set((d) => ({
                    ...d,
                    transactions: [
                      ...d.transactions.filter((t) => t.kind !== "details"),
                      {
                        ...form,
                        id: Date.now().toString(),
                        name: form["Business name"],
                        kind: "details",
                      },
                    ],
                  }));
                  ss("");
                  notify("Billing details saved locally");
                }}
              />
            </>
          )}
          {sheet === "Create API key" && (
            <>
              {field("Key name")}
              <Button
                label="Create placeholder key"
                disabled={!form["Key name"]?.trim()}
                onPress={() => save("keys", { name: form["Key name"] })}
              />
            </>
          )}
          {sheet === "Report an issue" && (
            <>
              {field("Subject")}
              {choose("Category", [
                "Bug",
                "Billing",
                "Feature request",
                "Other",
              ])}
              {choose("Priority", ["Low", "Normal", "High", "Urgent"])}
              {field(
                "Description",
                "Expected result, actual result, steps and time",
                true,
              )}
              {[
                "Call ID",
                "Agent ID",
                "Campaign ID",
                "Payment / invoice ID",
                "Other reference",
                "Affected page",
              ].map((k) => field(k))}
              <Attachments
                value={form.Attachments || []}
                onChange={(files) => v("Attachments", files)}
                notify={notify}
              />
              <Button
                label="Save demo ticket"
                disabled={!form.Subject?.trim() || !form.Description?.trim()}
                onPress={() =>
                  save("tickets", {
                    name: form.Subject,
                    description: form.Description,
                    category: form.Category || "Bug",
                    priority: form.Priority || "Normal",
                    references: form,
                    status: "Local draft",
                  })
                }
              />
            </>
          )}
        </Sheet>
      )}
    </>
  );
}
async function exportCSV(
  items: RecordItem[],
  name: string,
  notify: (s: string) => void,
) {
  const keys = ["name", "email", "phone", "company", "stage", "value"];
  const csv = [
    keys.join(","),
    ...items.map((x) =>
      keys
        .map((k) => '"' + String(x[k] ?? "").replace(/"/g, '""') + '"')
        .join(","),
    ),
  ].join("\n");
  if (Platform.OS === "web") {
    const a = document.createElement("a");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.href = url;
    a.download = name + ".csv";
    a.click();
    URL.revokeObjectURL(url);
    notify("CSV exported");
  } else {
    try {
      const { File, Paths } = await import("expo-file-system");
      const Sharing = await import("expo-sharing");
      const file = new File(Paths.cache, name + ".csv");
      await file.write(csv);
      await Sharing.shareAsync(file.uri, { mimeType: "text/csv" });
    } catch {
      notify("Export is unavailable on this device");
    }
  }
}
