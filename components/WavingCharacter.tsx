import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

export default function WavingCharacter() {
  return (
    <LottieView
      source={require("../assets/animations/Welcome.json")}
      autoPlay
      loop
      speed={2}
      style={styles.animation}
    />
  );
}

const styles = StyleSheet.create({
  animation: {
    width: 140,
    height: 140,
    position: "absolute",
    top: "28%",
    left: 0,
    right: 0,
    alignSelf: "center",
  },
});
