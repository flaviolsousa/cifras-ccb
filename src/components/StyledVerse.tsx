import React from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { useTheme } from "react-native-paper";
import StyledChordText from "./StyledChordText";
import StyledLyricText from "./StyledLyricText";

interface HymnVerseProps {
  line: string;
  fontSize: number;
  fontSizeDouble: number;
  verseHeight: number;
  onChordPress: (chord: string) => void;
  selectedChord: string | null;
  onVerseLayout: (event: LayoutChangeEvent) => void;
}

const HymnVerse: React.FC<HymnVerseProps> = ({ line, fontSize, fontSizeDouble, verseHeight, onChordPress, selectedChord, onVerseLayout }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    verse: {
      position: "relative",
    },
    chord: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      fontFamily: "UbuntuMonoRegular",
      color: "transparent",
      zIndex: 1,
    },
    chordSelected: {
      fontFamily: "UbuntuMonoBold",
      color: theme.colors.secondary,
    },
    lyric: {
      position: "absolute",
      left: 0,
      right: 0,
      fontFamily: "UbuntuMonoRegular",
      color: theme.colors.secondary,
    },
  });

  return (
    <View
      style={[
        styles.verse,
        {
          height: verseHeight,
          marginBottom: fontSize,
        },
      ]}
    >
      <StyledChordText
        text={line}
        style={[
          styles.chord,
          {
            fontSize: fontSize,
            lineHeight: fontSizeDouble,
          },
        ]}
        styleSelected={styles.chordSelected}
        onChordPress={onChordPress}
        selectedChord={selectedChord}
      />
      <StyledLyricText
        text={line}
        style={[
          styles.lyric,
          {
            top: fontSize,
            fontSize: fontSize,
            lineHeight: fontSizeDouble,
          },
        ]}
        onLayout={onVerseLayout}
      />
    </View>
  );
};

export default HymnVerse;
