import React from 'react';
import { Text } from 'react-native';
import { useTheme } from 'react-native-paper';

interface StyledChordTextProps {
  text: string;
  style: any;
}

const StyledChordText = ({ text, style }: StyledChordTextProps) => {
  const theme = useTheme();
  const parts = text.split(/([^_]+)/g).filter(Boolean);

  return (
    <Text style={style}>
      {parts.map((part, index) =>
        part.includes("_") ? (
          <Text key={index}>{part}</Text>
        ) : (
          <Text key={index} style={{ color: theme.colors.primary }}>
            {part}
          </Text>
        ),
      )}
    </Text>
  );
};

export default StyledChordText;
