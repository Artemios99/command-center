import { BlurView } from "expo-blur";
import { useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";

export default function NoteWidget() {
  const [note, setNote] = useState("");

  return (
    <BlurView intensity={40} tint="dark" style={styles.card}>
      <Text style={styles.cardLabel}>QUICK NOTE</Text>
      <TextInput
        style={styles.noteInput}
        placeholder="Γράψε κάτι..."
        placeholderTextColor="#6B7280"
        value={note}
        onChangeText={setNote}
        multiline
      />
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
  noteInput: {
    color: "#FFFFFF",
    fontSize: 16,
    minHeight: 60,
  },
});
