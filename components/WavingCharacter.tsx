import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

export default function WavingCharacter() {
  return (
    <LottieView
      source={require("../assets/animations/Welcome.json")}
      autoPlay
      loop
      speed={1.5}
      resizeMode="contain"
      style={styles.animation}
    />
  );
}

const styles = StyleSheet.create({
  animation: {
    width: 300,
    height: 200,
    alignSelf: "center",
  },
});
