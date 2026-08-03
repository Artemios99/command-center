import { BlurView } from "expo-blur";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

function getWeatherLabel(code: number) {
  if (code === 0) return "Καθαρός ουρανός";
  if (code <= 3) return "Νεφώσεις";
  if (code <= 48) return "Ομίχλη";
  if (code <= 67) return "Βροχή";
  if (code <= 77) return "Χιόνι";
  if (code <= 99) return "Καταιγίδα";
  return "Άγνωστο";
}

export default function WeatherWidget() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadWeather() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Δεν δόθηκε άδεια τοποθεσίας");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`,
      );
      const data = await res.json();

      setTemperature(data.current.temperature_2m);
      setWeatherCode(data.current.weather_code);
      setLoading(false);
    }

    loadWeather().catch((err) => {
      console.error("Σφάλμα καιρού:", err);
      setErrorMsg("Σφάλμα φόρτωσης");
      setLoading(false);
    });
  }, []);

  return (
    <BlurView intensity={40} tint="dark" style={styles.card}>
      <Text style={styles.cardLabel}>ΚΑΙΡΟΣ ΤΩΡΑ</Text>

      {loading ? (
        <ActivityIndicator color="#7C6FE0" style={{ marginTop: 8 }} />
      ) : errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <View style={styles.weatherRow}>
          <Text style={styles.temperature}>
            {Math.round(temperature ?? 0)}°
          </Text>
          <Text style={styles.weatherLabel}>
            {getWeatherLabel(weatherCode ?? -1)}
          </Text>
        </View>
      )}
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
  weatherRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 12,
  },
  temperature: {
    color: "#FFFFFF",
    fontSize: 36,
    fontFamily: "JetBrainsMono_700Bold",
  },
  weatherLabel: {
    color: "#9098A9",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  errorText: {
    color: "#EF6E6E",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
});
