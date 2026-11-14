import React from "react";
import { Host, Switch } from "@expo/ui";
import { accessibilityLabel } from "@expo/ui/swift-ui/modifiers";
import type { AdaptiveSwitchProps } from "./AdaptiveSwitch";
export default function AdaptiveSwitch({
  label,
  value,
  onChange,
}: AdaptiveSwitchProps) {
  return (
    <Host matchContents colorScheme="light" seedColor="#111111">
      <Switch
        value={value}
        onValueChange={onChange}
        modifiers={[accessibilityLabel(label)]}
        testID={label}
      />
    </Host>
  );
}
