import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import Slider from "@react-native-community/slider";
import _ from "lodash";

interface AutoScrollControlProps {
  onStartScroll: (speed: number) => void;
  onStopScroll: () => void;
  maxHeight: number;
  timeReference: number;
}

const AutoScrollControl = ({ onStartScroll, onStopScroll, maxHeight, timeReference }: AutoScrollControlProps) => {
  const theme = useTheme();
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(50); // Default slider value (50%)

  const minSpeed = maxHeight / (timeReference * 2.5); // Slowest speed
  const maxSpeed = maxHeight / (timeReference * 0.5); // Fastest speed

  const handleOnValueChange = _.debounce((value: number) => {
    setSpeed(value);
  }, 500);

  const handlePlayPause = () => {
    if (isScrolling) {
      onStopScroll();
    } else {
      const calculatedSpeed = minSpeed + (speed / 100) * (maxSpeed - minSpeed);
      onStartScroll(calculatedSpeed);
    }
    setIsScrolling(!isScrolling);
  };

  return (
    <View style={styles.container}>
      <IconButton icon={isScrolling ? "pause" : "play"} onPress={handlePlayPause} style={styles.button} iconColor={theme.colors.primary} />
      <Slider
        value={speed}
        onValueChange={handleOnValueChange}
        minimumValue={0}
        maximumValue={100}
        step={1}
        style={styles.slider}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.onSurface}
        thumbTintColor={theme.colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  button: {
    marginRight: 8,
  },
  slider: {
    flex: 1,
  },
});

export default AutoScrollControl;
