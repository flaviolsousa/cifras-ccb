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
  notesBigStyle: boolean;
}

function padWordsUnderChords(line: string, notesBigStyle: boolean, showNotes: boolean): string {
  const regex = /(\[[^\]]+\])([^\s\[]*)/g;

  return line.replace(regex, (match, chordNotation, word) => {
    let { chord, notes } = HymnService.splitChord(chordNotation);

    const nextCharIndex = match.length;
    const indexNextChar = line.indexOf(match) + nextCharIndex;
    const nextChar = line[indexNextChar];

    let minLength = nextChar === "[" ? 1 : 0; // to check if the chord is in the middle of a word that has another chord in sequence
    if (showNotes && notes) {
      const notesLength = notesBigStyle ? notes.length : Math.ceil(notes.length / 2);
      minLength += chord.length + notesLength;
    } else {
      notes = "";
      minLength += chord.length;
    }

    const currentLength = word.length;
    const paddingNeeded = Math.max(0, minLength - currentLength);
    let paddedWord = word + "_".repeat(paddingNeeded);

    // Verifica se há um [ logo após a palavra
    if (paddingNeeded > 0 && nextChar === "[") {
      paddedWord += "-_";
    }

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
  notesBigStyle,
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
    setLineFormatted(padWordsUnderChords(line, notesBigStyle, showNotes));
  }, [line, notesBigStyle, showNotes]);

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
        notesBigStyle={notesBigStyle}
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
