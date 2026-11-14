import React, { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Image,
  View,
  Platform,
} from "react-native";
export function BrandLoader() {
  const [progress] = useState(() => new Animated.Value(0));
  const [reduce, setReduce] = useState(true);
  useEffect(() => {
    let alive = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (alive) setReduce(value);
    });
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduce,
    );
    return () => {
      alive = false;
      listener.remove();
    };
  }, []);
  useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 600,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(progress, {
          toValue: -1,
          duration: 600,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 300,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
      progress.setValue(0);
    };
  }, [progress, reduce]);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading HeyRik"
      accessibilityState={{ busy: true }}
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
      }}
    >
      <Animated.View
        style={{
          transform: [
            {
              rotate: progress.interpolate({
                inputRange: [-1, 1],
                outputRange: ["-3deg", "3deg"],
              }),
            },
            {
              translateY: progress.interpolate({
                inputRange: [-1, 1],
                outputRange: [-3, 3],
              }),
            },
          ],
        }}
      >
        <Image
          source={require("../../assets/brand/long.png")}
          resizeMode="contain"
          style={{ width: 160, height: 48 }}
        />
      </Animated.View>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: 3,
              backgroundColor: "#aab0bf",
              opacity: reduce
                ? 0.6
                : progress.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: i === 1 ? [0.3, 1, 0.3] : [1, 0.3, 1],
                  }),
            }}
          />
        ))}
      </View>
    </View>
  );
}
