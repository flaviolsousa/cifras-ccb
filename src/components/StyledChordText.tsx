import React from "react";
import { Text } from "react-native";
import { useTheme } from "react-native-paper";

function cleanChordName(chord: string): string {
  return chord.replaceAll(/[.]/g, "").replaceAll(/\|.*/g, "");
}

interface StyledChordTextProps {
  text: string;
  style: any;
  styleSelected: any;
  onChordPress?: (chord: string) => void;
  selectedChord?: string | null;
  showNotes: boolean;
  fontSize: number;
}

const StyledChordText: React.FC<StyledChordTextProps> = ({ text, style, styleSelected, onChordPress, selectedChord, showNotes, fontSize }) => {
  const theme = useTheme();
  const parts = text.split(/(\[[^\]]+\])/g);
  let lastChordLength: number = 0;

  return (
    <Text style={style}>
      {parts.map((part, index) => {
        let comp;
        if (part.startsWith("[") && part.endsWith("]")) {
          const chordsParts = part.slice(1, -1).split(/[|]/g);
          let currentChord = chordsParts[0].trim();
          let note = chordsParts[1]?.trim();
          comp = (
            <React.Fragment key={`fragment-${index}-${part}`}>
              <Text
                style={[{ color: theme.colors.primary }, cleanChordName(currentChord) === selectedChord && styleSelected]}
                onPress={() => onChordPress?.(currentChord)}
              >
                {currentChord}
              </Text>
              {showNotes && note && <Text style={{ color: theme.colors.secondary, fontSize: fontSize / 2 }}>{note}</Text>}
            </React.Fragment>
          );
          lastChordLength = currentChord.length + (note && showNotes ? Math.ceil(note.length / 2) : 0);
        } else {
          comp = <Text key={`text-${index}-${part}`}>{part.substring(lastChordLength).replace(/[^ ]/g, "_")}</Text>;
        }
        return comp;
      })}
    </Text>
  );
};

export default StyledChordText;
