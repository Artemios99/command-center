import { Feather } from "@expo/vector-icons";
import * as Battery from "expo-battery";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function BatteryWidget() {
  const [level, setLevel] = useState<number | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      setLevel(null);
      return;
    }

    Battery.getBatteryLevelAsync().then((l) => setLevel(Math.round(l * 100)));

    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setLevel(Math.round(batteryLevel * 100));
    });

    return () => subscription.remove();
  }, []);

  const getColor = () => {
    if (level === null) return "#9098A9";
    if (level < 20) return "#EF6E6E";
    if (level < 50) return "#F0C24B";
    return "#62C776";
  };

  return (
    <BlurView intensity={40} tint="dark" style={styles.card}>
      <View style={styles.headerRow}>
        <Feather name="battery-charging" size={16} color={getColor()} />
        <Text style={[styles.cardLabel, { color: getColor() }]}>ΜΠΑΤΑΡΙΑ</Text>
      </View>
      <Text style={[styles.percentage, { color: getColor() }]}>
        {level ?? "--"}%
      </Text>
      <View style={styles.batteryShape}>
        <View
          style={[
            styles.batteryFill,
            { width: `${level ?? 0}%`, backgroundColor: getColor() },
          ]}
        />
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(98,199,118,0.25)",
    backgroundColor: "rgba(98,199,118,0.06)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 11,
    fontFamily: "JetBrainsMono_400Regular",
    letterSpacing: 1,
  },
  percentage: {
    fontSize: 26,
    fontFamily: "JetBrainsMono_700Bold",
    marginBottom: 8,
  },
  batteryShape: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  batteryFill: {
    height: "100%",
    borderRadius: 4,
  },
});
