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
  View
} from "react-native";
import ClockHeader from "../../components/ClockHeader";
import CounterWidget from "../../components/CounterWidget";
import LoginScreen from "../../components/LoginScreen";
import NoteWidget from "../../components/NoteWidget";
import WeatherWidget from "../../components/WeatherWidget";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return "Καλό βράδυ";
  if (hour < 12) return "Καλημέρα";
  if (hour < 18) return "Καλό απόγευμα";
  return "Καλησπέρα";
}

export default function CommandCenter() {
  const [token, setToken] = useState<string | null>(null);
  const [checkingStorage, setCheckingStorage] = useState(true);
  const [showGreeting, setShowGreeting] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const greetingFade = useRef(new Animated.Value(0)).current;
  const greetingExitFade = useRef(new Animated.Value(1)).current;

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
    if (token && fontsLoaded && showGreeting) {
      Animated.timing(greetingFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(greetingExitFade, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setShowGreeting(false);
        });
      }, 1600);

      return () => clearTimeout(timer);
    }
  }, [token, fontsLoaded]);

  useEffect(() => {
    if (token && !showGreeting) {
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
  }, [showGreeting]);

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

  if (showGreeting) {
    return (
      <LinearGradient
        colors={["#0B0D14", "#14101F", "#0B0D14"]}
        style={styles.greetingContainer}
      >
        <View style={styles.glow} />
        <Animated.Text
          style={[
            styles.greetingText,
            { opacity: Animated.multiply(greetingFade, greetingExitFade) },
          ]}
        >
          {getGreeting()}, Artemios
        </Animated.Text>
      </LinearGradient>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={["#0B0D14", "#14101F", "#0B0D14"]}
        style={styles.container}
      >
        <View style={styles.glow} />
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
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
  greetingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  greetingText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontFamily: "JetBrainsMono_700Bold",
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
