import React from "react";
import { Text, type LayoutChangeEvent } from "react-native";
import { useTheme } from "react-native-paper";

interface StyledLyricTextProps {
  text: string;
  style: any;
  onLayout: (event: LayoutChangeEvent) => void;
}

const StyledLyricText: React.FC<StyledLyricTextProps> = ({ text, style, onLayout }) => {
  const theme = useTheme();
  // Remove chord markers for lyrics display
  const lyrics = text.replace(/\[[^\]]+\]/g, "");

  // Split text into array to handle each character
  const characters = lyrics.split("");

  return (
    <Text style={style} onLayout={onLayout}>
      {characters.map((char, index) =>
        char === "_" ? (
          <Text
            key={index}
            style={{
              color: theme.colors.surface,
              // color: "red",
            }}
          >
            {char}
          </Text>
        ) : (
          <React.Fragment key={index}>{char}</React.Fragment>
        ),
      )}
    </Text>
  );
};

export default StyledLyricText;
