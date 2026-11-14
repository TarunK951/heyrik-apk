import { tapFeedback } from "../feedback";
import React from "react";
import { Tabs } from "expo-router";
import { View, useWindowDimensions } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mainTabs, scrollTabToTop } from "../navigation";
export function PillNavigation() {
  const inset = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const side = Math.max(16, (width - 520) / 2);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: true,
        freezeOnBlur: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#0b0b0b",
        tabBarInactiveTintColor: "#99999f",
        tabBarLabelStyle: {
          fontFamily: "GeistSemi",
          fontSize: 10,
          marginBottom: 8,
        },
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(inset.bottom, 10),
          left: side,
          right: side,
          marginHorizontal: 0,
          height: 68,
          borderRadius: 32,
          paddingTop: 8,
          paddingBottom: 0,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "#e9e9ed",
          backgroundColor: "#fff",
          elevation: 6,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
        sceneStyle: { backgroundColor: "#fff" },
      }}
    >
      {mainTabs.map((t) => (
        <Tabs.Screen
          key={t.route}
          name={t.route}
          listeners={({ navigation }) => ({
            tabPress: () => {
              tapFeedback();
              if (navigation.isFocused()) scrollTabToTop(t.page);
            },
          })}
          options={{
            title: t.label,
            tabBarAccessibilityLabel: t.label,
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  height: 29,
                  width: 44,
                  borderRadius: 17,
                  backgroundColor: focused ? "#111" : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather
                  name={t.icon}
                  size={18}
                  color={focused ? "#fff" : "#99999f"}
                />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
