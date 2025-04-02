import React, { useRef, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { Surface, useTheme, IconButton } from "react-native-paper";
import GuitarChord from "./GuitarChord";

interface ChordPanelProps {
  selectedChord: string | null;
  allChords: string[];
  onChordSelect?: (chord: string) => void;
  onClose?: () => void;
}

const ChordPanel = ({ selectedChord, allChords, onChordSelect, onClose }: ChordPanelProps) => {
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const sortedChords = [...allChords].sort();

  // Efeito para scrollar até o acorde selecionado
  useEffect(() => {
    if (selectedChord && scrollViewRef.current) {
      const chordIndex = sortedChords.indexOf(selectedChord);
      if (chordIndex !== -1) {
        scrollViewRef.current.scrollTo({
          x: chordIndex * 180, // width do chordContainer
          animated: true,
        });
      }
    }
  }, [selectedChord, sortedChords]);

  return (
    <Surface style={styles.container}>
      <View style={styles.closeButtonContainer}>
        <IconButton icon="close-circle" size={32} style={styles.closeButton} onPress={onClose} />
      </View>
      <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false}>
        {sortedChords.map((chord, index) => (
          <View
            key={index}
            style={[
              styles.chordContainer,
              chord === selectedChord && {
                backgroundColor: theme.colors.primaryContainer,
                borderRadius: 8,
              },
            ]}
            onTouchEnd={() => onChordSelect?.(chord)}
          >
            <Text style={[styles.chordName, { color: theme.colors.onSurface }]}>{chord}</Text>
            <GuitarChord name={chord} size={160} />
          </View>
        ))}
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 225, // Increased height to accommodate larger chord diagrams
    elevation: 4,
    paddingTop: 8, // Increased to accommodate floating close button
    paddingBottom: 8,
  },
  closeButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -50,
    alignItems: "center",
    zIndex: 1,
  },
  closeButton: {
    backgroundColor: "white",
    borderRadius: 16,
  },
  chordContainer: {
    padding: 8,
    alignItems: "center",
    width: 180, // Increased width for larger chord diagrams
  },
  chordName: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default ChordPanel;
