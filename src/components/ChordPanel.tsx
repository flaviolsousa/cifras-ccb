import React, { useRef, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { Surface, useTheme } from "react-native-paper";
import GuitarChord from "./GuitarChord";

interface ChordPanelProps {
  selectedChord: string | null;
  allChords: string[];
  onChordSelect?: (chord: string) => void;
}

const ChordPanel = ({ selectedChord, allChords, onChordSelect }: ChordPanelProps) => {
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  // Efeito para scrollar até o acorde selecionado
  useEffect(() => {
    if (selectedChord && scrollViewRef.current) {
      const chordIndex = allChords.indexOf(selectedChord);
      if (chordIndex !== -1) {
        scrollViewRef.current.scrollTo({
          x: chordIndex * 120, // width do chordContainer
          animated: true,
        });
      }
    }
  }, [selectedChord]);

  // Exemplo de dicionário de acordes - você precisará expandir isso
  const chordDictionary: { [key: string]: { frets: number[]; fingers: number[] } } = {
    C: { frets: [0, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
    D: { frets: [2, 3, 2, 0, -1, -1], fingers: [2, 3, 1, 0, 0, 0] },
    E: { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
    F: { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
    G: { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
    A: { frets: [0, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
    B: { frets: [2, 2, 4, 4, 4, 2], fingers: [1, 1, 2, 3, 4, 1] },
    Am: { frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
    Em: { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
    Dm: { frets: [1, 3, 2, 0, -1, -1], fingers: [1, 3, 2, 0, 0, 0] },
  };

  return (
    <Surface style={styles.container}>
      <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false}>
        {allChords.map((chord, index) => {
          const chordData = chordDictionary[chord] || { frets: [0, 0, 0, 0, 0, 0], fingers: [0, 0, 0, 0, 0, 0] };
          return (
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
              <GuitarChord name={chord} frets={chordData.frets} fingers={chordData.fingers} size={80} />
            </View>
          );
        })}
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
    height: 160, // Increased height to accommodate larger chord diagrams
    elevation: 4,
    paddingVertical: 8,
  },
  chordContainer: {
    padding: 8,
    alignItems: "center",
    width: 120, // Increased width for larger chord diagrams
  },
  chordName: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default ChordPanel;
