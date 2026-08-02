import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ClockHeader from "../../components/ClockHeader";
import CounterWidget from "../../components/CounterWidget";
import LoginScreen from "../../components/LoginScreen";
import NoteWidget from "../../components/NoteWidget";
import WeatherWidget from "../../components/WeatherWidget";

export default function CommandCenter() {
  const [token, setToken] = useState<string | null>(null);
  const [checkingStorage, setCheckingStorage] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("token").then((storedToken) => {
      setToken(storedToken);
      setCheckingStorage(false);
    });
  }, []);

  const handleLogin = async (newToken: string) => {
    await AsyncStorage.setItem("token", newToken);
    setToken(newToken);
  };

  if (checkingStorage) {
    return <View style={styles.container} />;
  }

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.glow} />
        <ClockHeader />
        <WeatherWidget />
        <NoteWidget token={token} />
        <CounterWidget token={token} />
      </View>
    </TouchableWithoutFeedback>
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
