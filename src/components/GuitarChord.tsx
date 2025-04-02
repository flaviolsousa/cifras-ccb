import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { getGuitarChordData } from "./GuitarChordDictionary";

interface GuitarChordProps {
  name: string;
  frets?: number[];
  fingers?: number[];
  size?: number;
}

const GuitarChord: React.FC<GuitarChordProps> = ({ name, frets: customFrets, fingers: customFingers, size = 120 }) => {
  const chordData = customFrets && customFingers ? { frets: customFrets, fingers: customFingers } : getGuitarChordData(name);
  const { frets, fingers } = chordData;
  const theme = useTheme();
  const stringCount = 6;
  const fretCount = 5;

  const stringSpacing = size / 7;
  const fretSpacing = size / 6;
  const dotSize = stringSpacing * 0.8;

  // Função para encontrar barras
  const findBars = () => {
    const bars = [];
    for (let fret = 1; fret <= fretCount; fret++) {
      for (let finger = 1; finger <= 4; finger++) {
        const positions = fingers
          .map((f, i) => ({ finger: f, fret: frets[i], string: i }))
          .filter((pos) => pos.finger === finger && pos.fret === fret);

        if (positions.length > 1) {
          const firstString = Math.min(...positions.map((p) => p.string));
          const lastString = Math.max(...positions.map((p) => p.string));
          if (lastString - firstString > 0) {
            bars.push({ fret, finger, start: firstString, end: lastString });
          }
        }
      }
    }
    return bars;
  };

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      position: "relative",
      // borderColor: "yellow",
      // borderWidth: 1,
    },
    fretboard: {
      position: "absolute",
      top: fretSpacing,
      left: stringSpacing,
      right: stringSpacing,
      bottom: stringSpacing,
    },
    string: {
      position: "absolute",
      width: 1,
      backgroundColor: theme.colors.onSurface,
      top: 0,
      bottom: 0,
    },
    fret: {
      position: "absolute",
      height: 1,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.onSurface,
    },
    dot: {
      position: "absolute",
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    finger: {
      color: theme.colors.onPrimary,
      fontSize: dotSize * 0.6,
      fontWeight: "bold",
    },
    mute: {
      position: "absolute",
      color: theme.colors.error,
      fontSize: dotSize * 0.8,
      fontWeight: "bold",
      top: -fretSpacing * 0.8,
    },
    open: {
      position: "absolute",
      color: theme.colors.primary,
      fontSize: dotSize * 0.8,
      fontWeight: "bold",
      top: -fretSpacing * 0.8,
    },
    barContainer: {
      position: "absolute",
      height: dotSize,
      backgroundColor: theme.colors.primary,
      borderRadius: dotSize / 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.fretboard}>
        {/* Barras */}
        {findBars().map((bar, index) => (
          <View
            key={`bar-${index}`}
            style={[
              styles.barContainer,
              {
                left: bar.start * stringSpacing,
                width: (bar.end - bar.start) * stringSpacing,
                top: (bar.fret - 0.5) * fretSpacing - dotSize / 2,
              },
            ]}
          />
        ))}

        {/* Strings */}
        {[...Array(stringCount)].map((_, i) => (
          <View key={`string-${i}`} style={[styles.string, { left: i * stringSpacing, width: 1.5 - (1 / fretCount) * i }]} />
        ))}

        {/* Frets */}
        {[...Array(fretCount)].map((_, i) => (
          <View key={`fret-${i}`} style={[styles.fret, { top: i * fretSpacing }]} />
        ))}

        {/* Dots and Markers */}
        {frets.map((fret, i) => {
          if (fret === -1) {
            return (
              <Text key={`mute-${i}`} style={[styles.mute, { left: i * stringSpacing - dotSize * 0.3 }]}>
                ×
              </Text>
            );
          }
          if (fret === 0) {
            return (
              <Text key={`open-${i}`} style={[styles.open, { left: i * stringSpacing - dotSize * 0.3 }]}>
                ○
              </Text>
            );
          }
          return (
            <View
              key={`dot-${i}`}
              style={[
                styles.dot,
                {
                  left: i * stringSpacing - dotSize / 2,
                  top: (fret - 0.5) * fretSpacing - dotSize / 2,
                },
              ]}
            >
              <Text style={styles.finger}>{fingers[i] || ""}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default GuitarChord;
