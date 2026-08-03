import { Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
  useFonts,
} from "@expo-google-fonts/jetbrains-mono";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const [fontsLoaded] = useFonts({
    JetBrainsMono_700Bold,
    JetBrainsMono_400Regular,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  useEffect(() => {
    AsyncStorage.getItem("token").then((storedToken) => {
      setToken(storedToken);
      setCheckingStorage(false);
    });
  }, []);

  useEffect(() => {
    if (token && fontsLoaded) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [token, fontsLoaded]);

  const handleLogin = async (newToken: string) => {
    await AsyncStorage.setItem("token", newToken);
    setToken(newToken);
  };

  if (checkingStorage || !fontsLoaded) {
    return <View style={styles.container} />;
  }

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={["#0B0D14", "#14101F", "#0B0D14"]}
        style={styles.container}
      >
        <View style={styles.glow} />
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <ClockHeader />
          <WeatherWidget />
          <NoteWidget token={token} />
          <CounterWidget token={token} />
        </Animated.View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
