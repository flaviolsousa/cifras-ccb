import React from "react";
import { useTheme, FAB } from "react-native-paper";
import { View, StyleSheet, Platform } from "react-native";
import { transpose } from "chord-transposer";
import { HymnModel } from "../domain/HymnModel";
import HymnService from "../services/Hymn/HymnService";

interface ToneNavigateProps {
  hymn: HymnModel;
  visible: boolean;
  onClose: () => void;
  onToneChange: (transposedHymn: HymnModel) => void;
  currentTone: string;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    right: 24,
    flexDirection: "row",
    zIndex: 100,
  },
  fab: {
    marginLeft: 12,
  },
});

const ToneNavigate = ({ hymn, visible, onClose, onToneChange, currentTone }: ToneNavigateProps) => {
  const theme = useTheme();

  React.useEffect(() => {
    if (Platform.OS !== "web") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        handleToneUp();
      } else if (e.key === "ArrowDown") {
        handleToneDown();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [currentTone, hymn]);

  const handleToneUp = () => {
    try {
      const newTone = transpose(currentTone).up(1).toString();
      const transposedHymn = HymnService.transposeHymn(hymn, newTone);
      onToneChange(transposedHymn);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToneDown = () => {
    try {
      const newTone = transpose(currentTone).down(1).toString();
      const transposedHymn = HymnService.transposeHymn(hymn, newTone);
      onToneChange(transposedHymn);
    } catch (e) {
      console.error(e);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <FAB icon="minus" onPress={handleToneDown} style={styles.fab} small accessibilityLabel="Diminuir tom" />
      <FAB icon="plus" onPress={handleToneUp} style={styles.fab} small accessibilityLabel="Aumentar tom" />
      <FAB icon="close" onPress={onClose} style={styles.fab} small accessibilityLabel="Fechar navegação de tom" />
    </View>
  );
};

export default ToneNavigate;
