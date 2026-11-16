import { tapFeedback } from "./feedback";
import AdaptiveSwitch from "./components/AdaptiveSwitch";
import React from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export const C = {
  ink: "#0b0b0b",
  muted: "#707078",
  line: "#e5e5e7",
  soft: "#f5f5f5",
  green: "#078744",
};
export const art = {
  mark: require("../assets/brand/app-icon.png"),
  login: require("../assets/brand/login-art.jpg"),
  lilac: require("../assets/brand/mesh-lilac.jpg"),
  lagoon: require("../assets/brand/mesh-lagoon.jpg"),
  ember: require("../assets/brand/mesh-ember.jpg"),
  cobalt: require("../assets/brand/mesh-cobalt.jpg"),
  orb: require("../assets/brand/orb-03.jpg"),
  logo: require("../assets/brand/long.png"),
};
export function T({ children, style, ...p }: any) {
  return (
    <Text {...p} style={[s.text, style]}>
      {children}
    </Text>
  );
}
export function Icon({ name = "arrow-right", size = 19, color = C.ink }: any) {
  return <Feather name={name} size={size} color={color} />;
}
export function Button({
  label,
  onPress,
  outline = false,
  icon,
  disabled = false,
  small = false,
  style,
}: any) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      accessibilityState={{ disabled }}
      onPress={(event) => {
        tapFeedback();
        onPress?.(event);
      }}
      style={({ pressed }) => [
        s.button,
        outline && s.outline,
        small && { paddingVertical: 10, minHeight: 44 },
        disabled && { opacity: 0.35 },
        pressed && { opacity: 0.65 },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={17} color={outline ? C.ink : "#fff"} />}
      <T
        style={{
          color: outline ? C.ink : "#fff",
          fontFamily: "GeistSemi",
          fontSize: 14,
          flexShrink: 1,
          textAlign: "center",
        }}
      >
        {label}
      </T>
    </Pressable>
  );
}
export function IB({ name, onPress, label }: any) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label || name}
      onPress={(event) => {
        tapFeedback();
        onPress?.(event);
      }}
      style={s.ib}
    >
      <Icon name={name} />
    </Pressable>
  );
}
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
  keyboardType,
  inputStyle,
  style,
}: any) {
  return (
    <View style={[{ gap: 8, minWidth: 0 }, style]}>
      {label && <T style={s.label}>{label}</T>}
      <TextInput
        accessibilityLabel={label || placeholder}
        placeholder={placeholder}
        placeholderTextColor="#97979c"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        autoCorrect={keyboardType !== "email-address" && !secureTextEntry}
        returnKeyType={multiline ? "default" : "done"}
        keyboardType={keyboardType}
        autoCapitalize={
          keyboardType === "email-address" ||
          secureTextEntry ||
          placeholder?.startsWith("Search")
            ? "none"
            : "sentences"
        }
        clearButtonMode="while-editing"
        style={[
          s.input,
          multiline && { minHeight: 110, textAlignVertical: "top" },
          inputStyle,
        ]}
      />
    </View>
  );
}
export function Card({ children, style, onPress }: any) {
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      onPress={(event) => {
        tapFeedback();
        onPress?.(event);
      }}
      style={[s.card, style]}
    >
      {children}
    </Pressable>
  ) : (
    <View style={[s.card, style]}>{children}</View>
  );
}
export function Heading({ title, sub, eyebrow }: any) {
  return (
    <View style={{ gap: 8, marginBottom: 4 }}>
      {eyebrow && <T style={s.eyebrow}>{eyebrow}</T>}
      <T accessibilityRole="header" style={s.h1}>
        {title}
      </T>
      {sub && <T style={s.sub}>{sub}</T>}
    </View>
  );
}
export function Section({ title, children, action }: any) {
  return (
    <View style={{ gap: 14 }}>
      <View style={s.between}>
        <T style={[s.h2, { flex: 1, minWidth: 0 }]}>{title}</T>
        {action}
      </View>
      {children}
    </View>
  );
}
export function Badge({ label, green = false }: any) {
  return (
    <View style={[s.badge, green && { backgroundColor: "#e6f3eb" }]}>
      <T
        style={{
          fontSize: 11,
          color: green ? C.green : "#777",
          fontFamily: "GeistSemi",
        }}
      >
        {label}
      </T>
    </View>
  );
}
export function Tabs({ items, value, onChange }: any) {
  return (
    <ScrollView
      horizontal
      style={{ flexGrow: 0, minHeight: 48 }}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 7, paddingVertical: 3 }}
    >
      {items.map((x: string) => (
        <Pressable
          key={x}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === x }}
          onPress={() => {
            tapFeedback();
            onChange(x);
          }}
          style={[
            s.tab,
            value === x && { backgroundColor: C.ink, borderColor: C.ink },
          ]}
        >
          <T
            style={{
              fontSize: 13,
              color: value === x ? "white" : "#666",
              fontFamily: value === x ? "GeistSemi" : "Geist",
            }}
          >
            {x}
          </T>
        </Pressable>
      ))}
    </ScrollView>
  );
}
export function Choices({ items, value, onChange, multiple = false }: any) {
  return (
    <View style={s.wrap}>
      {items.map((x: string) => {
        let active = multiple ? value.includes(x) : value === x;
        return (
          <Pressable
            key={x}
            accessibilityRole={multiple ? "checkbox" : "radio"}
            accessibilityState={{ checked: active }}
            onPress={() =>
              onChange(
                multiple
                  ? active
                    ? value.filter((v: string) => v !== x)
                    : [...value, x]
                  : x,
              )
            }
            style={[
              s.choice,
              active && { borderColor: "#111", backgroundColor: "#f5f5f5" },
            ]}
          >
            <Icon
              name={active ? "check-circle" : "circle"}
              size={16}
              color={active ? C.ink : "#aaa"}
            />
            <T style={{ fontSize: 13, flexShrink: 1 }}>{x}</T>
          </Pressable>
        );
      })}
    </View>
  );
}
export function Toggle({ label, sub, value, onChange }: any) {
  return (
    <View style={[s.between, { gap: 16, paddingVertical: 7 }]}>
      <View style={{ flex: 1, gap: 4 }}>
        <T
          style={{
            fontFamily: "GeistSemi",
            fontSize: 14,
            flexShrink: 1,
            textAlign: "left",
          }}
        >
          {label}
        </T>
        {sub && (
          <T style={{ color: C.muted, fontSize: 12, lineHeight: 18 }}>{sub}</T>
        )}
      </View>
      <AdaptiveSwitch
        label={label}
        value={!!value}
        onChange={(value: boolean) => {
          tapFeedback();
          onChange(value);
        }}
      />
    </View>
  );
}
export function Empty({ icon = "inbox", title, sub, label, onPress }: any) {
  return (
    <Card style={{ alignItems: "center", paddingVertical: 38, gap: 13 }}>
      <View style={s.emptyIcon}>
        <Icon name={icon} size={25} color="#939398" />
      </View>
      <T style={{ fontFamily: "GeistSemi", fontSize: 16, textAlign: "center" }}>
        {title}
      </T>
      <T style={[s.sub, { textAlign: "center", fontSize: 13 }]}>{sub}</T>
      {label && <Button label={label} onPress={onPress} small />}
    </Card>
  );
}
export function Stats({ items }: any) {
  return (
    <View style={s.wrap}>
      {items.map(([label, value, sub]: string[]) => (
        <Card
          key={label}
          style={{
            flexGrow: 1,
            flexBasis: items.length === 3 ? "28%" : "43%",
            padding: items.length === 3 ? 12 : 16,
            gap: 8,
          }}
        >
          <T style={{ fontSize: 12, color: C.muted }}>{label}</T>
          <T style={{ fontSize: 25, fontFamily: "GeistSemi" }}>{value}</T>
          {sub && items.length !== 3 && (
            <T style={{ fontSize: 11, color: C.muted }}>{sub}</T>
          )}
        </Card>
      ))}
    </View>
  );
}
export function Row({
  title,
  sub,
  icon = "chevron-right",
  onPress,
  right,
}: any) {
  const Container = onPress ? Pressable : View;
  return (
    <Container
      accessibilityRole={onPress ? "button" : undefined}
      onPress={(event) => {
        tapFeedback();
        onPress?.(event);
      }}
      style={s.row}
    >
      <View style={{ flex: 1, gap: 5 }}>
        <T style={{ fontFamily: "GeistSemi", fontSize: 14 }}>{title}</T>
        {sub && (
          <T style={{ fontSize: 12, color: C.muted, lineHeight: 18 }}>{sub}</T>
        )}
      </View>
      {right || (onPress && <Icon name={icon} color="#777" size={18} />)}
    </Container>
  );
}
export function Sheet({ title, sub, children, onClose }: any) {
  const insets = useSafeAreaInsets();
  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={s.overlay}
      >
        <View
          accessibilityViewIsModal
          style={[s.sheet, { paddingBottom: insets.bottom }]}
        >
          <View style={s.handle} />
          <View style={s.between}>
            <T style={[s.h2, { flex: 1, minWidth: 0 }]}>{title}</T>
            <IB name="x" label="Close dialog" onPress={onClose} />
          </View>
          {sub && <T style={s.sub}>{sub}</T>}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              gap: 18,
              paddingTop: 14,
              paddingBottom: 36,
            }}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export const s = StyleSheet.create({
  text: { fontFamily: "Geist", fontSize: 15, color: C.ink },
  h1: {
    fontFamily: "GeistSemi",
    fontSize: 29,
    lineHeight: 35,
    letterSpacing: -1.1,
  },
  h2: { fontFamily: "GeistSemi", fontSize: 18, letterSpacing: -0.4 },
  sub: { fontSize: 14, color: "#707078", lineHeight: 21 },
  eyebrow: {
    fontSize: 11,
    color: "#8c8c91",
    letterSpacing: 1,
    fontFamily: "GeistSemi",
  },
  label: { fontSize: 13, fontFamily: "GeistSemi" },
  button: {
    backgroundColor: C.ink,
    borderRadius: 16,
    minHeight: 50,
    paddingHorizontal: 19,
    paddingVertical: 14,
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  outline: { backgroundColor: "white", borderColor: C.line, borderWidth: 1 },
  ib: {
    width: 44,
    height: 44,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
    minHeight: 48,
    fontFamily: "Geist",
    fontSize: 14,
    color: C.ink,
    backgroundColor: "#fff",
  },
  card: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 22,
    minWidth: 0,
    maxWidth: "100%",
    padding: 20,
    gap: 14,
    backgroundColor: "white",
  },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  badge: {
    backgroundColor: "#f1f1f2",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 24,
  },
  choice: {
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: C.soft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 17,
    borderBottomColor: C.line,
    borderBottomWidth: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#0006",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sheet: {
    maxHeight: "92%",
    width: "100%",
    maxWidth: 650,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 23,
    paddingTop: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#dedee1",
    alignSelf: "center",
    marginBottom: 15,
  },
});
