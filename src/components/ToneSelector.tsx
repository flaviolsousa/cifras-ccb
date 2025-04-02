import React from "react";
import { View, StyleSheet } from "react-native";
import { Modal, Portal, Text, Button, useTheme } from "react-native-paper";

const TONES = ["Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G"];

interface ToneSelectorProps {
  visible: boolean;
  currentTone: string;
  onSelect: (tone: string) => void;
  onDismiss: () => void;
}

const ToneSelector = ({ visible, currentTone, onSelect, onDismiss }: ToneSelectorProps) => {
  const theme = useTheme();

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          Selecione o Tom
        </Text>
        <View style={styles.grid}>
          {TONES.map((tone) => (
            <Button key={tone} mode={tone === currentTone ? "contained" : "outlined"} onPress={() => onSelect(tone)} style={styles.toneButton}>
              {tone}
            </Button>
          ))}
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  toneButton: {
    width: 56,
  },
});

export default ToneSelector;
