import React from "react";
import { StyleSheet, Text } from "react-native";
import { useTheme } from "react-native-paper";

interface StyledIntroductionTextProps {
  introduction: string[];
  fontSize: number;
  fontSizeDouble: number;
  selectedChord: string | null;
  onChordPress: (chord: string) => void;
}

function cleanChordName(chord: string): string {
  return chord.replaceAll(/[.]/g, "").replaceAll(/\|.*/g, "");
}

const StyledIntroductionText: React.FC<StyledIntroductionTextProps> = ({ introduction, fontSize, fontSizeDouble, selectedChord, onChordPress }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      fontFamily: "UbuntuMonoRegular",
      marginLeft: 16,
    },
    label: {
      lineHeight: fontSizeDouble,
      color: theme.colors.secondary,
    },
    chord: {
      color: theme.colors.primary,
    },
    selectedChord: {
      color: theme.colors.secondary,
      fontFamily: "UbuntuMonoBold",
    },
  });

  return (
    <Text style={[styles.container, { fontSize, height: fontSizeDouble }]}>
      <Text style={styles.label}>Introdução:</Text>

      {introduction.map((currentChord, index) => (
        <Text
          key={`intro-chord-${index}`}
          style={[styles.chord, cleanChordName(currentChord) === selectedChord && styles.selectedChord]}
          onPress={() => onChordPress(currentChord)}
        >
          {" " + currentChord}
        </Text>
      ))}
    </Text>
  );
};

export default StyledIntroductionText;
