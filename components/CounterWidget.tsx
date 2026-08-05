import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "https://command-center-backend-dvol.onrender.com";

export default function CounterWidget({ token }: { token: string }) {
  const [count, setCount] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetch(`${API_URL}/habits/coffee`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCount(data.count || 0));
  }, []);

  const animatePop = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const updateCount = (newCount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCount(newCount);
    animatePop();
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
        <View style={styles.headerRow}>
          <Feather name="coffee" size={16} color="#E06F9E" />
          <Text style={styles.cardLabel}>ΚΑΦΕΔΕΣ ΣΗΜΕΡΑ</Text>
        </View>
        <Animated.Text
          style={[styles.counterValue, { transform: [{ scale: scaleAnim }] }]}
        >
          {count}
        </Animated.Text>
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
    padding: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(224,111,158,0.25)",
    backgroundColor: "rgba(224,111,158,0.06)",
  },
  cardLabel: {
    color: "#E06F9E",
    fontSize: 11,
    fontFamily: "JetBrainsMono_400Regular",
    letterSpacing: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  counterCard: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
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
