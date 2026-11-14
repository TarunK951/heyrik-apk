import React from "react";
import { Switch } from "react-native";
export type AdaptiveSwitchProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};
export default function AdaptiveSwitch({
  label,
  value,
  onChange,
}: AdaptiveSwitchProps) {
  return (
    <Switch
      accessibilityLabel={label}
      value={value}
      onValueChange={onChange}
      trackColor={{ false: "#dedee1", true: "#111" }}
    />
  );
}
