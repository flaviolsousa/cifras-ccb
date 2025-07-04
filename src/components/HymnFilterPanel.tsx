import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Switch, Text, Icon, Surface, useTheme, Button } from "react-native-paper";

type Props = {
  showOnlyFavorites: boolean;
  showOnlyFlagged: boolean;
  selectedDifficulties: number[];
  selectedRhythms: string[];
  onChangeShowOnlyFavorites: (value: boolean) => void;
  onChangeShowOnlyFlagged: (value: boolean) => void;
  onToggleDifficulty: (difficulty: number) => void;
  onToggleRhythm: (rhythm: string) => void;
  onResetFilters: () => void;
  onCloseFilters: () => void;
  onlyFavoriteChords: boolean;
  onOnlyFavoriteChordsChange: (value: boolean) => void;
  favoriteChords: string[];
};

const HymnFilterPanel: React.FC<Props> = ({
  showOnlyFavorites,
  showOnlyFlagged,
  selectedDifficulties,
  selectedRhythms,
  onChangeShowOnlyFavorites,
  onChangeShowOnlyFlagged,
  onToggleDifficulty,
  onToggleRhythm,
  onResetFilters,
  onCloseFilters,
  onlyFavoriteChords,
  onOnlyFavoriteChordsChange,
  favoriteChords,
}) => {
  const theme = useTheme();

  const difficultyColors = ["#2cba00", "#a3ff00", "#fff400", "#ffa700", "#ff0000"];
  const inactiveColor = "#cccccc";
  const inactiveTextColor = "#888888";
  const rhythmColor = theme.colors.primary;

  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      padding: 8,
      margin: 16,
      borderRadius: 8,
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
    difficultyButtons: {
      flexDirection: "row",
      alignItems: "center",
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
    rhythmButtons: {
      flexDirection: "row",
      alignItems: "center",
    },
    rhythmButton: {
      minWidth: 70,
      height: 30,
      marginLeft: 8,
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      paddingHorizontal: 8,
      borderColor: inactiveColor,
    },
    rhythmButtonSelected: {
      backgroundColor: rhythmColor,
      borderColor: rhythmColor,
    },
    rhythmButtonText: {
      fontWeight: "bold",
      color: inactiveTextColor,
    },
    rhythmButtonTextSelected: {
      textShadowColor: "rgba(0, 0, 0,1)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
      color: "#FFF",
    },
    filterRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
      height: 40,
    },
    disabled: {
      opacity: 0.5,
    },
    disabledText: {
      color: "#999",
    },
  });

  const hasFavoriteChords = !!favoriteChords?.length;

  return (
    <Surface style={styles.container}>
      <View style={styles.filterRow}>
        <Text style={styles.label}>
          Apenas Favoritos <Icon source="star" size={16} color={"#FFD700"} />
        </Text>
        <Switch value={showOnlyFavorites} onValueChange={onChangeShowOnlyFavorites} />
      </View>
      <View style={styles.filterRow}>
        <Text style={styles.label}>
          Apenas para estudar <Icon source="flag" size={16} color={"#d32f2f"} />
        </Text>
        <Switch value={showOnlyFlagged} onValueChange={onChangeShowOnlyFlagged} />
      </View>
      <View style={[styles.filterRow, !hasFavoriteChords && styles.disabled]}>
        <Text style={[styles.label, !hasFavoriteChords && styles.disabledText]}>
          Apenas acordes favoritos
          {!hasFavoriteChords && " (nenhum acorde favorito)"}
        </Text>
        <Switch value={onlyFavoriteChords && hasFavoriteChords} onValueChange={onOnlyFavoriteChordsChange} disabled={!hasFavoriteChords} />
      </View>
      <View style={styles.filterRow}>
        <Text style={styles.label}>Dificuldade:</Text>
        <View style={styles.difficultyButtons}>
          {[1, 2, 3, 4, 5].map((difficulty, idx) => {
            const selected = selectedDifficulties.includes(difficulty);
            const colorful = difficultyColors[idx];
            const color = selected ? colorful : inactiveColor;
            const textColor = selected ? "#fff" : inactiveTextColor;
            return (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.difficultyButton,
                  { borderColor: colorful, marginRight: difficulty !== 5 ? 8 : 0 },
                  selected && { backgroundColor: color },
                ]}
                onPress={() => onToggleDifficulty(difficulty)}
                accessibilityLabel={`Selecionar dificuldade ${difficulty}`}
              >
                <Text style={[styles.difficultyButtonText, selected && styles.difficultyButtonTextSelected, { color: textColor }]}>{difficulty}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.filterRow}>
        <Text style={styles.label}>Ritmo:</Text>
        <View style={styles.rhythmButtons}>
          {["Valsa", "Canção", "Guarânia"].map((rhythm, idx, arr) => {
            const selected = selectedRhythms.includes(rhythm);
            return (
              <TouchableOpacity
                key={rhythm}
                style={[styles.rhythmButton, selected && styles.rhythmButtonSelected]}
                onPress={() => onToggleRhythm(rhythm)}
                accessibilityLabel={`Selecionar ritmo ${rhythm}`}
              >
                <Text style={[styles.rhythmButtonText, selected && styles.rhythmButtonTextSelected]}>{rhythm}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.filterRow}>
        <TouchableOpacity onPress={onResetFilters} style={styles.resetContainer}>
          <Text style={styles.resetText}>Resetar Filtros</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCloseFilters} style={styles.closeFilters}>
          <Text style={styles.resetText}>Ocultar Filtros</Text>
        </TouchableOpacity>
      </View>
    </Surface>
  );
};

export default HymnFilterPanel;
