import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRCodeWidget() {
  const [text, setText] = useState("");

  return (
    <BlurView intensity={40} tint="dark" style={styles.card}>
      <View style={styles.headerRow}>
        <Feather name="grid" size={16} color="#7C6FE0" />
        <Text style={styles.cardLabel}>QR CODE</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Γράψε κείμενο ή link..."
        placeholderTextColor="#6B7280"
        value={text}
        onChangeText={setText}
      />

      {text.length > 0 && (
        <View style={styles.qrContainer}>
          <QRCode
            value={text}
            size={140}
            backgroundColor="transparent"
            color="#FFFFFF"
          />
        </View>
      )}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(124,111,224,0.25)",
    backgroundColor: "rgba(124,111,224,0.06)",
    alignItems: "center",
  },
  cardLabel: {
    color: "#7C6FE0",
    fontSize: 11,
    fontFamily: "JetBrainsMono_400Regular",
    letterSpacing: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  input: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 12,
    width: "100%",
    marginBottom: 16,
  },
  qrContainer: {
    padding: 12,
  },
});
