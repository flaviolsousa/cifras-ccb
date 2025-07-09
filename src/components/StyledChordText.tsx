import React from "react";
import { Text } from "react-native";
import { useTheme } from "react-native-paper";
import HymnService from "../services/Hymn/HymnService";

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
          const { chord, notes } = HymnService.splitChord(part);
          comp = (
            <React.Fragment key={`fragment-${index}-${part}`}>
              <Text
                style={[{ color: theme.colors.primary }, cleanChordName(chord) === selectedChord && styleSelected]}
                onPress={() => onChordPress && onChordPress(chord)}
              >
                {chord}
              </Text>
              {showNotes && notes && (
                <>
                  {notes.split("").map((char, i) =>
                    char === " " ? (
                      <Text key={"note-space-" + i} style={{ color: "transparent", fontSize: fontSize / 2 }}>
                        _
                      </Text>
                    ) : (
                      <Text key={"note-char-" + i} style={{ color: theme.colors.secondary, fontSize: fontSize / 2 }}>
                        {char}
                      </Text>
                    ),
                  )}
                  {notes.length % 2 == 1 && <Text style={{ fontSize: fontSize / 2 }}>_</Text>}
                </>
              )}
            </React.Fragment>
          );
          lastChordLength = chord.length + (notes && showNotes ? Math.ceil(notes.length / 2) : 0);
        } else {
          comp = <Text key={`text-${index}-${part}`}>{part.substring(lastChordLength).replace(/‿/g, "__").replace(/[^ ]/g, "_")}</Text>;
        }
        return comp;
      })}
    </Text>
  );
};

export default StyledChordText;
