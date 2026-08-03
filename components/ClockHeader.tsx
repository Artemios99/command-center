import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ClockHeader() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeString = now.toLocaleTimeString("el-GR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>Γεια σου, Artemios</Text>
      <Text style={styles.time}>{timeString}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 30,
  },
  greeting: {
    color: "#9098A9",
    fontSize: 15,
    fontFamily: "JetBrainsMono_400Regular",
  },
  time: {
    color: "#FFFFFF",
    fontSize: 42,
    fontFamily: "JetBrainsMono_700Bold",
    marginTop: 4,
  },
});
