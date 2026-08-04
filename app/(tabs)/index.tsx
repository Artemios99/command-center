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
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ClockHeader from "../../components/ClockHeader";
import CounterWidget from "../../components/CounterWidget";
import LoginScreen from "../../components/LoginScreen";
import NoteWidget from "../../components/NoteWidget";
import WavingCharacter from "../../components/WavingCharacter";
import WeatherWidget from "../../components/WeatherWidget";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function getGlowColor() {
  const hour = new Date().getHours();
  if (hour < 6) return "#4A5FE0";
  if (hour < 12) return "#F0A868";
  if (hour < 18) return "#7C6FE0";
  if (hour < 22) return "#E06F9E";
  return "#4A5FE0";
}

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

  const greetingTextOpacity = useRef(new Animated.Value(0)).current;
  const stage = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const breathe = useRef(new Animated.Value(1)).current;

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
      Animated.timing(greetingTextOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(stage, {
          toValue: 1,
          duration: 700,
          useNativeDriver: false,
        }).start(() => {
          setShowGreeting(false);
        });

        Animated.timing(greetingTextOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [token, fontsLoaded]);

  useEffect(() => {
    if (!showGreeting) {
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

      Animated.loop(
        Animated.sequence([
          Animated.timing(breathe, {
            toValue: 1.15,
            duration: 2200,
            useNativeDriver: true,
          }),
          Animated.timing(breathe, {
            toValue: 1,
            duration: 2200,
            useNativeDriver: true,
          }),
        ]),
      ).start();
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

  const glowScale = stage.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 1],
  });
  const glowOpacity = stage.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.25],
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={["#0B0D14", "#14101F", "#0B0D14"]}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: getGlowColor(),
              opacity: glowOpacity,
              transform: [{ scale: Animated.multiply(glowScale, breathe) }],
            },
          ]}
        />
        {showGreeting && (
          <Animated.View
            style={[styles.greetingWrapper, { opacity: greetingTextOpacity }]}
          >
            <WavingCharacter />
            <Text style={styles.greetingText}>{getGreeting()}, Artemios</Text>
          </Animated.View>
        )}

        {!showGreeting && (
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
        )}
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
  greetingText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 28,
    fontFamily: "JetBrainsMono_700Bold",
    marginTop: 12,
  },
  glow: {
    position: "absolute",
    top: -100,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  greetingWrapper: {
    position: "absolute",
    top: "28%",
    left: 20,
    right: 20,
    alignItems: "center",
  },
});
