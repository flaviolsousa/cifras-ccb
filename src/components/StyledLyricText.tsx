import React from "react";
import { Text, type LayoutChangeEvent } from "react-native";

interface StyledLyricTextProps {
  text: string;
  style: any;
  onLayout: (event: LayoutChangeEvent) => void;
}

const StyledLyricText: React.FC<StyledLyricTextProps> = ({ text, style, onLayout }) => {
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
              // color: "transparent",
              color: "red",
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
