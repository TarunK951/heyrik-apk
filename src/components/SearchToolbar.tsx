import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Field, Icon, C } from "../ui";
import { tapFeedback } from "../feedback";

export function SearchToolbar({
  label,
  value,
  onChange,
  children,
  actions,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(!!value);
  return (
    <View
      style={{
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: C.line,
        paddingTop: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          minWidth: 0,
        }}
      >
        <View style={{ flex: 1, minWidth: 0, flexDirection: "row", gap: 8 }}>
          {React.Children.map(
            children,
            (child) =>
              child && <View style={{ flex: 1, minWidth: 0 }}>{child}</View>,
          )}
        </View>
        {actions}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={expanded ? "Close " + label.toLowerCase() : label}
          accessibilityState={{ expanded }}
          onPress={() => {
            tapFeedback();
            if (expanded) onChange("");
            setExpanded(!expanded);
          }}
          style={{
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 22,
            borderWidth: 1,
            borderColor: C.line,
            backgroundColor: "white",
          }}
        >
          <Icon name={expanded ? "x" : "search"} size={18} />
        </Pressable>
      </View>
      {expanded && (
        <Field
          accessibilityLabel={label}
          placeholder={label + "…"}
          value={value}
          onChangeText={onChange}
          autoFocus
        />
      )}
    </View>
  );
}
