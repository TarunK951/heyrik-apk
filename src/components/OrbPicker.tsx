import React from "react";
import { Image, Pressable, View } from "react-native";
import { T, C } from "../ui";
import { tapFeedback } from "../feedback";

export const orbs = [
  require("../../assets/brand/orb-00.jpg"),
  require("../../assets/brand/orb-01.jpg"),
  require("../../assets/brand/orb-02.jpg"),
  require("../../assets/brand/orb-03.jpg"),
  require("../../assets/brand/orb-04.jpg"),
  require("../../assets/brand/orb-05.jpg"),
  require("../../assets/brand/orb-06.jpg"),
  require("../../assets/brand/orb-07.jpg"),
  require("../../assets/brand/orb-08.jpg"),
  require("../../assets/brand/orb-09.jpg"),
  require("../../assets/brand/orb-10.jpg"),
  require("../../assets/brand/orb-11.jpg"),
];
export const orbSource = (value = "Orb 1") =>
  orbs[Number(value.replace("Orb ", "")) - 1] || orbs[0];

export function OrbPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      <T style={{ fontFamily: "GeistSemi", fontSize: 13 }}>Appearance</T>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {orbs.map((source, index) => {
          const label = "Orb " + (index + 1);
          return (
            <Pressable
              key={label}
              accessibilityRole="radio"
              accessibilityLabel={label}
              accessibilityState={{ checked: value === label }}
              onPress={() => {
                tapFeedback();
                onChange(label);
              }}
              style={{
                padding: 4,
                borderWidth: 2,
                borderColor: value === label ? C.ink : "transparent",
                borderRadius: 30,
              }}
            >
              <Image
                source={source}
                style={{ width: 44, height: 44, borderRadius: 22 }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
