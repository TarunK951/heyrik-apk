import React, { useState } from "react";
import { View } from "react-native";
import { useStore } from "../store";
import {
  Heading,
  Button,
  Card,
  T,
  s,
  Empty,
  Sheet,
  Field,
  Toggle,
  IB,
  Stats,
} from "../ui";
import { Select } from "./Select";
import { SearchToolbar } from "./SearchToolbar";

const templates = [
  "Calls by direction",
  "Goal achievement",
  "Top call outcomes",
  "Usage over time",
  "Connection rate",
  "Busiest hours",
];
const metrics = [
  "Total calls",
  "Goal achievement",
  "Call outcomes",
  "Credits used",
  "Connection rate",
  "Talk time",
];
const defaults = {
  name: "Calls by direction",
  metric: "Total calls",
  breakdown: "Direction",
  interval: "Weekly",
  appearance: "Bar",
  color: "Black",
};

export function Analytics({
  open,
  notify,
}: {
  open: (page: string) => void;
  notify: (message: string) => void;
}) {
  const { data, set } = useStore();
  const [agent, setAgent] = useState("All agents");
  const [period, setPeriod] = useState("28 days");
  const [compare, setCompare] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [filters, setFilters] = useState({
    direction: "All directions",
    campaign: "All campaigns",
    channel: "Phone and web",
  });
  const [sheet, setSheet] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Recommended");
  const [draft, setDraft] = useState(defaults);
  const [editing, setEditing] = useState("");
  const [placement, setPlacement] = useState("End of dashboard");
  const configure = (name: string) => {
    setEditing("");
    setDraft({
      ...defaults,
      name,
      metric: metrics[templates.indexOf(name)] || "Total calls",
    });
    setSheet("Configure chart");
  };
  const move = (id: string, direction: number) =>
    set((d) => {
      const charts = [...d.charts];
      const index = charts.findIndex((c) => c.id === id);
      const target = index + direction;
      if (target < 0 || target >= charts.length) return d;
      [charts[index], charts[target]] = [charts[target], charts[index]];
      return { ...d, charts };
    });
  const save = () => {
    if (!draft.name.trim()) return;
    const chart = {
      ...draft,
      name: draft.name.trim(),
      id: editing || Date.now().toString(),
    };
    set((d) => ({
      ...d,
      charts: editing
        ? d.charts.map((c) => (c.id === editing ? chart : c))
        : placement === "Start of dashboard"
          ? [chart, ...d.charts]
          : [...d.charts, chart],
    }));
    setSheet("");
    notify("Chart saved locally");
  };
  return (
    <>
      <Heading
        title="Analytics"
        sub="Production calls across your agents, over your selected period."
      />
      <Button
        label="Add chart"
        icon="plus"
        onPress={() => {
          setSearch("");
          setSheet("Add a chart");
        }}
      />
      <Button outline label="Export analytics" disabled />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Select
            label="Reporting period"
            compact
            items={["7 days", "28 days", "90 days", "Custom"]}
            value={period}
            onChange={setPeriod}
          />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Select
            label="Agent"
            compact
            items={["All agents", ...data.agents.map((a) => a.name)]}
            value={agent}
            onChange={setAgent}
          />
        </View>
      </View>
      {period === "Custom" && (
        <Card>
          <Field
            label="From"
            placeholder="YYYY-MM-DD"
            value={from}
            onChangeText={setFrom}
          />
          <Field
            label="To"
            placeholder="YYYY-MM-DD"
            value={to}
            onChangeText={setTo}
          />
          {!!from &&
            !!to &&
            (!/^\d{4}-\d{2}-\d{2}$/.test(from) ||
              !/^\d{4}-\d{2}-\d{2}$/.test(to) ||
              from > to) && (
              <T style={s.sub}>
                Enter a valid range with the start before the end.
              </T>
            )}
        </Card>
      )}
      <Toggle
        label="Compare previous period"
        value={compare}
        onChange={setCompare}
      />
      <Button
        outline
        label="Filters"
        icon="sliders"
        onPress={() => setSheet("Analytics filters")}
      />
      <T style={s.sub}>
        {[filters.direction, filters.campaign, filters.channel].join(" · ")}
      </T>
      <Stats
        items={[
          ["Calls handled", "0"],
          ["Talk time", "0 min"],
          ["Answer rate", "0%"],
          ["Credits used", "0"],
        ]}
      />
      {data.charts.map((chart, index) => (
        <Card key={chart.id}>
          <T style={s.h2}>{chart.name}</T>
          <T style={s.sub}>
            {chart.metric} · {chart.breakdown} · {chart.interval} ·{" "}
            {chart.appearance}
          </T>
          <T style={s.sub}>
            No calls in this period. Charts populate when production calls are
            connected.
          </T>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <IB
              name="edit-2"
              label={"Edit " + chart.name}
              onPress={() => {
                setEditing(chart.id);
                setDraft({ ...defaults, ...chart } as typeof defaults);
                setSheet("Configure chart");
              }}
            />
            {index > 0 && (
              <IB
                name="arrow-up"
                label={"Move " + chart.name + " up"}
                onPress={() => move(chart.id, -1)}
              />
            )}
            {index < data.charts.length - 1 && (
              <IB
                name="arrow-down"
                label={"Move " + chart.name + " down"}
                onPress={() => move(chart.id, 1)}
              />
            )}
            <IB
              name="trash-2"
              label={"Remove " + chart.name}
              onPress={() =>
                set((d) => ({
                  ...d,
                  charts: d.charts.filter((c) => c.id !== chart.id),
                }))
              }
            />
          </View>
        </Card>
      ))}
      {!data.charts.length && (
        <Empty
          icon="bar-chart-2"
          title="Your first call starts here"
          sub="Production calls appear here. Test calls from the agent builder are not counted."
          label="Go to AI agents"
          onPress={() => open("AI Agents")}
        />
      )}
      <T style={s.sub}>Production calls · Asia/Kolkata · Local preview</T>
      {!!sheet && (
        <Sheet title={sheet} onClose={() => setSheet("")}>
          {sheet === "Add a chart" && (
            <>
              <SearchToolbar
                label="Search charts"
                value={search}
                onChange={setSearch}
              >
                <Select
                  label="Chart category"
                  items={[
                    "Recommended",
                    "Calls",
                    "Outcomes",
                    "Usage",
                    "Quality",
                  ]}
                  value={category}
                  onChange={setCategory}
                  compact
                />
              </SearchToolbar>
              {templates
                .filter(
                  (name, index) =>
                    name.toLowerCase().includes(search.toLowerCase()) &&
                    (category === "Recommended" ||
                      (category === "Calls" && [0, 5].includes(index)) ||
                      (category === "Outcomes" && [1, 2].includes(index)) ||
                      (category === "Usage" && index === 3) ||
                      (category === "Quality" && index === 4)),
                )
                .map((name) => (
                  <Button
                    key={name}
                    outline
                    label={name}
                    onPress={() => configure(name)}
                  />
                ))}
              <Button
                label="Build from scratch"
                onPress={() => configure("New chart")}
              />
            </>
          )}
          {sheet === "Configure chart" && (
            <>
              <Field
                label="Chart title"
                value={draft.name}
                onChangeText={(name: string) =>
                  setDraft((d) => ({ ...d, name }))
                }
              />
              <Select
                label="Metric"
                items={metrics}
                value={draft.metric}
                onChange={(metric) => setDraft((d) => ({ ...d, metric }))}
              />
              <Select
                label="Breakdown"
                items={[
                  "Direction",
                  "Agent",
                  "Status",
                  "Channel",
                  "Campaign",
                  "None",
                ]}
                value={draft.breakdown}
                onChange={(breakdown) => setDraft((d) => ({ ...d, breakdown }))}
              />
              <Select
                label="Time interval"
                items={["Daily", "Weekly", "Monthly", "Hourly"]}
                value={draft.interval}
                onChange={(interval) => setDraft((d) => ({ ...d, interval }))}
              />
              <Select
                label="Appearance"
                items={["Bar", "Line", "Donut", "Number"]}
                value={draft.appearance}
                onChange={(appearance) =>
                  setDraft((d) => ({ ...d, appearance }))
                }
              />
              <Select
                label="Chart color"
                items={["Black", "Purple", "Blue", "Green"]}
                value={draft.color}
                onChange={(color) => setDraft((d) => ({ ...d, color }))}
              />
              <Card>
                <T style={s.h2}>{draft.name || "Untitled chart"}</T>
                <T style={s.sub}>Preview · No calls in this period</T>
                <T style={s.sub}>
                  {agent} · {period} ·{" "}
                  {compare ? "Comparison on" : "Comparison off"}
                </T>
              </Card>
              {!editing && (
                <Select
                  label="Placement"
                  items={["End of dashboard", "Start of dashboard"]}
                  value={placement}
                  onChange={setPlacement}
                />
              )}
              <Button
                label={editing ? "Save chart" : "Add to dashboard"}
                disabled={!draft.name.trim()}
                onPress={save}
              />
            </>
          )}
          {sheet === "Analytics filters" && (
            <>
              <Select
                label="Agent"
                items={["All agents", ...data.agents.map((a) => a.name)]}
                value={agent}
                onChange={setAgent}
              />
              <Select
                label="Direction"
                items={["All directions", "Inbound", "Outbound"]}
                value={filters.direction}
                onChange={(direction) =>
                  setFilters((f) => ({ ...f, direction }))
                }
              />
              <Select
                label="Campaign"
                items={["All campaigns", ...data.campaigns.map((c) => c.name)]}
                value={filters.campaign}
                onChange={(campaign) => setFilters((f) => ({ ...f, campaign }))}
              />
              <Select
                label="Channel"
                items={["Phone and web", "Phone", "Web"]}
                value={filters.channel}
                onChange={(channel) => setFilters((f) => ({ ...f, channel }))}
              />
              <Button label="Apply filters" onPress={() => setSheet("")} />
              <Button
                outline
                label="Clear filters"
                onPress={() => {
                  setAgent("All agents");
                  setFilters({
                    direction: "All directions",
                    campaign: "All campaigns",
                    channel: "Phone and web",
                  });
                }}
              />
            </>
          )}
        </Sheet>
      )}
    </>
  );
}
