import { BlurView } from "expo-blur";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CounterWidget() {
  const [count, setCount] = useState(0);

  return (
    <BlurView
      intensity={40}
      tint="dark"
      style={[styles.card, styles.counterCard]}
    >
      <View>
        <Text style={styles.cardLabel}>ΚΑΦΕΔΕΣ ΣΗΜΕΡΑ</Text>
        <Text style={styles.counterValue}>{count}</Text>
      </View>

      <View style={styles.counterButtons}>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => setCount(Math.max(0, count - 1))}
        >
          <Text style={styles.counterButtonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.counterButton, styles.counterButtonPrimary]}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 16,
  },
  cardLabel: {
    color: "#7C6FE0",
    fontSize: 12,
    fontFamily: "monospace",
    letterSpacing: 1,
    marginBottom: 10,
  },
  counterCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counterValue: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "700",
  },
  counterButtons: {
    flexDirection: "row",
    gap: 10,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  counterButtonPrimary: {
    backgroundColor: "#7C6FE0",
  },
  counterButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
});
