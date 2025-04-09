import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { set } from "lodash";

interface AutoScrollControlProps {
  scrollViewRef: React.RefObject<ScrollView>;
  contentHeight: number;
  viewportHeight: number;
  timeReference: number;
  verseHeights: { [key: string]: number };
  footerHeight: number;
  lastScrollYRef: React.RefObject<number>;
}

const AutoScrollControl = ({
  scrollViewRef,
  contentHeight,
  viewportHeight,
  timeReference,
  verseHeights,
  footerHeight,
  lastScrollYRef,
}: AutoScrollControlProps) => {
  const theme = useTheme();
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(50);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  const calculateStep = (speed: number) => {
    // Base step is 1 pixel, adjusted by speed
    const baseStep = 0.5;
    return Math.max(1, baseStep * (speed / 50));
  };

  const scrollStep = () => {
    if (!scrollViewRef.current) return;

    const currentPos = lastScrollYRef.current || 0;
    const maxScroll = contentHeight - viewportHeight;
    const step = calculateStep(speed);

    if (currentPos >= maxScroll) {
      setIsScrolling(false);
      return;
    }

    scrollViewRef.current?.scrollTo({
      y: currentPos + step,
      animated: false,
    });

    // Schedule next step
    scrollTimer.current = setTimeout(scrollStep, 16); // ~60fps
  };

  const handlePlayPause = () => {
    // setIsScrolling(!isScrolling);

    if (!isScrolling) {
      setIsScrolling(true);
      // Starting scroll
      scrollStep();
    } else {
      // Stopping scroll
      setIsScrolling(false);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    }
  };

  const handleSpeedChange = (value: number) => {
    setSpeed(value);
  };

  return (
    <View style={styles.container}>
      <IconButton icon={isScrolling ? "pause" : "play"} onPress={handlePlayPause} style={styles.button} iconColor={theme.colors.primary} />
      <Slider
        value={speed}
        onValueChange={handleSpeedChange}
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
