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
      <Text style={styles.cardLabel}>ΜΠΑΤΑΡΙΑ</Text>
      <View style={styles.row}>
        <View style={styles.batteryShape}>
          <View
            style={[
              styles.batteryFill,
              { width: `${level ?? 0}%`, backgroundColor: getColor() },
            ]}
          />
        </View>
        <Text style={[styles.percentage, { color: getColor() }]}>
          {level ?? "--"}%
        </Text>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardLabel: {
    color: "#7C6FE0",
    fontSize: 12,
    fontFamily: "JetBrainsMono_400Regular",
    letterSpacing: 1,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  batteryShape: {
    flex: 1,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    padding: 2,
  },
  batteryFill: {
    height: "100%",
    borderRadius: 3,
  },
  percentage: {
    fontSize: 15,
    fontFamily: "JetBrainsMono_700Bold",
    minWidth: 40,
    textAlign: "right",
  },
});
