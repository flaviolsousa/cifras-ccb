import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import HymnFilterPanel from "./HymnFilterPanel";

type Props = {
  visible: boolean;
  showOnlyFavorites: boolean;
  showOnlyFlagged: boolean;
  selectedDifficulties: number[];
  selectedRhythms: string[];
  onChangeShowOnlyFavorites: (value: boolean) => void;
  onChangeShowOnlyFlagged: (value: boolean) => void;
  onToggleDifficulty: (difficulty: number) => void;
  onToggleRhythm: (rhythm: string) => void;
  onResetFilters: () => void;
  onCloseFilters: () => void;
  onlyFavoriteChords: boolean;
  onOnlyFavoriteChordsChange: (value: boolean) => void;
  favoriteChords: string[];
};

const HomeFilterPanelAnimated: React.FC<Props> = ({ visible, ...panelProps }) => {
  const [panelHeight, setPanelHeight] = useState(0);
  const panelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (panelHeight === 0 && visible) {
      return;
    }
    Animated.timing(panelAnim, {
      toValue: visible ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [visible, panelHeight, panelAnim]);

  const animatedStyle = {
    height: panelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, panelHeight || 0],
    }),
    opacity: panelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        translateY: panelAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-8, 0],
        }),
      },
    ],
  };

  return (
    <>
      {panelHeight === 0 && (
        <View
          pointerEvents="none"
          style={styles.measure}
          onLayout={(event) => setPanelHeight(event.nativeEvent.layout.height)}
        >
          <HymnFilterPanel {...panelProps} />
        </View>
      )}
      <Animated.View pointerEvents={visible ? "auto" : "none"} style={[styles.container, animatedStyle]}>
        <HymnFilterPanel {...panelProps} />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  measure: {
    position: "absolute",
    opacity: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
});

export default HomeFilterPanelAnimated;
