import React, { useState, useEffect } from "react";
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

const SelectChord: React.FC<SelectChordProps> = ({ selectedChords, onChordToggle }) => {
  const theme = useTheme();
  const [allChords, setAllChords] = useState<string[]>([]);
  const [filteredChords, setFilteredChords] = useState<ChordsByRoot>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadChords();
  }, []);

  useEffect(() => {
    filterChords();
  }, [allChords, searchQuery]);

  const loadChords = () => {
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
  };

  const filterChords = () => {
    const chordsByRoot: ChordsByRoot = {};

    allChords
      .filter((chord) => chord.toLowerCase().includes(searchQuery.toLowerCase()))
      .forEach((chord) => {
        // Extract root note (first character(s) before modifiers)
        const root = extractRoot(chord);
        if (!chordsByRoot[root]) {
          chordsByRoot[root] = [];
        }
        chordsByRoot[root].push(chord);
      });

    // Sort roots and chords within each root
    const sortedRoots = Object.keys(chordsByRoot).sort((a, b) => {
      const order = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"];
      return order.indexOf(a) - order.indexOf(b);
    });

    const sortedChordsByRoot: ChordsByRoot = {};
    sortedRoots.forEach((root) => {
      sortedChordsByRoot[root] = chordsByRoot[root].sort();
    });

    setFilteredChords(sortedChordsByRoot);
  };

  const extractRoot = (chord: string): string => {
    // Handle special cases like "sem acorde", "..", etc
    if (chord === "sem acorde" || chord === ".." || chord === "...") {
      return "Outros";
    }

    // Extract root note (C, C#, Db, etc.)
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

  const isChordSelected = (chord: string): boolean => {
    return selectedChords.includes(chord);
  };

  const handleChordPress = (chord: string) => {
    onChordToggle(chord);
  };

  const renderChordVisualization = (chord: string) => {
    // Don't show chord diagram for special cases
    if (chord === "sem acorde" || chord === ".." || chord === "..." || chord.trim() === "") {
      return null;
    }

    return (
      <View style={styles.chordVisualization}>
        <GuitarChord name={chord} size={60} />
      </View>
    );
  };

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
                    <View style={styles.chordColumn}>
                      {leftCol.map((chord) => (
                        <List.Item
                          key={chord}
                          title={chord}
                          onPress={() => handleChordPress(chord)}
                          left={() => <Checkbox status={isChordSelected(chord) ? "checked" : "unchecked"} onPress={() => handleChordPress(chord)} />}
                          right={() => renderChordVisualization(chord)}
                          style={[styles.chordItem, isChordSelected(chord) && { backgroundColor: theme.colors.primaryContainer }]}
                        />
                      ))}
                    </View>
                    <View style={styles.chordColumn}>
                      {rightCol.map((chord) => (
                        <List.Item
                          key={chord}
                          title={chord}
                          onPress={() => handleChordPress(chord)}
                          left={() => <Checkbox status={isChordSelected(chord) ? "checked" : "unchecked"} onPress={() => handleChordPress(chord)} />}
                          right={() => renderChordVisualization(chord)}
                          style={[styles.chordItem, isChordSelected(chord) && { backgroundColor: theme.colors.primaryContainer }]}
                        />
                      ))}
                    </View>
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
    paddingLeft: 16,
    paddingRight: 8,
  },
  chordVisualization: {
    marginRight: 8,
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
    // Optionally add padding for spacing between columns
    paddingRight: 4,
    paddingLeft: 4,
  },
});

export default SelectChord;
