import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme, List, Checkbox, Searchbar, Text } from "react-native-paper";
import HymnService from "../services/Hymn/HymnService";
import GuitarChord from "./GuitarChord";

interface SelectChordProps {
  selectedChords: string[];
  onChordToggle: (chord: string) => void;
}

interface ChordsByRoot {
  [root: string]: string[];
}

// Ordem dos acordes extraída para fora do componente
const CHORD_ROOT_ORDER = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"];

const extractRoot = (chord: string): string => {
  if (chord === "sem acorde" || chord === ".." || chord === "...") {
    return "Outros";
  }

  const match = chord.match(/^([A-G][#b]?)/);
  return match ? match[1] : "Outros";
};

const shouldShowSection = (root: string, chords: string[]): boolean => {
  // Hide "Outros" section if it only contains special cases or is empty
  if (root === "Outros") {
    const hasValidChords = chords.some(
      (chord) => chord !== "sem acorde" && chord !== "." && chord !== ".." && chord !== "..." && chord.trim() !== "",
    );
    return hasValidChords;
  }
  return true;
};

const renderChordVisualization = (chord: string) => {
  // Don't show chord diagram for special cases
  if (chord === "sem acorde" || chord === "." || chord === ".." || chord === "..." || chord.trim() === "") {
    return null;
  }

  return (
    <View style={styles.chordVisualization}>
      <GuitarChord name={chord} size={70} />
    </View>
  );
};

// Função auxiliar para renderizar uma coluna de acordes
const ChordColumn = React.memo(
  ({
    chords,
    isChordSelected,
    handleChordPress,
    theme,
  }: {
    chords: string[];
    isChordSelected: (chord: string) => boolean;
    handleChordPress: (chord: string) => void;
    theme: any;
  }) => (
    <View style={styles.chordColumn}>
      {chords.map((chord) => (
        <List.Item
          key={chord}
          title={chord}
          accessibilityLabel={`Acorde ${chord}`}
          onPress={() => handleChordPress(chord)}
          left={() => (
            <View style={styles.chordCheckboxContainer}>
              <Checkbox status={isChordSelected(chord) ? "checked" : "unchecked"} onPress={() => handleChordPress(chord)} />
            </View>
          )}
          right={() => renderChordVisualization(chord)}
          style={[styles.chordItem, isChordSelected(chord) && { backgroundColor: theme.colors.primaryContainer }]}
          contentStyle={styles.chordItemContent}
        />
      ))}
    </View>
  ),
);

const SelectChord: React.FC<SelectChordProps> = ({ selectedChords, onChordToggle }) => {
  const theme = useTheme();
  const [allChords, setAllChords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadChords();
  }, []);

  const loadChords = useCallback(() => {
    try {
      const hymns = HymnService.getSimpleHymns();
      const chordSet = new Set<string>();

      hymns.forEach((hymn) => {
        if (hymn.chords && Array.isArray(hymn.chords)) {
          hymn.chords.forEach((chord: string) => {
            if (chord && chord.trim()) {
              chordSet.add(chord.trim());
            }
          });
        }
      });

      const uniqueChords = Array.from(chordSet).sort();
      setAllChords(uniqueChords);
    } catch (error) {
      console.error("Error loading chords:", error);
    }
  }, []);

  // Memoize filtragem e ordenação
  const filteredChords: ChordsByRoot = useMemo(() => {
    const chordsByRoot: ChordsByRoot = {};

    allChords
      .filter((chord) => chord.toLowerCase().includes(searchQuery.toLowerCase()))
      .forEach((chord) => {
        const root = extractRoot(chord);
        if (!chordsByRoot[root]) {
          chordsByRoot[root] = [];
        }
        chordsByRoot[root].push(chord);
      });

    // Ordena roots e acordes dentro de cada root
    const sortedRoots = Object.keys(chordsByRoot).sort((a, b) => CHORD_ROOT_ORDER.indexOf(a) - CHORD_ROOT_ORDER.indexOf(b));
    const sortedChordsByRoot: ChordsByRoot = {};
    sortedRoots.forEach((root) => {
      sortedChordsByRoot[root] = chordsByRoot[root].sort();
    });
    return sortedChordsByRoot;
  }, [allChords, searchQuery]);

  const isChordSelected = useCallback((chord: string) => selectedChords.includes(chord), [selectedChords]);

  const handleChordPress = useCallback((chord: string) => onChordToggle(chord), [onChordToggle]);

  return (
    <View style={styles.container}>
      <Searchbar placeholder="Buscar acordes..." onChangeText={setSearchQuery} value={searchQuery} style={styles.searchbar} />
      <ScrollView style={styles.scrollView}>
        {Object.keys(filteredChords).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">Nenhum acorde encontrado</Text>
          </View>
        ) : (
          Object.entries(filteredChords)
            .filter(([root, chords]) => shouldShowSection(root, chords))
            .map(([root, chords]) => {
              // Divide chords into two columns
              const mid = Math.ceil(chords.length / 2);
              const leftCol = chords.slice(0, mid);
              const rightCol = chords.slice(mid);

              return (
                <List.Section key={root}>
                  <List.Subheader style={styles.subHeader}>
                    {root} ({chords.length} acorde{chords.length !== 1 ? "s" : ""})
                  </List.Subheader>
                  <View style={styles.chordRow}>
                    <ChordColumn chords={leftCol} isChordSelected={isChordSelected} handleChordPress={handleChordPress} theme={theme} />
                    <ChordColumn chords={rightCol} isChordSelected={isChordSelected} handleChordPress={handleChordPress} theme={theme} />
                  </View>
                </List.Section>
              );
            })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  subHeader: {
    paddingLeft: 16,
    fontSize: 14,
    fontWeight: "600",
  },
  chordItem: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 0,
    paddingBottom: 0,
  },
  chordItemContent: {
    paddingLeft: 0,
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  chordCheckboxContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  chordVisualization: {
    padding: 0,
    margin: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  chordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  chordColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
});

export default SelectChord;
