import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface GuitarChordProps {
  name: string;
  frets?: number[];
  fingers?: number[];
  size?: number;
}

const GuitarChord = ({ name, frets = [0, 0, 0, 0, 0, 0], fingers = [0, 0, 0, 0, 0, 0], size = 50 }: GuitarChordProps) => {
  const theme = useTheme();
  const stringSpacing = size / 7;
  const fretSpacing = size / 7;

  return (
    <View style={styles.container}>
      <View style={[styles.diagram, { width: size, height: size }]}>
        {/* Strings */}
        {[0, 1, 2, 3, 4, 5].map((string) => (
          <View
            key={`string-${string}`}
            style={[
              styles.string,
              {
                left: string * stringSpacing + stringSpacing,
                height: size - 10,
                backgroundColor: theme.colors.onSurface,
              },
            ]}
          />
        ))}

        {/* Frets */}
        {[0, 1, 2, 3, 4].map((fret) => (
          <View
            key={`fret-${fret}`}
            style={[
              styles.fret,
              {
                top: fret * fretSpacing + 5,
                width: size - 10,
                backgroundColor: theme.colors.onSurface,
              },
            ]}
          />
        ))}

        {/* Fingers/Dots */}
        {frets.map((fret, string) => {
          if (fret >= 0) {
            return (
              <View
                key={`dot-${string}`}
                style={[
                  styles.dot,
                  {
                    left: string * stringSpacing + stringSpacing - 5,
                    top: (fret === 0 ? 0 : fret * fretSpacing) + (fret === 0 ? 0 : 2),
                    width: 10,
                    height: 10,
                    backgroundColor: fret === 0 ? "transparent" : theme.colors.primary,
                    borderRadius: 5,
                  },
                ]}
              >
                {fret === 0 && <Text style={[styles.openString, { color: theme.colors.onSurface }]}>○</Text>}
              </View>
            );
          }
          return null;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  diagram: {
    position: "relative",
  },
  string: {
    position: "absolute",
    width: 1,
    top: 5,
  },
  fret: {
    position: "absolute",
    height: 1,
    left: 5,
  },
  dot: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  openString: {
    fontSize: 12,
  },
});

export default GuitarChord;
