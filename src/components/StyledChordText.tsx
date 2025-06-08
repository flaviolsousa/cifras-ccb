import React from "react";
import { Text } from "react-native";
import { useTheme } from "react-native-paper";

function cleanChordName(chord: string): string {
  return chord.replaceAll(/[.]/g, "");
}

interface StyledChordTextProps {
  text: string;
  style: any;
  styleSelected: any;
  onChordPress?: (chord: string) => void;
  selectedChord?: string | null;
}

const StyledChordText: React.FC<StyledChordTextProps> = ({ text, style, styleSelected, onChordPress, selectedChord }) => {
  const theme = useTheme();
  const parts = text.split(/(\[[^\]]+\])/g);
  let lastChord: string = "";

  return (
    <Text style={style}>
      {parts.map((part, index) => {
        if (part.startsWith("[") && part.endsWith("]")) {
          lastChord = part.slice(1, -1);
          let currentChord = "" + lastChord;
          return (
            <Text
              key={index}
              style={[{ color: theme.colors.primary }, cleanChordName(lastChord) === selectedChord && styleSelected]}
              onPress={() => onChordPress?.(currentChord)}
            >
              {lastChord}
            </Text>
          );
        } else {
          return <Text key={index}>{part.substring(lastChord.length).replace(/[^ ]/g, "_")}</Text>;
        }
      })}
    </Text>
  );
};

export default StyledChordText;
