import React from "react";
import { NativeTabs } from "expo-router/native-tabs";
export function NativeNavigation() {
  return (
    <NativeTabs
      tintColor="#0b0b0b"
      minimizeBehavior="onScrollDown"
      labelStyle={{ fontSize: 11 }}
    >
      <NativeTabs.Trigger name="agents">
        <NativeTabs.Trigger.Icon sf="waveform" />
        <NativeTabs.Trigger.Label>Agents</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calls">
        <NativeTabs.Trigger.Icon sf="phone" />
        <NativeTabs.Trigger.Label>Calls</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="crm">
        <NativeTabs.Trigger.Icon sf="person.2" />
        <NativeTabs.Trigger.Label>CRM</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="campaigns">
        <NativeTabs.Trigger.Icon sf="paperplane" />
        <NativeTabs.Trigger.Label>Outreach</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="more">
        <NativeTabs.Trigger.Icon sf="square.grid.2x2" />
        <NativeTabs.Trigger.Label>More</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
