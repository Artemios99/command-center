import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function getWeatherIcon(code: number) {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 57) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "❄️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

function getWeatherLabel(code: number) {
  if (code === 0) return "Καθαρός ουρανός";
  if (code <= 2) return "Λίγα σύννεφα";
  if (code === 3) return "Συννεφιά";
  if (code <= 48) return "Ομίχλη";
  if (code <= 57) return "Ψιλόβροχο";
  if (code <= 67) return "Βροχή";
  if (code <= 77) return "Χιόνι";
  if (code <= 82) return "Μπόρες";
  if (code <= 86) return "Χιονόπτωση";
  if (code <= 99) return "Καταιγίδα";
  return "Άγνωστο";
}

function getDayName(dateStr: string, index: number) {
  if (index === 0) return "Σήμερα";
  if (index === 1) return "Αύριο";
  const date = new Date(dateStr);
  return date.toLocaleDateString("el-GR", { weekday: "long" });
}

export default function WeatherWidget() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const [daily, setDaily] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    let Location: typeof import("expo-location");

    async function loadWeather() {
      Location = await import("expo-location");
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Δεν δόθηκε άδεια τοποθεσίας");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`,
      );
      const data = await res.json();

      setTemperature(data.current.temperature_2m);
      setWeatherCode(data.current.weather_code);

      const days = data.daily.time.map((date: string, i: number) => ({
        date,
        code: data.daily.weather_code[i],
        max: Math.round(data.daily.temperature_2m_max[i]),
        min: Math.round(data.daily.temperature_2m_min[i]),
      }));
      setDaily(days);

      setLoading(false);
    }

    loadWeather().catch((err) => {
      console.error("Σφάλμα καιρού:", err);
      setErrorMsg("Σφάλμα φόρτωσης");
      setLoading(false);
    });
  }, []);

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <BlurView intensity={40} tint="dark" style={styles.card}>
          <Text style={styles.cardLabel}>ΚΑΙΡΟΣ ΤΩΡΑ</Text>

          {loading ? (
            <ActivityIndicator color="#7C6FE0" style={{ marginTop: 8 }} />
          ) : errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : (
            <View style={styles.weatherRow}>
              <Text style={styles.icon}>
                {getWeatherIcon(weatherCode ?? -1)}
              </Text>
              <View>
                <Text style={styles.temperature}>
                  {Math.round(temperature ?? 0)}°
                </Text>
                <Text style={styles.weatherLabel}>
                  {getWeatherLabel(weatherCode ?? -1)}
                </Text>
              </View>
            </View>
          )}
        </BlurView>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={60} tint="dark" style={styles.modalContent}>
            <Text style={styles.modalTitle}>ΠΡΟΓΝΩΣΗ 5 ΗΜΕΡΩΝ</Text>

            <FlatList
              data={daily}
              keyExtractor={(item) => item.date}
              renderItem={({ item, index }) => (
                <View style={styles.dayRow}>
                  <Text style={styles.dayName}>
                    {getDayName(item.date, index)}
                  </Text>
                  <Text style={styles.dayIcon}>
                    {getWeatherIcon(item.code)}
                  </Text>
                  <Text style={styles.dayTemp}>
                    {item.max}° / {item.min}°
                  </Text>
                </View>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Κλείσιμο</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </Modal>
    </>
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
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  icon: {
    fontSize: 28,
  },
  temperature: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "JetBrainsMono_700Bold",
  },
  weatherLabel: {
    color: "#9098A9",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  errorText: {
    color: "#EF6E6E",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
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
    fontSize: 13,
    fontFamily: "JetBrainsMono_400Regular",
    letterSpacing: 1,
    marginBottom: 16,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  dayName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  dayIcon: {
    fontSize: 22,
    marginHorizontal: 12,
  },
  dayTemp: {
    color: "#9098A9",
    fontSize: 15,
    fontFamily: "JetBrainsMono_400Regular",
  },
  closeButton: {
    backgroundColor: "#7C6FE0",
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
