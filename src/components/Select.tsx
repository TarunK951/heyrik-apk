import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { tapFeedback } from "../feedback";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type Props = {
  label: string;
  value: string;
  items: string[];
  onChange: (value: string) => void;
  compact?: boolean;
};
export function Select({
  label,
  value,
  items,
  onChange,
  compact = false,
}: Props) {
  const [open, so] = useState(false),
    [query, sq] = useState("");
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const filtered = useMemo(() => {
    if (!open) return [];
    const search = query.trim().toLowerCase();
    return search
      ? items.filter((x) => x.toLowerCase().includes(search))
      : items;
  }, [items, query, open]);
  return (
    <View style={{ flexShrink: 1, minWidth: 0, gap: 7 }}>
      {!compact && (
        <Text style={{ fontFamily: "GeistSemi", fontSize: 12, color: "#777" }}>
          {label}
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label + ": " + value}
        accessibilityState={{ expanded: open }}
        accessibilityHint="Opens selection list"
        onPress={() => {
          tapFeedback();
          sq("");
          so(true);
        }}
        style={{
          height: 46,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#e5e5e7",
          paddingHorizontal: 13,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: "#fff",
        }}
      >
        <Text
          numberOfLines={1}
          style={{ flex: 1, fontFamily: "Geist", fontSize: 13, color: "#111" }}
        >
          {value || label}
        </Text>
        <Feather name="chevron-down" size={16} color="#777" />
      </Pressable>
      {open && (
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={() => so(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              backgroundColor: "#0005",
            }}
          >
            <Pressable
              accessibilityLabel="Dismiss selection"
              onPress={() => so(false)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <View
              accessibilityViewIsModal
              style={{
                backgroundColor: "white",
                width: "100%",
                maxWidth: 560,
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                padding: 22,
                paddingBottom: Math.max(32, insets.bottom + 12),
                maxHeight: height * 0.78,
                gap: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  accessibilityRole="header"
                  style={{
                    fontFamily: "GeistSemi",
                    fontSize: 20,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {label}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close selection"
                  onPress={() => so(false)}
                  style={{
                    width: 44,
                    height: 44,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="x" size={20} />
                </Pressable>
              </View>
              {items.length > 6 && (
                <TextInput
                  accessibilityLabel={"Search " + label.toLowerCase()}
                  placeholder="Search options…"
                  value={query}
                  onChangeText={sq}
                  autoCapitalize="none"
                  style={{
                    height: 46,
                    paddingHorizontal: 14,
                    borderWidth: 1,
                    borderColor: "#e5e5e7",
                    borderRadius: 14,
                    fontFamily: "Geist",
                    fontSize: 14,
                  }}
                />
              )}
              <FlatList
                data={filtered}
                keyExtractor={(x) => x}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={{ flexGrow: 0 }}
                initialNumToRender={12}
                maxToRenderPerBatch={12}
                ListEmptyComponent={
                  <Text
                    style={{ fontFamily: "Geist", padding: 15, color: "#888" }}
                  >
                    No matching options
                  </Text>
                }
                renderItem={({ item }) => (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: item === value }}
                    accessibilityLabel={item}
                    onPress={() => {
                      tapFeedback();
                      onChange(item);
                      so(false);
                    }}
                    style={{
                      minHeight: 52,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 15,
                      borderBottomWidth: 1,
                      borderColor: "#f1f1f2",
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: item === value ? "GeistSemi" : "Geist",
                        fontSize: 14,
                      }}
                    >
                      {item}
                    </Text>
                    {item === value && <Feather name="check" size={18} />}
                  </Pressable>
                )}
              />
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </View>
  );
}
