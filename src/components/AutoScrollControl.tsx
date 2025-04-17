import React, { useState, useRef, useEffect } from "react";
import { Animated, Easing, View, StyleSheet, ScrollView } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import Slider from "@react-native-community/slider";
import _, { set } from "lodash";
import { HymnModel } from "../domain/HymnModel";

function getLettersAndVerses(hymn: HymnModel): { countLetters: number; countVerses: number; averageLetters: number } {
  if (!hymn.score?.stanzas) return { countLetters: 0, countVerses: 0, averageLetters: 0 };
  const countLetters = hymn.score.stanzas.reduce((acc, stanza) => {
    const sumVerses =
      stanza?.verses?.reduce((vAcc, verse) => {
        return vAcc + (verse?.lyrics?.length ?? 0);
      }, 0) ?? 0;
    return acc + sumVerses;
  }, 0);
  const countVerses = hymn.score.stanzas.reduce((acc, stanza) => {
    return acc + (stanza?.verses?.length ?? 0);
  }, 0);
  const averageLetters = countVerses > 0 ? countLetters / countVerses : 0;
  return { countLetters, countVerses, averageLetters };
}

function calculateScrollParams(hymn: HymnModel, speed: number, fontSize: number): number {
  const BASE_STEP = 5;

  let speedFactor;
  const MIN_SPEED_FACTOR = 0.25;
  const AVG_SPEED_FACTOR = 1;
  const MAX_SPEED_FACTOR = 10;
  if (speed <= 50) {
    speedFactor = ((AVG_SPEED_FACTOR - MIN_SPEED_FACTOR) * speed) / 50 + MIN_SPEED_FACTOR; // 0,25 <-> 1
  } else {
    speedFactor = (MAX_SPEED_FACTOR - AVG_SPEED_FACTOR) * Math.pow((speed - 50) / 50, 2.2) + AVG_SPEED_FACTOR; // 1 <-> 10 in curve
  }

  const timeReference = hymn.time?.reference ?? 1;

  const FONT_SIZE_REFERENCE = 22;
  let fontFactor = 1 + (fontSize - FONT_SIZE_REFERENCE) * 0.25;

  const { averageLetters } = getLettersAndVerses(hymn);

  const REFERENCE_LETTERS = 30;
  let lettersFactor = REFERENCE_LETTERS / Math.max(1, averageLetters);

  const combinedFactor = timeReference * fontFactor * lettersFactor;

  let step = BASE_STEP * combinedFactor * speedFactor;

  return step;
}

interface AutoScrollControlProps {
  scrollViewRef: React.RefObject<ScrollView>;
  contentHeight: number;
  viewportHeight: number;
  hymn: HymnModel | null;
  fontSize: number;
  lastScrollYRef: React.RefObject<number>;
  scoreTouchingRef: React.RefObject<boolean>;
  onScrollingChange: (isScrolling: boolean) => void;
}

const AutoScrollControl = ({
  scrollViewRef,
  contentHeight,
  viewportHeight,
  hymn,
  fontSize,
  lastScrollYRef,
  scoreTouchingRef,
  onScrollingChange,
}: AutoScrollControlProps) => {
  const theme = useTheme();

  const [isScrolling, setIsScrolling] = useState(false);
  const isScrollingRef = useRef(isScrolling);
  const [speed, setSpeed] = useState(50); // 0..100
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const currentSpeedRef = useRef(speed);

  const animatedScrollY = useRef(new Animated.Value(0)).current;
  const animatedListenerRef = useRef<any>(null);

  useEffect(() => {
    currentSpeedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);

  useEffect(() => {
    return () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      if (animatedListenerRef.current) {
        animatedScrollY.removeListener(animatedListenerRef.current);
      }
      isScrollingRef.current = false;
      onScrollingChange(false);
    };
  }, []);

  if (!hymn) return null;

  const scrollStep = () => {
    if (!scrollViewRef.current) return;

    const currentPos = lastScrollYRef.current || 0;
    const maxScroll = contentHeight - viewportHeight;

    const step = calculateScrollParams(hymn, currentSpeedRef.current, fontSize);

    if (currentPos >= maxScroll) return pause();

    if (animatedListenerRef.current) {
      animatedScrollY.removeListener(animatedListenerRef.current);
    }

    animatedScrollY.setValue(currentPos);

    animatedListenerRef.current = animatedScrollY.addListener(({ value }) => {
      if (scrollViewRef.current) {
        if (!scoreTouchingRef.current) {
          scrollViewRef.current?.scrollTo({ y: value, animated: false });
        } else {
          pause();
          waitToUnpause();
        }
      }
    });

    Animated.timing(animatedScrollY, {
      toValue: Math.min(currentPos + step, maxScroll),
      duration: 1000,
      easing: Easing.linear,
      delay: 0,
      useNativeDriver: false,
    }).start(() => {
      if (animatedListenerRef.current) {
        animatedScrollY.removeListener(animatedListenerRef.current);
        animatedListenerRef.current = null;
      }
      if (isScrollingRef.current) {
        scrollTimer.current = setTimeout(scrollStep, 0);
      }
    });
  };

  const waitToUnpause = () => {
    if (scoreTouchingRef.current) {
      setTimeout(waitToUnpause, 200);
    } else {
      play();
    }
  };

  const pause = () => {
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    if (animatedListenerRef.current) {
      animatedScrollY.removeListener(animatedListenerRef.current);
      animatedListenerRef.current = null;
    }
    setIsScrolling(false);
    onScrollingChange(false);
  };

  const play = () => {
    if (!isScrollingRef.current) {
      setIsScrolling(true);
      onScrollingChange(true);
      scrollStep();
    }
  };

  const handlePlayPause = () => {
    if (!isScrollingRef.current) {
      play();
    } else {
      pause();
    }
  };

  const handleSpeedChange = _.debounce((value: number) => setSpeed(value), 300);

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
