import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Card, T, Icon, s } from "../ui";
import { tapFeedback } from "../feedback";
export function Disclosure({
  title,
  children,
  initiallyOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
}) {
  const [open, so] = useState(initiallyOpen);
  return (
    <Card>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: open }}
        onPress={() => {
          tapFeedback();
          so(!open);
        }}
        style={[s.between, { minHeight: 34 }]}
      >
        <T style={[s.h2, { flex: 1 }]}>{title}</T>
        <Icon name={open ? "chevron-up" : "chevron-down"} size={18} />
      </Pressable>
      {open && <View style={{ gap: 16 }}>{children}</View>}
    </Card>
  );
}
