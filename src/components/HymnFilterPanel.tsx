import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Switch, Text, Icon, Surface, useTheme, Button } from "react-native-paper";

type Props = {
  showOnlyFavorites: boolean;
  showOnlyFlagged: boolean;
  selectedDifficulties: number[];
  onChangeShowOnlyFavorites: (value: boolean) => void;
  onChangeShowOnlyFlagged: (value: boolean) => void;
  onToggleDifficulty: (difficulty: number) => void;
  onResetFilters: () => void;
  onCloseFilters: () => void;
};

const HymnFilterPanel: React.FC<Props> = ({
  showOnlyFavorites,
  showOnlyFlagged,
  selectedDifficulties,
  onChangeShowOnlyFavorites,
  onChangeShowOnlyFlagged,
  onToggleDifficulty,
  onResetFilters,
  onCloseFilters,
}) => {
  const theme = useTheme();

  const difficultyColors = ["#2cba00", "#a3ff00", "#fff400", "#ffa700", "#ff0000"];
  const inactiveColor = "#cccccc";
  const inactiveTextColor = "#888888";

  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      padding: 8,
      margin: 16,
      borderRadius: 8,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    labelContainer: {
      flex: 1,
      justifyContent: "center",
    },
    label: {
      fontSize: 16,
    },
    resetContainer: {
      flex: 1,
      marginTop: 4,
      padding: 4,
    },
    resetText: {
      color: theme.colors.primary,
      alignSelf: "flex-start",
      fontSize: 14,
      textDecorationLine: "underline",
    },
    closeFilters: {
      color: theme.colors.primary,
      alignSelf: "flex-end",
      fontSize: 14,
      textDecorationLine: "underline",
    },
    difficultyContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    difficultyLabel: {
      flex: 1,
      fontSize: 16,
    },
    difficultyButtons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    difficultyButton: {
      width: 30,
      height: 30,
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      marginHorizontal: 0,
      borderColor: inactiveColor,
    },
    difficultyButtonText: {
      fontWeight: "bold",
    },
    difficultyButtonTextSelected: {
      textShadowColor: "rgba(0, 0, 0,1)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
      color: "#FFF",
    },
  });

  return (
    <Surface style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            Apenas Favoritos
            <Icon source="star" size={16} color={"#FFD700"} />
          </Text>
        </View>
        <Switch value={showOnlyFavorites} onValueChange={onChangeShowOnlyFavorites} />
      </View>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            Apenas para estudar
            <Icon source="flag" size={16} color={"#d32f2f"} />
          </Text>
        </View>
        <Switch value={showOnlyFlagged} onValueChange={onChangeShowOnlyFlagged} />
      </View>
      <View style={styles.difficultyContainer}>
        <Text style={styles.difficultyLabel}>Dificuldade:</Text>
        <View style={styles.difficultyButtons}>
          {[1, 2, 3, 4, 5].map((difficulty, idx) => {
            const selected = selectedDifficulties.includes(difficulty);
            const colorful = difficultyColors[idx];
            const color = selected ? colorful : inactiveColor;
            const textColor = selected ? "#fff" : inactiveTextColor;
            return (
              <TouchableOpacity
                key={difficulty}
                style={[styles.difficultyButton, { borderColor: colorful }, selected && { backgroundColor: color }]}
                onPress={() => onToggleDifficulty(difficulty)}
              >
                <Text style={[styles.difficultyButtonText, selected && styles.difficultyButtonTextSelected, { borderColor: colorful }]}>
                  {difficulty}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={onResetFilters} style={styles.resetContainer}>
          <Text style={styles.resetText}>Reset Filtros</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCloseFilters} style={styles.closeFilters}>
          <Text style={styles.resetText}>Ocultar Filtros</Text>
        </TouchableOpacity>
      </View>
    </Surface>
  );
};

export default HymnFilterPanel;
