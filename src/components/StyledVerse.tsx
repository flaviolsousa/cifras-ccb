import React, { useEffect, useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { useTheme } from "react-native-paper";
import StyledChordText from "./StyledChordText";
import StyledLyricText from "./StyledLyricText";
import HymnService from "../services/Hymn/HymnService";

interface HymnVerseProps {
  line: string;
  fontSize: number;
  fontSizeDouble: number;
  verseHeight: number;
  onChordPress: (chord: string) => void;
  selectedChord: string | null;
  onVerseLayout: (event: LayoutChangeEvent) => void;
  showNotes: boolean;
}

function padWordsUnderChords(line: string): string {
  const regex = /(\[[^\]]+\])([^\s\[]*)/g;

  return line.replace(regex, (match, chordNotation, word) => {
    let { chord, notes } = HymnService.splitChord(chordNotation);

    let minLength;
    if (notes) {
      minLength = chord.length + Math.ceil(notes.length / 2);
    } else {
      notes = "";
      minLength = chord.length;
    }

    const currentLength = word.length;
    const paddingNeeded = Math.max(0, minLength - currentLength);
    const paddedWord = word + "_".repeat(paddingNeeded);

    return chordNotation + paddedWord;
  });
}

const HymnVerse: React.FC<HymnVerseProps> = ({
  line,
  fontSize,
  fontSizeDouble,
  verseHeight,
  onChordPress,
  selectedChord,
  onVerseLayout,
  showNotes,
}) => {
  const theme = useTheme();
  const [lineFormatted, setLineFormatted] = useState<string>(line);

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

  useEffect(() => {
    setLineFormatted(padWordsUnderChords(line));
  }, [line]);

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
        text={lineFormatted}
        style={[
          styles.chord,
          {
            fontSize: fontSize,
            lineHeight: fontSizeDouble,
            //color: "red",
          },
        ]}
        styleSelected={styles.chordSelected}
        onChordPress={onChordPress}
        selectedChord={selectedChord}
        showNotes={showNotes}
        fontSize={fontSize}
      />
      <StyledLyricText
        text={lineFormatted}
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
