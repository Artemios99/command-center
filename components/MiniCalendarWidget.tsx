import { BlurView } from "expo-blur";
import { StyleSheet, Text, View } from "react-native";

const DAYS = ["Δ", "Τ", "Τ", "Π", "Π", "Σ", "Κ"];
const MONTHS = [
  "Ιανουάριος",
  "Φεβρουάριος",
  "Μάρτιος",
  "Απρίλιος",
  "Μάιος",
  "Ιούνιος",
  "Ιούλιος",
  "Αύγουστος",
  "Σεπτέμβριος",
  "Οκτώβριος",
  "Νοέμβριος",
  "Δεκέμβριος",
];

export default function MiniCalendarWidget() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <BlurView intensity={40} tint="dark" style={styles.card}>
      <Text style={styles.cardLabel}>
        {MONTHS[month]} {year}
      </Text>

      <View style={styles.weekRow}>
        {DAYS.map((d, i) => (
          <Text key={i} style={styles.dayLabel}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, i) => (
          <View key={i} style={styles.cell}>
            {day && (
              <View
                style={[
                  styles.dayCircle,
                  day === todayDate && styles.todayCircle,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    day === todayDate && styles.todayText,
                  ]}
                >
                  {day}
                </Text>
              </View>
            )}
          </View>
        ))}
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
    marginBottom: 12,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  todayCircle: {
    backgroundColor: "#7C6FE0",
  },
  dayText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  todayText: {
    fontFamily: "Inter_600SemiBold",
  },
});
