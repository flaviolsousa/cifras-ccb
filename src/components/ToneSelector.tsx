import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Modal, Portal, Text, useTheme } from "react-native-paper";

const TONES = ["Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G"];

interface ToneSelectorProps {
  visible: boolean;
  currentTone: string;
  originalTone: string;
  onSelect: (tone: string) => void;
  onDismiss: () => void;
}

const ToneSelector = ({ visible, currentTone, originalTone, onSelect, onDismiss }: ToneSelectorProps) => {
  const theme = useTheme();

  const getCapoPosition = (targetTone: string): number => {
    const originalIndex = TONES.indexOf(originalTone);
    const targetIndex = TONES.indexOf(targetTone);

    if (originalIndex === -1 || targetIndex === -1) return 0;

    let diff = originalIndex - targetIndex;
    if (diff < 0) diff += 12;

    return diff;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      margin: 20,
      paddingBottom: 30,
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
      gap: 12,
    },
    toneButton: {
      minHeight: 72,
      flexBasis: 95,
      marginHorizontal: 4,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      borderWidth: 1,
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    toneButtonOutlined: {
      borderColor: theme.colors.outline,
      backgroundColor: "transparent",
    },
    toneButtonContained: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    toneText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    toneTextOutlined: {
      color: theme.colors.onSurface,
    },
    toneTextContained: {
      color: theme.colors.onPrimary,
    },
    capoText: {
      fontSize: 11,
      opacity: 0.8,
      marginTop: 2,
    },
    buttonContent: {
      flexDirection: "column",
      alignItems: "center",
    },
  });

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          Selecione o Tom
        </Text>
        <View style={styles.grid}>
          {TONES.map((tone) => {
            const capoPosition = getCapoPosition(tone);
            const isSelected = tone === currentTone;
            return (
              <Pressable
                key={tone}
                onPress={() => onSelect(tone)}
                style={[styles.toneButton, isSelected ? styles.toneButtonContained : styles.toneButtonOutlined]}
              >
                <View style={styles.buttonContent}>
                  <Text style={[styles.toneText, isSelected ? styles.toneTextContained : styles.toneTextOutlined]}>{tone}</Text>
                  {capoPosition > 0 && (
                    <Text style={[styles.capoText, isSelected ? styles.toneTextContained : styles.toneTextOutlined]}>Capo {capoPosition}</Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </Portal>
  );
};

export default ToneSelector;
