import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "https://command-center-backend-dvol.onrender.com";

const MONTHS_SHORT = [
  "Ιαν",
  "Φεβ",
  "Μαρ",
  "Απρ",
  "Μάι",
  "Ιουν",
  "Ιουλ",
  "Αυγ",
  "Σεπ",
  "Οκτ",
  "Νοε",
  "Δεκ",
];
const WEEKDAYS = [
  "Κυριακή",
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
];
const DAY_LETTERS = ["Δ", "Τ", "Τ", "Π", "Π", "Σ", "Κ"];

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMonth(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default function MiniCalendarWidget({ token }: { token: string }) {
  const today = new Date();
  const todayKey = formatDate(today);

  const [modalVisible, setModalVisible] = useState(false);
  const [view, setView] = useState<"month" | "day">("month");
  const [selectedDate, setSelectedDate] = useState(today);
  const [monthEvents, setMonthEvents] = useState<any[]>([]);
  const [dayEvents, setDayEvents] = useState<any[]>([]);
  const [newEventText, setNewEventText] = useState("");
  const [todayHasEvent, setTodayHasEvent] = useState(false);

  const loadMonthEvents = () => {
    fetch(`${API_URL}/events?month=${formatMonth(today)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMonthEvents(data);
        setTodayHasEvent(
          data.some((e: any) => e.event_date.startsWith(todayKey)),
        );
      });
  };

  useEffect(() => {
    loadMonthEvents();
  }, []);

  const loadDayEvents = (date: Date) => {
    const key = formatDate(date);
    fetch(`${API_URL}/events/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDayEvents(data));
  };

  const openWidget = () => {
    setView("month");
    setModalVisible(true);
  };

  const openDay = (day: number) => {
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    setSelectedDate(date);
    loadDayEvents(date);
    setView("day");
  };

  const backToMonth = () => {
    setView("month");
  };

  const closeEverything = () => {
    setModalVisible(false);
    setView("month");
  };

  const addEvent = () => {
    if (!newEventText.trim()) return;
    const key = formatDate(selectedDate);
    fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ date: key, text: newEventText }),
    })
      .then((res) => res.json())
      .then((newEvent) => {
        setDayEvents([...dayEvents, newEvent]);
        setNewEventText("");
        loadMonthEvents();
      });
  };

  const deleteEvent = (id: number) => {
    fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setDayEvents(dayEvents.filter((e) => e.id !== id));
      loadMonthEvents();
    });
  };

  const daysWithEvents = new Set(
    monthEvents.map((e) => new Date(e.event_date).getDate()),
  );

  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  ).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <>
      <TouchableOpacity onPress={openWidget} activeOpacity={0.8}>
        <BlurView intensity={40} tint="dark" style={styles.card}>
          <Text style={styles.weekday}>{WEEKDAYS[today.getDay()]}</Text>
          <Text style={styles.dayNumber}>{today.getDate()}</Text>
          <Text style={styles.month}>{MONTHS_SHORT[today.getMonth()]}</Text>
          {todayHasEvent && <View style={styles.badge} />}
        </BlurView>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeEverything}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={60} tint="dark" style={styles.modalContent}>
            {view === "month" ? (
              <>
                <Text style={styles.modalTitle}>
                  {MONTHS_SHORT[today.getMonth()]} {today.getFullYear()}
                </Text>

                <View style={styles.weekRow}>
                  {DAY_LETTERS.map((d, i) => (
                    <Text key={i} style={styles.dayLabel}>
                      {d}
                    </Text>
                  ))}
                </View>

                <View style={styles.grid}>
                  {cells.map((day, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.cell}
                      disabled={!day}
                      onPress={() => day && openDay(day)}
                      activeOpacity={0.6}
                    >
                      {day && (
                        <View
                          style={[
                            styles.dayCircle,
                            day === today.getDate() && styles.todayCircle,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              day === today.getDate() && styles.todayText,
                            ]}
                          >
                            {day}
                          </Text>
                          {daysWithEvents.has(day) && (
                            <View style={styles.dot} />
                          )}
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeEverything}
                >
                  <Text style={styles.closeButtonText}>Κλείσιμο</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>
                  {selectedDate.getDate()}{" "}
                  {MONTHS_SHORT[selectedDate.getMonth()]}
                </Text>

                <FlatList
                  data={dayEvents}
                  keyExtractor={(item) => item.id.toString()}
                  style={{ maxHeight: 180 }}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>Καμία σημείωση ακόμα</Text>
                  }
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.eventRow}
                      onLongPress={() => deleteEvent(item.id)}
                    >
                      <Text style={styles.eventText}>• {item.text}</Text>
                    </TouchableOpacity>
                  )}
                />

                <View style={styles.addRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Νέο event..."
                    placeholderTextColor="#6B7280"
                    value={newEventText}
                    onChangeText={setNewEventText}
                    onSubmitEditing={addEvent}
                  />
                  <TouchableOpacity style={styles.addButton} onPress={addEvent}>
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.hint}>Κράτα πατημένο για διαγραφή</Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={backToMonth}
                >
                  <Text style={styles.closeButtonText}>← Πίσω στο μήνα</Text>
                </TouchableOpacity>
              </>
            )}
          </BlurView>
        </View>
      </Modal>
    </>
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
    width: "100%",
  },
  weekday: {
    color: "#7C6FE0",
    fontSize: 10,
    fontFamily: "JetBrainsMono_400Regular",
    letterSpacing: 0.5,
  },
  dayNumber: {
    color: "#FFFFFF",
    fontSize: 30,
    fontFamily: "JetBrainsMono_700Bold",
    marginVertical: 2,
  },
  month: {
    color: "#9098A9",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E06F9E",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    overflow: "hidden",
  },
  modalTitle: {
    color: "#7C6FE0",
    fontSize: 14,
    fontFamily: "JetBrainsMono_700Bold",
    marginBottom: 16,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  todayCircle: {
    backgroundColor: "#7C6FE0",
  },
  dayText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  todayText: {
    fontFamily: "Inter_600SemiBold",
  },
  dot: {
    position: "absolute",
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E06F9E",
  },
  emptyText: {
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    paddingVertical: 12,
  },
  eventRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  eventText: {
    color: "#FFFFFF",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  addRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 12,
    fontFamily: "Inter_400Regular",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#7C6FE0",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: "JetBrainsMono_700Bold",
  },
  hint: {
    color: "#6B7280",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontFamily: "JetBrainsMono_700Bold",
  },
});
