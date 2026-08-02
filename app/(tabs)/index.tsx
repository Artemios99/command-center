import { StyleSheet, View } from "react-native";
import ClockHeader from "../../components/ClockHeader";
import CounterWidget from "../../components/CounterWidget";
import NoteWidget from "../../components/NoteWidget";
import WeatherWidget from "../../components/WeatherWidget";

export default function CommandCenter() {
  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      <ClockHeader />
      <WeatherWidget />
      <NoteWidget />
      <CounterWidget />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0D14",
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  glow: {
    position: "absolute",
    top: -100,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#7C6FE0",
    opacity: 0.25,
  },
});
