import React, { useState, useRef } from "react";
import { View, StyleSheet, Animated, ScrollView, Easing } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import Slider from "@react-native-community/slider";
import _ from "lodash";

interface AutoScrollControlProps {
  scrollViewRef: React.RefObject<ScrollView>;
  contentHeight: number;
  viewportHeight: number;
  timeReference: number;
  verseHeights: { [key: string]: number };
  footerHeight: number;
}

const AutoScrollControl = ({ scrollViewRef, contentHeight, viewportHeight, timeReference, verseHeights, footerHeight }: AutoScrollControlProps) => {
  const theme = useTheme();
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [posY, setPosY] = useState(0);
  const scrollAnimation = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);

  // Listen to scroll animation changes
  scrollAnimation.addListener(({ value }) => {
    scrollViewRef.current?.scrollTo({ y: value, animated: false });
    setPosY(value);
  });

  const handleOnValueChange = _.debounce((value: number) => {
    setSpeed(value);
    if (isScrolling) {
      // Restart animation with new speed while maintaining position
      startScrollAnimation((scrollAnimation as any).__getValue());
    }
  }, 500);

  const startScrollAnimation = (startPosition = 0) => {
    const maxScroll = contentHeight - viewportHeight;
    const duration = calculateDuration(maxScroll - startPosition, speed, timeReference);

    animation.current?.stop();
    scrollAnimation.setValue(startPosition);

    animation.current = Animated.timing(scrollAnimation, {
      toValue: maxScroll,
      duration,
      useNativeDriver: false,
      easing: Easing.linear,
    });

    animation.current.start((result) => {
      if (result.finished) {
        scrollAnimation.setValue(0);
        setIsScrolling(false);
      }
    });
  };

  const calculateDuration = (distance: number, speed: number, timeRef: number) => {
    // Base duration calculation - adjust these values as needed
    const baseSpeed = 50; // pixels per second at 50% speed
    const speedFactor = speed / 50;
    return (distance / (baseSpeed * speedFactor)) * 1000 * timeRef;
  };

  const handlePlayPause = () => {
    if (isScrolling) {
      animation.current?.stop();
    } else {
      startScrollAnimation(posY);
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
