import React, { useState } from "react";
import { T, Field, Heading, Card, Tabs, Row, s } from "./ui";
export function Planning() {
  const [tab, st] = useState("ROI calculator");
  const [values, sv] = useState<Record<string, string>>({});
  const n = (key: string, fallback: number) =>
    Math.max(0, Number(values[key] ?? fallback) || 0);
  const calls = n("Calls per month", 2500),
    duration = n("Average call duration", 2.5),
    staff = n("Current staff cost", 180),
    ai = n("Estimated AI cost", 7),
    share = Math.min(100, n("Share suitable for automation", 70)) / 100;
  const current = ((calls * duration) / 60) * staff,
    projected = current * (1 - share) + calls * duration * share * ai,
    saving = current - projected;
  const missed =
      n("Missed calls per day", 18) * n("Operating days per month", 26),
    qualified = (missed * Math.min(100, n("Qualified caller rate", 35))) / 100,
    customers =
      (qualified * Math.min(100, n("Conversion after callback", 18))) / 100;
  const field = (key: string, defaultValue: number, suffix = "") => (
    <Field
      key={key}
      label={key + suffix}
      keyboardType="decimal-pad"
      value={String(values[key] ?? defaultValue)}
      onChangeText={(x: string) => sv((v) => ({ ...v, [key]: x }))}
    />
  );
  const money = (x: number) => "₹" + Math.round(x).toLocaleString("en-IN");
  return (
    <>
      <Heading
        eyebrow="WORKSPACE CALCULATORS"
        title="Plan your calling economics"
        sub="Estimate AI calling ROI and the revenue opportunity in missed calls."
      />
      <Tabs
        items={["ROI calculator", "Missed-call revenue"]}
        value={tab}
        onChange={st}
      />
      {tab === "ROI calculator" ? (
        <>
          <Card>
            {field("Calls per month", 2500)}
            {field("Average call duration", 2.5, " (minutes)")}
            {field("Current staff cost", 180, " (₹ per hour)")}
            {field("Estimated AI cost", 7, " (₹ per minute)")}
            {field("Share suitable for automation", 70, " (%)")}
          </Card>
          <Card>
            <T style={s.eyebrow}>ESTIMATED MONTHLY SAVING</T>
            <T style={s.h1}>{money(saving)}</T>
            <T style={s.sub}>
              About {current ? Math.round((saving / current) * 100) : 0}%
              against the assumptions entered. Planning estimate, not a quote.
            </T>
            <Row title="Current" sub={money(current)} />
            <Row title="Projected" sub={money(projected)} />
          </Card>
        </>
      ) : (
        <>
          <Card>
            {field("Missed calls per day", 18)}
            {field("Operating days per month", 26)}
            {field("Qualified caller rate", 35, " (%)")}
            {field("Conversion after callback", 18, " (%)")}
            {field("Average customer value", 8000, " (₹)")}
          </Card>
          <Card>
            <T style={s.eyebrow}>POTENTIAL MONTHLY REVENUE AT RISK</T>
            <T style={s.h1}>
              {money(customers * n("Average customer value", 8000))}
            </T>
            <T style={s.sub}>
              Monthly funnel: {missed} missed calls, {Math.round(qualified)}{" "}
              qualified opportunities, about {customers.toFixed(1)} customers.
            </T>
            <T style={s.sub}>
              Assumes qualified missed calls receive useful callbacks. Use your
              real answer and conversion data when available.
            </T>
          </Card>
        </>
      )}
    </>
  );
}
