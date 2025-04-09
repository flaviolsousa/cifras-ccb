import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import Slider from "@react-native-community/slider";
import _ from "lodash";

interface AutoScrollControlProps {
  scrollViewRef: React.RefObject<ScrollView>;
  contentHeight: number;
  viewportHeight: number;
  timeReference: number;
  fontSize: number;
  lastScrollYRef: React.RefObject<number>;
  onScrollingChange: (isScrolling: boolean) => void;
}

const AutoScrollControl = ({
  scrollViewRef,
  contentHeight,
  viewportHeight,
  timeReference,
  fontSize,
  lastScrollYRef,
  onScrollingChange,
}: AutoScrollControlProps) => {
  const theme = useTheme();
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(50);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const currentSpeedRef = useRef(speed);

  // Atualiza a ref quando speed mudar
  useEffect(() => {
    currentSpeedRef.current = speed;
  }, [speed]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      onScrollingChange(false);
    };
  }, []);

  const calculateStep = (speed: number) => {
    const min = 0.2;
    const max = 1.5;
    const step = Math.max(min, Math.min(max, (max - min) * (speed / 100) + min));
    return step;
  };

  const scrollStep = () => {
    if (!scrollViewRef.current) return;

    const currentPos = lastScrollYRef.current || 0;
    const maxScroll = contentHeight - viewportHeight;
    const step = calculateStep(currentSpeedRef.current);
    // console.log(`Current Position: ${currentPos}, Step: ${step}, Max Scroll: ${maxScroll}, Speed: ${currentSpeedRef.current}`);

    if (currentPos >= maxScroll) {
      setIsScrolling(false);
      onScrollingChange(false);
      return;
    }

    scrollViewRef.current?.scrollTo({
      y: currentPos + step,
      animated: false,
    });

    // Schedule next step
    scrollTimer.current = setTimeout(scrollStep, 16); // ~30fps
  };

  const handlePlayPause = () => {
    if (!isScrolling) {
      setIsScrolling(true);
      onScrollingChange(true); // Notify parent
      scrollStep();
    } else {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
        setIsScrolling(false);
      }
      onScrollingChange(false); // Notify parent
    }
  };

  // Removido o debounce
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
    paddingHorizontal: 8,
    paddingStart: 0,
  },
  button: {
    marginRight: 8,
  },
  slider: {
    flex: 1,
  },
});

export default AutoScrollControl;
