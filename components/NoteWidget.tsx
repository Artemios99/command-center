import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";

const API_URL = "http://192.168.10.61:3000";

export default function NoteWidget({ token }: { token: string }) {
  const [note, setNote] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setNote(data.content || ""));
  }, []);

  const saveNote = (text: string) => {
    setNote(text);
    fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: text }),
    });
  };

  return (
    <BlurView intensity={40} tint="dark" style={styles.card}>
      <Text style={styles.cardLabel}>QUICK NOTE</Text>
      <TextInput
        style={styles.noteInput}
        placeholder="Γράψε κάτι..."
        placeholderTextColor="#6B7280"
        value={note}
        onChangeText={saveNote}
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
