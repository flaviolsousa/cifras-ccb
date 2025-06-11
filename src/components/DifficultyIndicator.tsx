import React from "react";
import { useTheme } from "react-native-paper";
import { View, StyleSheet } from "react-native";

interface DifficultyIndicatorProps {
  level: number;
}

const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({ level }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    sector: {
      width: 30,
      height: 10,
    },
  });

  const getColor = (index: number) => {
    const colors = ["#2cba00", "#a3ff00", "#fff400", "#ffa700", "#ff0000"];
    if (index < level) {
      return colors[index];
    } else {
      return theme.colors.surface;
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: level }, (_, i) => i).map((index) => (
        <View key={index} style={[styles.sector, { backgroundColor: getColor(index) }]} />
      ))}
    </View>
  );
};

export default DifficultyIndicator;
