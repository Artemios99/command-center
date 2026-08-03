import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API_URL = "https://command-center-backend-dvol.onrender.com";

export default function CounterWidget({ token }: { token: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/habits/coffee`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCount(data.count || 0));
  }, []);

  const updateCount = (newCount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCount(newCount);
    fetch(`${API_URL}/habits/coffee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ count: newCount }),
    });
  };

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
          onPress={() => updateCount(Math.max(0, count - 1))}
          activeOpacity={0.6}
        >
          <Text style={styles.counterButtonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.counterButton, styles.counterButtonPrimary]}
          onPress={() => updateCount(count + 1)}
          activeOpacity={0.6}
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
    fontFamily: "JetBrainsMono_400Regular",
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
    fontFamily: "JetBrainsMono_700Bold",
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
    fontFamily: "JetBrainsMono_700Bold",
  },
});
