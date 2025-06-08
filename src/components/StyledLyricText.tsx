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
  return (
    <Text style={style} onLayout={onLayout}>
      {lyrics}
    </Text>
  );
};

export default StyledLyricText;
